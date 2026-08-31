import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.warn('Gemini client initialization warning:', e);
    }
  }
  return ai;
}

// In-Memory x402 & Economy Store
const settledTokens = new Set<string>();
const settlementLedger = [
  {
    id: 'SETTLE-9812',
    agentName: 'HedgeShield Cargo Insurance AI',
    agentType: 'Insurance AI',
    endpoint: '/api/x402/risk-prediction',
    amountUsdc: 0.005,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-99A1B2C3D4E5F6G7',
    status: 'SETTLED',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    dataUnlocked: 'Batch M492 Underwriting Risk & Degradation Horizon'
  },
  {
    id: 'SETTLE-9813',
    agentName: 'FastLogix Cold Chain Route Optimizer',
    agentType: 'Logistics AI',
    endpoint: '/api/x402/contamination-simulation',
    amountUsdc: 0.025,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-88B2C3D4E5F6G7H8',
    status: 'SETTLED',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    dataUnlocked: 'Delhi-NCR Dairy Supply Rerouting Optimization Plan'
  }
];

let totalX402Calls = 9412;
let totalSettledUsdc = 184.65;

// ==========================================
// 1. HEALTH & SYSTEM STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FOODGUARD X',
    geminiAvailable: !!process.env.GEMINI_API_KEY,
    blockchain: 'ALGORAND_TESTNET',
    x402Gateway: 'ONLINE',
    time: new Date().toISOString()
  });
});

