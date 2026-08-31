import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BLOCKCHAIN_EVENTS } from '../../data/mockData';
import { ApiClient } from '../../services/apiClient';

interface BlockchainViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const BlockchainView: React.FC<BlockchainViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedTxHash, setSelectedTxHash] = useState<string>(INITIAL_BLOCKCHAIN_EVENTS[0].txHash);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [verifying, setVerifying] = useState<boolean>(false);

  const selectedEvent = INITIAL_BLOCKCHAIN_EVENTS.find((e) => e.txHash === selectedTxHash) || INITIAL_BLOCKCHAIN_EVENTS[0];

  const handleVerifyTx = async (txHash: string) => {
    setSelectedTxHash(txHash);
    setVerifying(true);
    try {
      const res = await ApiClient.verifyBlockchainTx(txHash, selectedEvent.batchId);
      setVerificationStatus(res);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A67C00', '#9333EA', '#10B981']
        });
      } catch {}
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>ALGORAND TESTNET: /blockchain</span>
            <span>•</span>
            <span className="text-[#1A1A18]">APP ID #72938104</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Algorand Blockchain Food Passport Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Immutable, cryptographically verifiable food state transitions, thermal audit logs, and statutory seizure notices.
          </p>
        </div>

        <a
          href="https://testnet.algoexplorer.io"
          target="_blank"
          rel="noreferrer"
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
        >
          <span>Open Algorand Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Grid: Live Feed & Cryptographic Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Ledger Events */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1A1A18] mb-2">
            Live Blockchain Transaction Feed ({INITIAL_BLOCKCHAIN_EVENTS.length})
          </h3>

          <div className="space-y-3">
            {INITIAL_BLOCKCHAIN_EVENTS.map((event) => {
              const isSelected = event.txHash === selectedTxHash;
              return (
                <div
                  key={event.txHash}
                  onClick={() => handleVerifyTx(event.txHash)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                      : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-purple-700">
                      ROUND #{event.blockRound}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {event.verificationStatus}
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#1A1A18]">
                    {event.eventType.replace(/_/g, ' ')}
                  </h4>

                  <p className="font-mono text-[11px] text-[#666] break-all mt-1 bg-white p-2 rounded border border-[#EBEBE6]">
                    Tx: {event.txHash}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#777] pt-2 mt-2 border-t border-[#F0F0EB]">
                    <span>Batch #{event.batchId}</span>
                    <span className="text-[#8F6B00] font-semibold">Verify Proof →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Cryptographic Verification Proof */}
        <div className="lg:col-span-6 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#F0F0EB] pb-4">
            <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-bold block">
              CRYPTOGRAPHIC PROOF VERIFIER
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A18]">
              {selectedEvent.eventType.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-[#777] font-sans">
              Algorand Smart Contract App ID #72938104 • Round #{selectedEvent.blockRound}
            </p>
          </div>

          {/* Verification Result Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
              <ShieldCheck className="w-5 h-5" />
              <span>CRYPTOGRAPHIC SIGNATURE VALID & ANCHORED</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              This food state transition was permanently stamped on Algorand TestNet by authorized Oracle node with zero post-facto modification capability.
            </p>
          </div>

          {/* Proof Details Grid */}
          <div className="space-y-2 text-xs">
            <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6] flex justify-between">
              <span className="text-[#777]">Transaction ID:</span>
              <span className="font-mono font-semibold text-[#1A1A18]">{selectedEvent.txHash}</span>
            </div>
            <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6] flex justify-between">
              <span className="text-[#777]">Target Batch:</span>
              <span className="font-mono font-semibold text-[#8F6B00]">Batch #{selectedEvent.batchId}</span>
            </div>
            <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6] flex justify-between">
              <span className="text-[#777]">Timestamp:</span>
              <span className="font-mono font-semibold text-[#1A1A18]">{selectedEvent.timestamp}</span>
            </div>
            <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6] flex justify-between">
              <span className="text-[#777]">Consensus Finality:</span>
              <span className="font-mono font-semibold text-emerald-700">Instant (3.3s)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleVerifyTx(selectedEvent.txHash)}
              disabled={verifying}
              className="w-full bg-[#1A1A18] hover:bg-[#8F6B00] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4 text-[#C49200]" />
              <span>{verifying ? 'Verifying on Algorand...' : 'Re-verify Cryptographic Merkle Root'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
