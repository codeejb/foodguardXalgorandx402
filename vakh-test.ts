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
import { randomUUID } from "node:crypto";
import { exec } from "node:child_process";

const VAKH_MCP_URL = "https://xo.vakh.com/mcp";
const CALLBACK_PORT = 8090;
const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}/callback`;

class VakhOAuthProvider implements OAuthClientProvider {
  private clientInfo?: OAuthClientInformationMixed;
  private tokenData?: OAuthTokens;
  private verifier?: string;
  private discoveryData?: OAuthDiscoveryState;
  private oauthState = randomUUID();

  get redirectUrl() {
    return CALLBACK_URL;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      client_name: "FoodGuard X Local Test",
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
  }

  tokens() {
    return this.tokenData;
  }

  saveTokens(tokens: OAuthTokens) {
    this.tokenData = tokens;
  }

  redirectToAuthorization(url: URL) {
    console.log("\nOpening Vakh authorization page:");
    console.log(url.toString());

    exec(
      process.platform === "win32"
        ? `start "" "${url.toString()}"`
        : `open "${url.toString()}"`
    );
  }

  saveCodeVerifier(verifier: string) {
    this.verifier = verifier;
  }

  codeVerifier() {
    if (!this.verifier) {
      throw new Error("OAuth code verifier is missing");
    }

    return this.verifier;
  }

  saveDiscoveryState(discovery: OAuthDiscoveryState) {
    this.discoveryData = discovery;
  }

  discoveryState() {
    return this.discoveryData;
  }
}

async function main() {
  const provider = new VakhOAuthProvider();

  let transport = new StreamableHTTPClientTransport(
    new URL(VAKH_MCP_URL),
    {
      authProvider: provider,
    }
  );

  const client = new Client({
    name: "foodguard-x-local-test",
    version: "1.0.0",
  });

  try {
    console.log("Connecting to Vakh...");

    await client.connect(transport);

  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      throw error;
    }

    console.log("\nVakh requires OAuth.");
    console.log("Complete the browser authorization that just opened.");
    console.log(`Waiting for callback on ${CALLBACK_URL}...`);

    await new Promise<void>((resolve, reject) => {
      const callbackServer = http.createServer(async (req, res) => {
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

          console.log("\nOAuth callback received.");

          await transport.finishAuth(requestUrl.searchParams);

          res.writeHead(200, {
            "Content-Type": "text/html",
          });

          res.end(`
            <h2>FoodGuard X / Vakh authorization successful.</h2>
            <p>You can close this browser tab.</p>
          `);

          callbackServer.close();

          resolve();
        } catch (callbackError) {
          callbackServer.close();
          reject(callbackError);
        }
      });

      callbackServer.listen(CALLBACK_PORT, "127.0.0.1", () => {
        console.log(`Callback server listening on ${CALLBACK_URL}`);
      });
    });

    // Reconnect with the newly acquired OAuth credentials.
    transport = new StreamableHTTPClientTransport(
      new URL(VAKH_MCP_URL),
      {
        authProvider: provider,
      }
    );

    await client.connect(transport);
  }

  console.log("\n✅ Connected to Vakh!");

  console.log("\nAvailable tools:");

  const tools = await client.listTools();

  for (const tool of tools.tools) {
    console.log(`- ${tool.name}`);
  }

  console.log("\nCalling list_posts for FoodGuard X...");

  const result = await client.callTool({
    name: "list_posts",
    arguments: {
      form_id: "u5pr",
      limit: 100,
    },
  });

  console.log("\n===== VAKH RESULT =====");
  console.log(JSON.stringify(result, null, 2));

  console.log("\n===== SEARCHING FOR M492 =====");

  const resultText = JSON.stringify(result);

  if (resultText.includes('"batch_id":"M492"')) {
    console.log("✅ M492 FOUND!");
  } else {
    console.log("❌ M492 was not found in the returned records.");
  }

  await transport.close();
}

main().catch((error) => {
  console.error("\n❌ Test failed:");
  console.error(error);
  process.exit(1);
});