import React from 'react';
import { Code2, ExternalLink, Sparkles, Lock, Coins, ShieldCheck } from 'lucide-react';

interface ApiDocsViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/copilot/chat',
      desc: 'Multi-agent AI copilot powered by Gemini 3.7 Flash.',
      auth: 'None (Internal / Public)',
      exampleBody: '{\n  "prompt": "Why is Batch M492 at risk?",\n  "contextBatchId": "M492"\n}'
    },
    {
      method: 'POST',
      path: '/api/vision/inspect',
      desc: 'Multimodal optical defect and bloated packaging classifier.',
      auth: 'None (Internal / Public)',
      exampleBody: '{\n  "sampleType": "BLOATED_POUCH"\n}'
    },
    {
      method: 'POST',
      path: '/api/labs/analyze',
      desc: 'NABL laboratory report parser & FSSAI threshold conformance check.',
      auth: 'None (Internal / Public)',
      exampleBody: '{\n  "reportText": "TPC 42000 CFU/ml, MBRT 3.5 hrs",\n  "batchId": "M492"\n}'
    },
    {
      method: 'POST',
      path: '/api/simulation/intervene',
      desc: 'What-if regulatory policy and supply chain intervention simulator.',
      auth: 'None (Internal / Public)',
      exampleBody: '{\n  "interventionType": "CLOSE_WAREHOUSE",\n  "targetEntityId": "NODE-WH-17"\n}'
    },
    {
      method: 'POST',
      path: '/api/x402/risk-prediction',
      desc: 'x402 Pay-per-use M2M predictive risk model (Requires 0.005 USDC on Algorand).',
      auth: 'HTTP 402 Token Header',
      exampleBody: '{\n  "batchId": "M492"\n}'
    },
    {
      method: 'POST',
      path: '/api/x402/settle',
      desc: 'Settle USDC payment on Algorand and receive bearer token.',
      auth: 'Algorand Signed Tx',
      exampleBody: '{\n  "agentName": "HedgeShield AI",\n  "amountUsdc": 0.005,\n  "endpoint": "/api/x402/risk-prediction"\n}'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#18181C] border border-[#2A2A30] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>DEVELOPER GATEWAY: /api-docs</span>
            <span>•</span>
            <span className="text-gray-100">OPEN API SPECIFICATION</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-100">
            API Documentation & Machine Interface
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Programmatic endpoints for field devices, laboratory information systems, and autonomous AI agents.
          </p>
        </div>

        <button
          onClick={() => onNavigate('x402')}
          className="bg-[#18181C] hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-black/30"
        >
          <Coins className="w-4 h-4 text-[#C49200]" />
          <span>Launch x402 Protocol Sandbox</span>
        </button>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {endpoints.map((ep, i) => (
          <div key={i} className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#18181C] text-white font-mono text-xs font-bold px-2 py-1 rounded">
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-bold text-gray-100">
                  {ep.path}
                </span>
              </div>
              <span className="font-mono text-[11px] bg-[#18181C] text-gray-400 px-2 py-1 rounded border border-[#2A2A30]">
                Auth: {ep.auth}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              {ep.desc}
            </p>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#888] uppercase block">Example Request:</span>
              <pre className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto">
                {ep.exampleBody}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
