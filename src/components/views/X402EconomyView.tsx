import React, { useState } from 'react';
import {
  Coins,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  ExternalLink,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_X402_SETTLEMENTS } from '../../data/mockData';
import { ApiClient } from '../../services/apiClient';

interface X402EconomyViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const X402EconomyView: React.FC<X402EconomyViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [httpResponse, setHttpResponse] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [settling, setSettling] = useState<boolean>(false);

  // Step 1: Call Endpoint without payment
  const handleCallEndpoint = async () => {
    setActiveStep(2);
    const res = await ApiClient.callX402Endpoint('/api/x402/risk-prediction', 'POST', { batchId: 'M492' });
    setHttpResponse(res);
  };

  // Step 2: Settle on Algorand
  const handleSettlePayment = async () => {
    setSettling(true);
    try {
      const settleRes = await ApiClient.settleX402Payment(
        'HedgeShield Cargo Insurance AI',
        'INSURANCE_UNDERWRITING',
        '/api/x402/risk-prediction',
        0.005
      );
      setToken(settleRes.token);
      setActiveStep(3);

      // Step 3: Now call with token
      const paidRes = await ApiClient.callX402Endpoint(
        '/api/x402/risk-prediction',
        'POST',
        { batchId: 'M492' },
        settleRes.token
      );
      setHttpResponse(paidRes);
      setActiveStep(4);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A67C00', '#10B981', '#1A1A18']
        });
      } catch {}
    } finally {
      setSettling(false);
    }
  };

  const handleResetSandbox = () => {
    setActiveStep(1);
    setHttpResponse(null);
    setToken(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>x402 MACHINE-TO-MACHINE PROTOCOL: /x402</span>
            <span>•</span>
            <span className="text-[#1A1A18]">ALGORAND USDC MICRO-SETTLEMENTS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            x402 Intelligence Economy & Gateway
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Autonomous AI agents query food safety digital twins, settle micro-payments on Algorand via HTTP 402, and unlock predictive risk telemetry.
          </p>
        </div>

        {/* Global Economy Stats */}
        <div className="flex items-center gap-3 bg-white border border-[#DDDCD6] rounded-xl p-3 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#888] uppercase block">Total Settled</span>
            <span className="font-serif text-xl font-bold text-[#8F6B00]">$184.65 USDC</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FDF9EE] border border-[#EEDBB3] flex items-center justify-center text-[#8F6B00]">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Sandbox & Settlements Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Interactive x402 Protocol Simulator Sandbox */}
        <div className="lg:col-span-7 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A18] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#8F6B00]" />
                <span>Live x402 M2M Gateway Simulator</span>
              </h3>
              <p className="text-xs text-[#777] mt-0.5">
                Simulate an external AI agent requesting predictive intelligence on Batch M492.
              </p>
            </div>
            <button
              onClick={handleResetSandbox}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Reset Sandbox"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Step Progress Indicator */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border font-mono ${activeStep === 1 ? 'bg-[#1A1A18] text-white' : 'bg-[#FAFAF7] text-[#666]'}`}>
              1. Call API
            </div>
            <div className={`p-2 rounded-lg border font-mono ${activeStep === 2 ? 'bg-amber-500 text-white' : activeStep > 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-[#FAFAF7] text-[#666]'}`}>
              2. 402 Required
            </div>
            <div className={`p-2 rounded-lg border font-mono ${activeStep === 3 ? 'bg-[#8F6B00] text-white' : activeStep > 3 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-[#FAFAF7] text-[#666]'}`}>
              3. USDC Settle
            </div>
            <div className={`p-2 rounded-lg border font-mono ${activeStep === 4 ? 'bg-emerald-600 text-white' : 'bg-[#FAFAF7] text-[#666]'}`}>
              4. 200 Payload
            </div>
          </div>

          {/* Interactive Action Controls */}
          {activeStep === 1 && (
            <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-5 space-y-3">
              <span className="font-mono text-xs text-[#8F6B00] font-bold block">
                STEP 1: EXTERNAL AI AGENT REQUEST
              </span>
              <p className="text-xs text-[#555] leading-relaxed">
                HedgeShield Cargo Underwriting AI calls <code>POST /api/x402/risk-prediction</code> for <strong>Batch #M492</strong> without credentials.
              </p>
              <button
                onClick={handleCallEndpoint}
                className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Send Unauthenticated Request</span>
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-800 font-bold">
                  STEP 2: GATEWAY INTERCEPTION (HTTP 402 PAYMENT REQUIRED)
                </span>
                <span className="font-mono text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                  STATUS 402
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                The FoodGuard X Gateway intercepts the request and responds with Algorand USDC payment requirements (0.005 USDC to recipient wallet).
              </p>
              <button
                onClick={handleSettlePayment}
                disabled={settling}
                className="bg-[#8F6B00] hover:bg-[#725500] text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Coins className="w-4 h-4 text-[#FDF9EE]" />
                <span>{settling ? 'Settling on Algorand...' : 'Sign & Settle 0.005 USDC on Algorand'}</span>
              </button>
            </div>
          )}

          {activeStep === 4 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-800 font-bold">
                  STEP 4: TOKEN ATTACHED & INTELLIGENCE PAYLOAD UNLOCKED
                </span>
                <span className="font-mono text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  STATUS 200 OK
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Payment verified on Algorand TestNet. The predictive risk model payload is returned to the autonomous agent.
              </p>
              <button
                onClick={handleResetSandbox}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Simulate Another Agent Request
              </button>
            </div>
          )}

          {/* JSON Terminal Response Viewer */}
          {httpResponse && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#777] font-mono">
                <span>TERMINAL RESPONSE:</span>
                <span>STATUS: {httpResponse.status}</span>
              </div>
              <pre className="bg-[#1A1A18] text-[#E0E0DC] p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(httpResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Col: Live Settlements Stream */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1A1A18]">
            Recent M2M Settlements ({INITIAL_X402_SETTLEMENTS.length})
          </h3>

          <div className="space-y-3">
            {INITIAL_X402_SETTLEMENTS.map((st) => (
              <div
                key={st.id}
                className="bg-white border border-[#EBEBE6] rounded-xl p-4 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-[#1A1A18]">
                    {st.agentName}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8F6B00]">
                    +${st.amountUsdc} USDC
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#777] truncate">
                  Endpoint: {st.endpoint}
                </p>
                <p className="font-mono text-[10px] text-[#999] break-all">
                  Tx: {st.txId || st.txHash}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