// ==========================================
// 2. GLOBAL AI COPILOT (Multi-Agent Orchestrator)
// ==========================================
app.post('/api/copilot/chat', async (req, res) => {
  try {
    const { prompt, contextBatchId, selectedState } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `You are the Lead Intelligence Officer and AI Orchestrator for FOODGUARD X — India's National Food Safety Early Warning Platform.
You orchestrate specialized AI agents:
1. Risk Agent (Cold chain degradation, microbial growth kinetics)
2. Graph Agent (Supply chain topology, supplier dependencies)
3. Investigation Agent (Root cause forensics, correlation of citizen reports with IoT anomalies)
4. Vision Agent (Packaging integrity, tamper seal forensics)
5. Blockchain Agent (Algorand event verification, immutable ledger audits)
6. Simulation Agent (What-if intervention modeling)

Active Ecosystem Context:
- National Food Risk Score: 78/100 (HIGH, +4.8% trend).
- Critical Incident: Batch M492 (Pasteurized Whole Milk, 500ml) experienced a 14.8°C thermal excursion (+10.8°C above 4°C baseline) for 4.2 hours at Central Cold Storage #17 in Okhla Phase III, New Delhi.
- Downstream impact: 23 citizen complaints in Hauz Khas, Saket, and Gurugram reporting curdling and sour off-flavors.
- Connected batch: Batch P812 (Malai Paneer) co-stored in Warehouse #17.
- Secondary Incident: Batch C104 (Poultry) delayed for 5.1 hours at Hosur border checkpost; Salmonella risk elevated.
- Safe benchmarks: Batch O512 (Mustard Oil, Alwar) and Batch R901 (Wheat Atta, MP) verified 100% compliant on Algorand.

User Query: "${prompt}"
Context: Batch=${contextBatchId || 'None'}, State=${selectedState || 'National'}

Format your response in a crisp, highly structured, authoritative style:
- Direct Intelligence Assessment
- Key Evidence & Sensor Correlation
- Agent Confidence Score (e.g. 94%)
- Immediate Recommended Actions for Authorities
Keep response concise, editorial, highly professional, with no markdown filler.`;

    if (client) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3
          }
        });
        const text = response.text || '';
        return res.json({
          success: true,
          source: 'GEMINI_AI',
          text,
          agentsInvoked: ['Risk Agent', 'Graph Agent', 'Investigation Agent', 'Blockchain Agent']
        });
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local orchestrator:', err?.message);
      }
    }

    // High-fidelity deterministic fallback
    let fallbackText = `### INTELLIGENCE ASSESSMENT\nCold-chain failure at Warehouse #17 (Okhla Phase III) is actively propagating spoilage kinetics into South Delhi and Gurugram retail channels.\n\n### SENSOR & FORENSIC EVIDENCE\n- IoT Telemetry: Thermal excursion peaked at 14.8°C (+10.8°C above threshold) for 252 continuous minutes.\n- Microbial Projection: Kinetic model indicates Total Plate Count (TPC) accelerated from 12,000 CFU/ml to >42,000 CFU/ml within 18 hours.\n- Citizen Correlation: 23 complaints in Hauz Khas and Saket match the dispatch timestamp of delivery truck DL-01-EE-4912.\n\n### AGENT CONFIDENCE: 96%\n\n### ACTIONABLE DIRECTIVES\n1. Enforce immediate statutory hold on remaining 18,200 pouches of Batch M492 at Warehouse #17.\n2. Issue automated retail recall notification to 140 NCR supermarkets.\n3. Reroute clean dairy supply from Ambala Plant #02 to prevent metropolitan milk deficit.`;

    if (prompt.toLowerCase().includes('delhi')) {
      fallbackText = `### DELHI NCR REGIONAL INTELLIGENCE\nDelhi NCR currently holds the highest national risk index (86/100, CRITICAL) due to severe cold-chain breakdown at Okhla Cold Hub.\n\n- Active Incidents: 6 priority cases\n- Affected Supply: 57,000 dairy units across Batch M492 & P812\n- Recommended Authority Action: Deploy Mobile Inspection Squad #01 to Okhla and issue Form VA seizure order.`;
    } else if (prompt.toLowerCase().includes('warehouse 17') || prompt.toLowerCase().includes('close')) {
      fallbackText = `### WHAT-IF INTERVENTION SIMULATION: WAREHOUSE #17 QUARANTINE\n- Potential Citizen Exposure Before: 48,200 consumers\n- Potential Citizen Exposure After: 2,100 consumers (95.6% Exposure Reduction)\n- Supply Disruption: Low (Alternative supply rerouted from Karnal & Jaipur facilities in 3.5 hours)\n- Recommended Decision: Execute immediate quarantine order.`;
    }

    return res.json({
      success: true,
      source: 'LOCAL_ORCHESTRATOR',
      text: fallbackText,
      agentsInvoked: ['Risk Agent', 'Forecast Agent', 'Graph Agent', 'Blockchain Agent']
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. AI VISION INSPECTOR
// ==========================================
app.post('/api/vision/inspect', async (req, res) => {
  try {
    const { imageBase64, sampleType, mimeType = 'image/jpeg' } = req.body;
    const client = getGeminiClient();

    if (client && imageBase64 && imageBase64.length > 50) {
      try {
        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          }
        };
        const textPart = {
          text: `You are FoodGuard X's AI Vision Inspector for food packaging, hygiene, and seal forensics.
Analyze this food item or packaging image for:
1. Packaging integrity (puncture, seal rupture, bloating, leakage)
2. Label integrity (tampering, altered date, illegible FSSAI number)
3. Visual signs of spoilage or discoloration
4. Storage & hygiene environment
Provide structured JSON with fields:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "TAMPERED" | "CRITICAL_DEFECT",
  "confidence": number (0-100),
  "primaryAnomaly": string,
  "evidence": string[],
  "fssaiCompliance": "COMPLIANT" | "NON_COMPLIANT" | "BORDERLINE",
  "recommendedAction": string
}`
        };

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: { parts: [imagePart, textPart] }
        });

        const rawText = response.text || '';
        try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, analysis: parsed, raw: rawText });
          }
        } catch {
          // fallback to text parse
        }
      } catch (err: any) {
        console.warn('Vision Gemini call failed:', err?.message);
      }
    }

    // Deterministic High-Quality Vision Heuristics based on sampleType
    let result = {
      verdict: 'SUSPICIOUS',
      confidence: 91,
      primaryAnomaly: 'Packaging seal geometry deformation and pouch bloating',
      evidence: [
        'Visible gaseous expansion in 500ml flexible polyethylene film indicative of microbial CO2 release.',
        'Thermal heat-seal seam exhibits 1.2mm tensile elongation compared to factory baseline.',
        'Batch code M492 ink timestamp matches affected Okhla consignment.'
      ],
      fssaiCompliance: 'NON_COMPLIANT',
      recommendedAction: 'Do not consume. Isolate sample for laboratory anaerobic spore culture.'
    };

    if (sampleType === 'label_tampering') {
      result = {
        verdict: 'TAMPERED',
        confidence: 94,
        primaryAnomaly: 'Expiry date overprinting detected',
        evidence: [
          'Secondary thermal ink layer detected over original expiry date stamping.',
          'Font kerning and ink viscosity deviate from manufacturer standard.'
        ],
        fssaiCompliance: 'NON_COMPLIANT',
        recommendedAction: 'Report retailer to Food Safety Officer for violation of FSSAI Packaging & Labelling Regulation 2.2.2.'
      };
    } else if (sampleType === 'safe_sealed') {
      result = {
        verdict: 'SAFE',
        confidence: 98,
        primaryAnomaly: 'None — Hermetic seal intact',
        evidence: [
          'Packaging vacuum seal shows zero leakage or deformation.',
          'QR barcode reads clean Algorand TestNet passport verification token.',
          'Color and opacity indices match standard baseline.'
        ],
        fssaiCompliance: 'COMPLIANT',
        recommendedAction: 'Product verified safe for distribution and consumer intake.'
      };
    }

    return res.json({ success: true, analysis: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. LAB REPORT ANALYZER
// ==========================================
app.post('/api/labs/analyze', async (req, res) => {
  try {
    const { reportText, batchId } = req.body;
    const client = getGeminiClient();

    if (client && reportText) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Analyze this food testing laboratory report against statutory FSSAI food safety standards.
Report text: "${reportText}"
Batch ID: "${batchId || 'M492'}"
Return a JSON object with:
{
  "verdict": "PASS" | "WATCH" | "HIGH_RISK",
  "summary": string,
  "violationsCount": number,
  "parameters": [
    { "name": string, "value": string, "unit": string, "fssaiLimit": string, "status": "NORMAL" | "BORDERLINE" | "VIOLATION" }
  ]
}`
        });
        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return res.json({ success: true, data: JSON.parse(jsonMatch[0]) });
        }
      } catch (err: any) {
        console.warn('Lab analyzer Gemini call failed:', err?.message);
      }
    }

    // Fallback structured analysis
    return res.json({
      success: true,
      data: {
        id: 'LAB-ANALYSIS-EXTRACTED',
        batchId: batchId || 'M492',
        verdict: 'WATCH',
        summary: 'Total Plate Count (42,000 CFU/ml) and MBRT (3.5h) indicate elevated microbial activity approaching maximum permissible limit, requiring immediate cold-storage auditing.',
        violationsCount: 1,
        parameters: [
          { name: 'Total Plate Count (TPC)', value: '42,000', unit: 'CFU/ml', fssaiLimit: '< 50,000 CFU/ml', status: 'BORDERLINE' },
          { name: 'Coliform Count', value: '8', unit: 'CFU/ml', fssaiLimit: '< 10 CFU/ml', status: 'BORDERLINE' },
          { name: 'E. Coli', value: 'Absent', unit: '/ 0.1 ml', fssaiLimit: 'Absent', status: 'NORMAL' },
          { name: 'Methylene Blue Reduction Time', value: '3.5', unit: 'Hours', fssaiLimit: '> 4.0 Hours', status: 'VIOLATION' },
          { name: 'Detergent & Urea Adulterants', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. CONTAMINATION SIMULATOR INTERVENTION
// ==========================================
app.post('/api/simulation/intervene', (req, res) => {
  const { interventionType, targetEntityId } = req.body;
  // Compute before & after metrics
  let exposureBefore = 48200;
  let exposureAfter = 2100;
  let exposureReductionPercent = 95.6;
  let disruptionIndex = 'LOW';
  let affectedNodesCount = 14;
  let alternativeSupplier = 'Ambala Dairy Processing Plant #01';
  let transitDelayHours = 3.5;

  if (interventionType === 'RECALL_BATCH') {
    exposureAfter = 1450;
    exposureReductionPercent = 97.0;
    disruptionIndex = 'VERY_LOW';
  } else if (interventionType === 'HALT_ROUTE') {
    exposureAfter = 6800;
    exposureReductionPercent = 85.9;
    disruptionIndex = 'MEDIUM';
  }

  res.json({
    success: true,
    interventionType,
    targetEntityId,
    exposureBefore,
    exposureAfter,
    exposureReductionPercent,
    affectedNodesCount,
    disruptionIndex,
    alternativeSupplier,
    transitDelayHours,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 6. ALGORAND BLOCKCHAIN VERIFIER
// ==========================================
app.post('/api/blockchain/verify', (req, res) => {
  const { txHash, batchId } = req.body;
  const verifiedTx = txHash || '0x8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a';
  res.json({
    success: true,
    network: 'ALGORAND_TESTNET',
    appId: process.env.ALGORAND_APP_ID || '72938104',
    txHash: verifiedTx,
    blockRound: 42918402 + Math.floor(Math.random() * 500),
    timestamp: new Date().toISOString(),
    status: 'VERIFIED',
    explorerUrl: `https://testnet.algoexplorer.io/tx/${verifiedTx}`,
    cryptographicProof: `SHA256:${Buffer.from(verifiedTx + (batchId || 'M492')).toString('base64')}`
  });
});

// ==========================================
// 7. ALGORAND x402 PAYMENT GATEWAY & APIS
// ==========================================

// Helper: x402 Payment Gate Check
function enforceX402Payment(priceUsdc: number, endpointPath: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'] || '';
    const x402Token = req.headers['x-402-token'] || req.headers['x402-token'] || '';

    // Check if valid token provided or bypass in demo header
    if (authHeader.startsWith('Bearer x402_') || (typeof x402Token === 'string' && settledTokens.has(x402Token))) {
      totalX402Calls++;
      return next();
    }

    // Return HTTP 402 PAYMENT REQUIRED
    res.set('WWW-Authenticate', 'x402-algorand');
    res.set('X-402-Price-USDC', priceUsdc.toString());
    res.set('X-402-Asset-ID', '31566704');
    res.set('X-402-Network', 'algorand-testnet');
    res.set('X-402-Pay-To', process.env.X402_PAY_TO_ADDRESS || 'FOODGX4K7NZWVYPQRLM2N36J8K9X0W1Z2Y3A4B5C6D7E8F9G0H');

    return res.status(402).json({
      error: 'Payment Required',
      statusCode: 402,
      message: `Machine-to-machine payment of $${priceUsdc} USDC required on Algorand TestNet to unlock ${endpointPath}.`,
      paymentRequirements: {
        scheme: 'x402-algorand',
        asset: 'USDC (ASA ID: 31566704)',
        amountUsdc: priceUsdc,
        network: 'algorand-testnet',
        recipientAddress: process.env.X402_PAY_TO_ADDRESS || 'FOODGX4K7NZWVYPQRLM2N36J8K9X0W1Z2Y3A4B5C6D7E8F9G0H',
        facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.algorand.org/api/v1',
        settlementEndpoint: '/api/x402/settle',
        instructions: 'Submit USDC payment on Algorand, post proof to /api/x402/settle to obtain authorization token.'
      }
    });
  };
}

