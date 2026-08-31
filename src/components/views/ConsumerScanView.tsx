import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { INITIAL_BATCHES } from '../../data/mockData';

interface ConsumerScanViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const ConsumerScanView: React.FC<ConsumerScanViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [scannedBatchId, setScannedBatchId] = useState<string>('M492');
  const batch = INITIAL_BATCHES.find((b) => b.id === scannedBatchId) || INITIAL_BATCHES[0];

  const isSafe = batch.safetyScore >= 60;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>PUBLIC SAFETY PORTAL: /consumer</span>
            <span>•</span>
            <span className="text-[#1A1A18]">INSTANT CONSUMER VERIFICATION</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Consumer QR Food Safety Scanner
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Scan any food barcode or QR passport to verify real-time safety status, cold-chain integrity, and active recalls.
          </p>
        </div>

        {/* Quick Batch Scan Buttons */}
        <div className="flex items-center gap-2">
          {INITIAL_BATCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setScannedBatchId(b.id)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                scannedBatchId === b.id
                  ? 'bg-[#1A1A18] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F0F0EB] text-[#444] border border-[#DDDCD6]'
              }`}
            >
              Scan #{b.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Consumer Card: Mobile Phone Viewport Preview */}
      <div className="max-w-xl mx-auto bg-white border border-[#DDDCD6] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Safety Header Status */}
        <div
          className={`p-5 rounded-xl border text-center space-y-2 ${
            isSafe
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex justify-center">
            {isSafe ? (
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}
          </div>

          <h2 className="font-serif text-2xl font-bold">
            {isSafe ? 'VERIFIED SAFE FOR CONSUMPTION' : 'WARNING: DO NOT CONSUME'}
          </h2>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            {isSafe
              ? 'This batch meets all FSSAI standards and maintained uninterrupted cold chain during transit.'
              : 'An active thermal excursion was recorded at the distribution warehouse. A voluntary recall is in effect.'}
          </p>
        </div>

        {/* Product Identity */}
        <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#8F6B00] font-bold">PASSPORT #ALGO-DNA-{batch.id}</span>
            <span className="font-mono text-[#777]">LOT #{batch.id}</span>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A18]">{batch.productName}</h3>
            <p className="text-xs text-[#666]">{batch.supplierName} • {batch.category}</p>
          </div>
        </div>

        {/* Consumer Cold-Chain Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#555]">Food Safety Score</span>
            <span className={isSafe ? 'text-emerald-700' : 'text-red-600'}>
              {batch.safetyScore} / 100
            </span>
          </div>
          <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isSafe ? 'bg-emerald-600' : 'bg-red-600'}`}
              style={{ width: `${batch.safetyScore}%` }}
            />
          </div>
        </div>

        {/* Blockchain Seal for Consumer */}
        <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-700" />
            <div>
              <span className="font-semibold text-[#1A1A18] block">Algorand TestNet Verified</span>
              <span className="text-[10px] font-mono text-[#777] truncate max-w-[200px] block">{batch.blockchainTx}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('blockchain')}
            className="text-xs font-semibold text-[#8F6B00] hover:underline"
          >
            Inspect Proof →
          </button>
        </div>
      </div>
    </div>
  );
};
