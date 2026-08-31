import React, { useState } from 'react';
import {
  X,
  Coins,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  Wallet,
  Sparkles,
  ShieldCheck,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlgoTransactionRecord } from '../types';

interface PayWithAlgoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (tx: AlgoTransactionRecord) => void;
  defaultAmountAlgo?: number;
  defaultPurpose?: string;
  contextBatchId?: string;
}

const PAYMENT_PRESETS = [
  {
    title: 'x402 AI Query',
    amountAlgo: 0.05,
    usdcEquiv: '$0.005',
    desc: 'Unlock predictive degradation curve & risk API payload'
  },
  {
    title: 'Passport Anchor',
    amountAlgo: 0.10,
    usdcEquiv: '$0.010',
    desc: 'Anchor tamper-proof batch seizure order to Algorand TestNet'
  },
  {
    title: 'Sensor Bounty',
    amountAlgo: 0.50,
    usdcEquiv: '$0.050',
    desc: 'Micro-incentive for warehouse cold-storage IoT telemetry node'
  },
  {
    title: 'Lab Attestation',
    amountAlgo: 1.00,
    usdcEquiv: '$0.100',
    desc: 'Publish cryptographic NABL biochemical test certificate'
  }
];

export const PayWithAlgoModal: React.FC<PayWithAlgoModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  defaultAmountAlgo = 0.05,
  defaultPurpose = 'x402 AI Intelligence Query Fee (Batch M492)',
  contextBatchId = 'M492'
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmountAlgo);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>(defaultPurpose);
  const [walletType, setWalletType] = useState<'PERA' | 'DEFLY' | 'TESTNET_DEV'>('PERA');
  const [loading, setLoading] = useState<boolean>(false);
  const [txReceipt, setTxReceipt] = useState<AlgoTransactionRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // User wallet state
  const senderAddress = 'ALGO7W2K9XN5M4P3Q8T6R1Y2Z9V0B4C7D';
  const receiverContract = 'FOODGUARDX7RECV4ALGO9X8Y7Z6W5V4U3T2';
  const currentBalance = 35.84;

  if (!isOpen) return null;

  const currentPaymentAmount = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  const handlePayNow = () => {
    if (currentPaymentAmount <= 0) return;
    setLoading(true);

    setTimeout(() => {
      const generatedTxId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const round = 42918894 + Math.floor(Math.random() * 500);

      const record: AlgoTransactionRecord = {
        txId: generatedTxId,
        round,
        from: senderAddress,
        to: receiverContract,
        amountAlgo: currentPaymentAmount,
        amountUsdc: currentPaymentAmount * 0.1,
        purpose,
        timestamp: new Date().toLocaleTimeString(),
        status: 'CONFIRMED',
        note: `FOODGUARD_X::BATCH_${contextBatchId}::x402_SETTLEMENT`
      };

      setTxReceipt(record);
      setLoading(false);

      if (onPaymentSuccess) {
        onPaymentSuccess(record);
      }

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#000000']
        });
      } catch {}
    }, 1200);
  };

  const handleCopyTx = () => {
    if (!txReceipt) return;
    navigator.clipboard.writeText(txReceipt.txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTxReceipt(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-300 shadow-2xl max-w-lg w-full overflow-hidden text-neutral-900 animate-in zoom-in-95 duration-200">
        {/* Modal Header with Algorand Yellow Branding */}
        <div className="px-6 py-4 bg-[#FBF8EF] border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#854D0E] text-yellow-300 flex items-center justify-center font-black shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                  Pay with ALGO
                </h3>
                <span className="bg-[#FEF3C7] text-[#78350F] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#FDE68A] uppercase tracking-wider">
                  ALGORAND TESTNET
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#854D0E] uppercase tracking-wider font-bold">
                SUB-SECOND FINALITY • 0.001 ALGO NETWORK FEE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 bg-white">
          {!txReceipt ? (
            <>
              {/* Wallet Status Card */}
              <div className="p-3.5 bg-[#FAFAF8] border border-neutral-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-black text-yellow-400 flex items-center justify-center font-bold text-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block font-bold">
                      Connected Account
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-800">
                      {senderAddress.slice(0, 8)}...{senderAddress.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block font-bold">
                    Available Balance
                  </span>
                  <span className="font-mono text-sm font-black text-[#854D0E]">
                    {currentBalance.toFixed(3)} ALGO
                  </span>
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600">
                  Select Payment Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_PRESETS.map((preset, idx) => {
                    const isSelected = !isCustom && selectedAmount === preset.amountAlgo;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(preset.amountAlgo);
                          setIsCustom(false);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF3C7] border-[#A16207] shadow-xs ring-1 ring-[#A16207]'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs uppercase tracking-tight text-neutral-900">
                            {preset.title}
                          </span>
                          <span className="font-mono text-xs font-black text-[#854D0E]">
                            {preset.amountAlgo} ALGO
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1 font-mono line-clamp-1">
                          {preset.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Option */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600">
                    Custom ALGO Amount
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustom(!isCustom)}
                    className="text-[10px] font-mono text-[#854D0E] font-bold uppercase hover:underline cursor-pointer"
                  >
                    {isCustom ? 'Use Presets' : 'Enter Custom'}
                  </button>
                </div>
                {isCustom && (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.001"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.05"
                      className="w-full text-sm font-mono font-bold bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                      autoFocus
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono font-bold text-neutral-500">
                      ALGO
                    </span>
                  </div>
                )}
              </div>

              {/* Purpose field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600">
                  Transaction Purpose / Batch Memo
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                />
              </div>

              {/* Wallet Type */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                <span>Wallet Provider:</span>
                <div className="flex items-center gap-2">
                  {(['PERA', 'DEFLY', 'TESTNET_DEV'] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWalletType(w)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        walletType === w
                          ? 'bg-[#854D0E] text-white shadow-xs'
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={loading || currentPaymentAmount <= 0}
                className={`w-full font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  currentPaymentAmount > 0 && !loading
                    ? 'bg-[#854D0E] hover:bg-[#A16207] text-white shadow-md hover:shadow-lg'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing Transaction on Algorand...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Pay {currentPaymentAmount.toFixed(3)} ALGO Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            /* SUCCESS RECEIPT */
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 uppercase tracking-widest">
                  ALGORAND TESTNET CONFIRMED (3.3s FINALITY)
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900 mt-2">
                  Payment Confirmed!
                </h3>
                <p className="text-xs text-neutral-600 font-mono mt-1">
                  Settled {txReceipt.amountAlgo} ALGO (~${txReceipt.amountUsdc?.toFixed(3)} USDC) on Algorand Ledger.
                </p>
              </div>

              {/* Receipt Table */}
              <div className="p-4 bg-[#FBF8EF] border border-amber-200 rounded-lg text-left space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold">Transaction ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900">{txReceipt.txId}</span>
                    <button
                      onClick={handleCopyTx}
                      className="p-1 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer"
                      title="Copy TX ID"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold">Block Round:</span>
                  <span className="font-bold text-[#854D0E]">#{txReceipt.round}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold">Sender:</span>
                  <span className="text-neutral-700 font-mono">{txReceipt.from.slice(0, 10)}...</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold">Purpose:</span>
                  <span className="text-neutral-900 font-medium text-[11px] truncate max-w-[200px]">{txReceipt.purpose}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold">Public Explorer:</span>
                  <a
                    href="https://testnet.algoexplorer.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#854D0E] font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    View on AlgoExplorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-xs uppercase tracking-wider py-2.5 rounded cursor-pointer"
                >
                  Make Another Payment
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#854D0E] hover:bg-[#A16207] text-white font-black text-xs uppercase tracking-wider py-2.5 rounded shadow cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
