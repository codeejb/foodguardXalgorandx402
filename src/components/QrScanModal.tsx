import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Camera,
  X,
  CheckCircle2,
  Cpu,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  Search
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

interface QrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { predictions, setSelectedBatchId, loadDemoData, hasDataset } = useDataset();
  const [activeStep, setActiveStep] = useState<'scan' | 'processing' | 'ready'>('scan');
  const [selectedId, setSelectedId] = useState<string>('FGX2026001');
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  // Demo QR presets available for quick scanning
  const qrPresets = [
    {
      id: 'FGX2026001',
      name: 'Organic Cow Milk (1L)',
      risk: 98,
      level: 'CRITICAL',
      note: 'Thermal excursion (+9.8°C), compressor trip'
    },
    {
      id: 'M492',
      name: 'Pasteurized Whole Milk (500ml)',
      risk: 96,
      level: 'CRITICAL',
      note: 'Thermal excursion (+10.8°C), 23 citizen complaints'
    },
    {
      id: 'P812',
      name: 'Fresh Malai Paneer (200g)',
      risk: 76,
      level: 'HIGH',
      note: 'Air circulation stoppage, 17 complaints'
    },
    {
      id: 'C104',
      name: 'Fresh Chilled Poultry Cuts',
      risk: 79,
      level: 'HIGH',
      note: 'Reefer compressor trip, 18.2h highway transit'
    },
    {
      id: 'O512',
      name: 'Mustard Oil (Kachi Ghani)',
      risk: 8,
      level: 'LOW',
      note: 'Ambient storage compliant, 0 complaints'
    }
  ];

  if (!isOpen) return null;

  const handleStartScan = (batchId: string) => {
    setSelectedId(batchId);
    setActiveStep('processing');
    setPipelineLogs([]);

    const steps = [
      `[1/5] QR Scanned: Identified Batch_ID = "${batchId}"`,
      `[2/5] Fetching cold-chain telemetry and logistics history...`,
      `[3/5] Executing XGBoost Predictive Engine (FOODGUARD-XGBoost-Risk v1.0)...`,
      `[4/5] Computing TreeSHAP attribution & 72-hour bacterial kinetics...`,
      `[5/5] Reconstructing Digital Food DNA Passport... Ready!`
    ];

    steps.forEach((log, index) => {
      setTimeout(() => {
        setPipelineLogs((prev) => [...prev, log]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setActiveStep('ready');
          }, 300);
        }
      }, (index + 1) * 220);
    });
  };

  const handleOpenBatchIntelligence = async () => {
    if (!hasDataset || predictions.length === 0) {
      await loadDemoData();
    }
    setSelectedBatchId(selectedId);
    onClose();
    onNavigate('food-dna');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border-2 border-amber-300 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF8F2] border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base text-neutral-900 uppercase tracking-tight">
                SCAN FOOD QR PASSPORT
              </h2>
              <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                Direct Pipeline: QR → Batch_ID → XGBoost → SHAP → Food DNA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeStep === 'scan' && (
            <>
              {/* Simulated Camera Viewfinder */}
              <div className="relative rounded-xl border-2 border-dashed border-amber-400/80 bg-neutral-950 p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                {/* Laser Scanning Animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B] animate-bounce" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                  <div className="w-16 h-16 rounded-xl border-2 border-amber-400/60 bg-amber-950/30 flex items-center justify-center text-amber-300">
                    <Camera className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-200 uppercase tracking-wider">
                    OPTICAL QR SCANNER ACTIVE
                  </div>
                  <p className="font-mono text-[11px] text-neutral-400 max-w-xs">
                    Align container QR code or select a verified batch passport below to trigger instant XGBoost inference.
                  </p>
                </div>

                {/* Viewfinder corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400" />
              </div>

              {/* Verified Batch QR Presets */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                  <span>SELECT TEST FOOD BATCH QR:</span>
                  <span className="text-[#854D0E] font-bold">5 PASSPORTS READY</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {qrPresets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleStartScan(p.id)}
                      className="text-left p-3 rounded-xl border border-neutral-200 hover:border-[#854D0E] hover:bg-[#FEF9C3]/40 bg-[#FAF8F2] transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs text-neutral-900 group-hover:text-[#854D0E]">
                          #{p.id}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            p.level === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : p.level === 'HIGH'
                              ? 'bg-amber-100 text-[#78350F] border border-[#FDE68A]'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.level} RISK
                        </span>
                      </div>
                      <div className="text-xs font-bold text-neutral-800 mt-1 truncate">
                        {p.name}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-500 mt-0.5 truncate">
                        {p.note}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeStep === 'processing' && (
            <div className="py-8 px-4 space-y-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FEF3C7] border-2 border-[#FDE68A] flex items-center justify-center text-[#854D0E]">
                <Cpu className="w-8 h-8 animate-spin text-[#854D0E]" />
              </div>

              <div>
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-neutral-900">
                  EXECUTING XGBOOST INFERENCE PIPELINE
                </h3>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Batch <strong className="text-neutral-900 font-bold">#{selectedId}</strong> • FOODGUARD-XGBoost-Risk Engine
                </p>
              </div>

              {/* Real-time telemetry log terminal */}
              <div className="bg-neutral-950 text-left text-neutral-300 font-mono text-xs p-4 rounded-xl space-y-1.5 border border-neutral-800 shadow-inner min-h-[140px]">
                {pipelineLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-400">
                    <span className="text-neutral-600 text-[10px]">➜</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 'ready' && (
            <div className="py-6 px-4 space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 uppercase font-bold rounded-full">
                  XGBOOST PREDICTION COMPLETE
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                  Batch #{selectedId} Identified
                </h3>
                <p className="font-mono text-xs text-neutral-600 max-w-md mx-auto">
                  SHAP feature contributions, bacterial kinetic doubling curves, and complete digital provenance are now loaded into Batch Intelligence.
                </p>
              </div>

              <div className="bg-[#FAF8F2] border border-amber-200 rounded-xl p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                  <span className="text-neutral-500">Core Engine:</span>
                  <strong className="text-neutral-900 font-bold">FOODGUARD-XGBoost-Risk (v1.0-demo)</strong>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                  <span className="text-neutral-500">Explainability:</span>
                  <strong className="text-[#854D0E] font-bold">TreeSHAP Local Feature Attribution</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination:</span>
                  <strong className="text-neutral-900 font-bold">Batch Intelligence & Digital Food DNA</strong>
                </div>
              </div>

              <button
                onClick={handleOpenBatchIntelligence}
                className="w-full bg-[#854D0E] hover:bg-[#A16207] text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>OPEN BATCH INTELLIGENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