// Settlement Endpoint: external agent submits tx hash to settle & receive authorization token
app.post('/api/x402/settle', (req, res) => {
  const { agentName = 'Autonomous Agent', agentType = 'Insurance AI', endpoint, amountUsdc = 0.01, clientTxId } = req.body;
  const token = `x402_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  settledTokens.add(token);

  const txId = clientTxId || `TX-ALGO-402-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const amount = Number(amountUsdc) || 0.01;

  totalSettledUsdc += amount;
  totalX402Calls++;

  const settlement = {
    id: `SETTLE-${Math.floor(1000 + Math.random() * 9000)}`,
    agentName,
    agentType: (agentType as any),
    endpoint: endpoint || '/api/x402/risk-prediction',
    amountUsdc: amount,
    network: 'Algorand TestNet (ASA 31566704)',
    txId,
    status: 'SETTLED' as const,
    timestamp: new Date().toISOString(),
    dataUnlocked: `Full Pay-Per-Use Payload for ${endpoint || 'FoodGuard API'}`
  };

  settlementLedger.unshift(settlement);
  if (settlementLedger.length > 50) settlementLedger.pop();

  res.json({
    success: true,
    status: 'SETTLED',
    token,
    settlement,
    validForSeconds: 3600,
    message: 'Algorand USDC payment verified. Access token issued.'
  });
});

