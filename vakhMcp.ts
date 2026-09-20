import {
  Client,
  StreamableHTTPClientTransport,
  UnauthorizedError,
  type OAuthClientInformationMixed,
  type OAuthClientMetadata,
  type OAuthClientProvider,
  type OAuthDiscoveryState,
  type OAuthTokens,
} from "@modelcontextprotocol/client";

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { exec } from "node:child_process";

const VAKH_MCP_URL = "https://xo.vakh.com/mcp";
const VAKH_FORM_ID = "u5pr";

const CALLBACK_PORT = 8090;
const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}/callback`;

// Persist OAuth state to disk so token survives Vercel cold starts.
const TOKEN_PATH = path.join(
  process.cwd(),
  ".vakh-oauth.json"
);

interface VakhOAuthPersistedState {
  clientInfo?: OAuthClientInformationMixed;
  tokens?: OAuthTokens;
  codeVerifier?: string;
  discovery?: OAuthDiscoveryState;
}

function loadPersistedState(): VakhOAuthPersistedState {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const raw = fs.readFileSync(TOKEN_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // Corrupted file — start fresh.
  }
  return {};
}

function savePersistedState(state: VakhOAuthPersistedState): void {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to persist Vakh OAuth state:", err);
  }
}

class VakhOAuthProvider implements OAuthClientProvider {
  private clientInfo?: OAuthClientInformationMixed;
  private tokenData?: OAuthTokens;
  private verifier?: string;
  private discoveryData?: OAuthDiscoveryState;
  private oauthState = randomUUID();
  private persisted: VakhOAuthPersistedState;

  constructor() {
    this.persisted = loadPersistedState();
    this.clientInfo = this.persisted.clientInfo;
    this.tokenData = this.persisted.tokens;
    this.verifier = this.persisted.codeVerifier;
    this.discoveryData = this.persisted.discovery;
  }

  get redirectUrl() {
    return CALLBACK_URL;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      client_name: "FoodGuard X",
      redirect_uris: [CALLBACK_URL],
      response_types: ["code"],
      grant_types: ["authorization_code", "refresh_token"],
      token_endpoint_auth_method: "none",
      application_type: "native",
    };
  }

  state() {
    return this.oauthState;
  }

  clientInformation() {
    return this.clientInfo;
  }

  saveClientInformation(info: OAuthClientInformationMixed) {
    this.clientInfo = info;
    this.persisted.clientInfo = info;
    savePersistedState(this.persisted);
  }

  tokens() {
    return this.tokenData;
  }

  saveTokens(tokens: OAuthTokens) {
    this.tokenData = tokens;
    this.persisted.tokens = tokens;
    savePersistedState(this.persisted);
  }

  redirectToAuthorization(url: URL) {
    console.log("\nOpening Vakh authorization:");
    console.log(url.toString());

    exec(
      process.platform === "win32"
        ? `start "" "${url.toString()}"`
        : `open "${url.toString()}"`
    );
  }

  saveCodeVerifier(verifier: string) {
    this.verifier = verifier;
    this.persisted.codeVerifier = verifier;
    savePersistedState(this.persisted);
  }

  codeVerifier() {
    if (!this.verifier) {
      throw new Error("OAuth code verifier is missing");
    }

    return this.verifier;
  }

  saveDiscoveryState(discovery: OAuthDiscoveryState) {
    this.discoveryData = discovery;
    this.persisted.discovery = discovery;
    savePersistedState(this.persisted);
  }

  discoveryState() {
    return this.discoveryData;
  }
}

let client: Client | null = null;
let transport: StreamableHTTPClientTransport | null = null;
let provider: VakhOAuthProvider | null = null;

async function authorizeVakh() {
  provider = new VakhOAuthProvider();

  transport = new StreamableHTTPClientTransport(
    new URL(VAKH_MCP_URL),
    {
      authProvider: provider,
    }
  );

  client = new Client({
    name: "foodguard-x",
    version: "1.0.0",
  });

  try {
    await client.connect(transport);
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      throw error;
    }

    console.log("Vakh OAuth authorization required.");

    await new Promise<void>((resolve, reject) => {
      const callbackServer = http.createServer(
        async (req, res) => {
          try {
            const requestUrl = new URL(
              req.url ?? "/",
              `http://localhost:${CALLBACK_PORT}`
            );

            if (requestUrl.pathname !== "/callback") {
              res.writeHead(404);
              res.end("Not found");
              return;
            }

            await transport!.finishAuth(requestUrl.searchParams);

            res.writeHead(200, {
              "Content-Type": "text/html",
            });

            res.end(`
              <h2>FoodGuard X connected to Vakh</h2>
              <p>You can close this tab.</p>
            `);

            callbackServer.close();
            resolve();
          } catch (err) {
            callbackServer.close();
            reject(err);
          }
        }
      );

      callbackServer.listen(
        CALLBACK_PORT,
        "127.0.0.1",
        () => {
          console.log(
            `Waiting for Vakh OAuth at ${CALLBACK_URL}`
          );
        }
      );
    });

    transport = new StreamableHTTPClientTransport(
      new URL(VAKH_MCP_URL),
      {
        authProvider: provider,
      }
    );

    client = new Client({
      name: "foodguard-x",
      version: "1.0.0",
    });

    await client.connect(transport);
  }

  console.log("FoodGuard X connected to Vakh MCP");
}

export async function connectVakh() {
  if (client) {
    return client;
  }

  await authorizeVakh();

  return client!;
}

export async function getVakhBatch(batchId: string) {
  let mcp: Client;
  try {
    mcp = await connectVakh();
  } catch (err: any) {
    console.warn('Vakh MCP connection failed:', err?.message || err);
    return null;
  }

  let result: any;
  try {
    result = await Promise.race([
      mcp.callTool({
        name: "list_posts",
        arguments: {
          form_id: VAKH_FORM_ID,
          limit: 100,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Vakh MCP call timed out (10s)')), 10_000)
      ),
    ]);
  } catch (err: any) {
    console.warn('Vakh MCP tool call failed:', err?.message || err);
    client = null;
    transport = null;
    return null;
  }

  const resultAny = result as any;

  // Vakh may expose structured results directly.
  const posts =
    resultAny?.structuredContent?.posts ??
    resultAny?.structuredContent?.result?.posts ??
    [];

  // Fallback: inspect text content.
  if (!posts.length && Array.isArray(resultAny?.content)) {
    for (const item of resultAny.content) {
      if (item?.type === "text" && typeof item.text === "string") {
        try {
          const parsed = JSON.parse(item.text);

          if (Array.isArray(parsed?.posts)) {
            posts.push(...parsed.posts);
          }
        } catch {
          // Ignore non-JSON text.
        }
      }
    }
  }

  const normalizedBatchId = batchId.trim().toLowerCase();

  const post = posts.find(
    (item: any) =>
      String(item?.fields?.batch_id ?? "")
        .trim()
        .toLowerCase() === normalizedBatchId
  );

  if (!post) {
    return null;
  }

  return post;
}