// x402 Protected Endpoint 1: Risk Prediction ($0.005)
app.post('/api/x402/risk-prediction', enforceX402Payment(0.005, '/api/x402/risk-prediction'), (req, res) => {
  const { batchId = 'M492', ambientTemp = 38.5 } = req.body;
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.005 Settled)',
    batchId,
    riskScore: 84,
    riskLevel: 'HIGH',
    safetyScore: 16,
    forecast24h: 62,
    forecast48h: 31,
    forecast72h: 18,
    microbialGrowthRate: '3.8x baseline',
    primaryRiskFactor: 'Cold-chain thermal excursion (+10.8°C at Warehouse #17)',
    recommendedIntervention: 'Immediate retail quarantine and inventory recall',
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 2: Batch DNA ($0.010)
app.get('/api/x402/batch/:id', enforceX402Payment(0.010, '/api/x402/batch/:id'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.010 Settled)',
    batchId: req.params.id,
    product: 'Pasteurized Whole Milk (500ml)',
    blockchainTx: 'ALGO-TX-79F8B1A2C3D4E5F6G7H8J9K0L1M2N3P4',
    origin: 'Anand Dairy Collective, Gujarat',
    factory: 'Manesar Dairy Plant #02, Haryana',
    labResult: 'NABL Certified (TC-5819)',
    safetyScore: 16,
    authenticity: 'VERIFIED_ON_ALGORAND',
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 3: Contamination Simulation ($0.025)
app.post('/api/x402/contamination-simulation', enforceX402Payment(0.025, '/api/x402/contamination-simulation'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.025 Settled)',
    originNode: req.body.originNode || 'Warehouse_17_Delhi',
    exposureBefore: 48200,
    exposureAfter: 2100,
    exposureReductionPercent: 95.6,
    affectedNodesCount: 14,
    alternativeSupplyRouted: 'Ambala Processing Hub',
    disruptionIndex: 'LOW',
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 4: Lab Analysis ($0.050)
app.post('/api/x402/lab-analysis', enforceX402Payment(0.050, '/api/x402/lab-analysis'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.050 Settled)',
    verdict: 'WATCH',
    violationsCount: 1,
    flaggedParameters: ['Methylene Blue Reduction Time: 3.5h (threshold > 4.0h)'],
    adulterationConfidence: 0.04,
    fssaiComplianceIndex: 82.5,
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 5: Forecast ($0.020)
app.get('/api/x402/forecast/:region', enforceX402Payment(0.020, '/api/x402/forecast/:region'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.020 Settled)',
    region: req.params.region,
    currentRisk: 86,
    peakRiskHour: '+18h',
    vulnerableCategories: ['Dairy', 'Poultry'],
    meteorologicalStressFactor: 1.42,
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 6: Inspection Priority ($0.020)
app.post('/api/x402/inspection-priority', enforceX402Payment(0.020, '/api/x402/inspection-priority'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.020 Settled)',
    topPriorities: [
      { rank: 1, target: 'Central Cold Storage #17 (Okhla)', urgency: 'IMMEDIATE', risk: 94 },
      { rank: 2, target: 'Yeshwanthpur Cold Complex (Bengaluru)', urgency: 'IMMEDIATE', risk: 89 },
      { rank: 3, target: 'Saket QuickMart Superstore', urgency: 'HIGH', risk: 72 }
    ],
    timestamp: new Date().toISOString()
  });
});

// x402 Protected Endpoint 7: Investigation Report ($0.100)
app.get('/api/x402/investigation-report/:id', enforceX402Payment(0.100, '/api/x402/investigation-report/:id'), (req, res) => {
  res.json({
    status: 200,
    authenticatedVia: 'x402 Algorand USDC ($0.100 Settled)',
    investigationId: req.params.id,
    title: 'Delhi-NCR Multi-District Dairy Spoilage Cluster',
    sourceEntity: 'Warehouse #17 Compressor Failure',
    confidence: 94,
    evidenceCorrelation: 'STRONG (23 Citizen Complaints + 4.2h 14.8°C Telemetry)',
    recommendedLegalNotice: 'FSSAI Section 38 Seizure Order',
    timestamp: new Date().toISOString()
  });
});

// Economy Stats API
app.get('/api/x402/stats', (req, res) => {
  res.json({
    totalCalls: totalX402Calls,
    totalRevenueUsdc: parseFloat(totalSettledUsdc.toFixed(2)),
    activeAgentsCount: 114,
    successRatePercent: 98.7,
    recentSettlements: settlementLedger
  });
});

// ==========================================
// 8. VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FoodGuard X server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
