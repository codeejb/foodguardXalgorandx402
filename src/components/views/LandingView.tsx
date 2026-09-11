import React, { useState } from 'react';
import {
  UploadCloud,
  QrCode,
  Download,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
  Zap,
  Sparkles,
  Search,
  ChevronRight,
  Database
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';
import { QrScanModal } from '../QrScanModal';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenCanonicalModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const { setUploadModalOpen, downloadSampleTemplate, dataset, hasDataset, loadDemoData } = useDataset();
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);

  // The strictly enforced 7-column schema
  const requiredColumns = [
    'Batch_ID',
    'Product_Name',
    'Temperature_C',
    'Transport_Hours',
    'Lab_Status',
    'Complaint_Count',
    'Storage_Condition'
  ];

  return (
    <div className="bg-[#FAF8F2] text-neutral-900 min-h-screen">
      {/* QR Scanner Modal */}
      <QrScanModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onNavigate={onNavigate}
      />

      {/* 1. COMMAND ENTRY HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-amber-200/80 bg-linear-to-b from-[#FAF8F2] via-white to-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title Block */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#78350F] rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#854D0E] animate-ping" />
              <span>COMMAND ENTRY PORTAL // 7-COLUMN CANONICAL LEDGER</span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-neutral-900 uppercase leading-[0.92]">
              FOODGUARD <span className="text-[#854D0E]">X</span>
            </h1>

            <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-neutral-600">
              AI FOOD SAFETY INTELLIGENCE
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="h-px w-12 bg-amber-300" />
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-[#854D0E] bg-white px-3 py-1 rounded border border-amber-200 shadow-2xs">
                INPUT
              </span>
              <span className="h-px w-12 bg-amber-300" />
            </div>
          </div>

          {/* TWO PRIMARY ENTRY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* OPTION 1: UPLOAD EXCEL */}
            <div className="bg-white border-2 border-amber-300/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E] shadow-2xs">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded border border-[#FDE68A] uppercase tracking-wider">
                    PRIMARY INGEST
                  </span>
                </div>

                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
                    Upload Excel Dataset
                  </h2>
                  <p className="font-mono text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    National food batch ledger ingest. Autonomous validation, 15-feature extraction, and XGBoost cold-chain predictive modeling.
                  </p>
                </div>

                {/* Formats pill */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Supported:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-neutral-800">
                    <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded">.xlsx</span>
                    <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded">.xls</span>
                    <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded">.csv</span>
                  </div>
                </div>

                {/* 7 Required Columns Schema Pills */}
                <div className="space-y-2 pt-1 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                      STRICT 7-COLUMN SCHEMA:
                    </span>
                    <button
                      onClick={downloadSampleTemplate}
                      className="text-[10px] font-mono text-[#854D0E] hover:text-[#A16207] underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Template</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {requiredColumns.map((col) => (
                      <span
                        key={col}
                        className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F2] border border-amber-200 text-neutral-800"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 relative z-10 space-y-2.5">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full bg-[#854D0E] hover:bg-[#A16207] text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:scale-[1.01]"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>UPLOAD EXCEL</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
                  <span>No manual entry required</span>
                  <button
                    onClick={downloadSampleTemplate}
                    className="text-[#854D0E] hover:underline font-bold"
                  >
                    Download Sample Dataset (.xlsx)
                  </button>
                </div>
              </div>
            </div>

            {/* OPTION 2: SCAN QR */}
            <div className="bg-white border-2 border-amber-300/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E] shadow-2xs">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded border border-[#FDE68A] uppercase tracking-wider">
                    INSTANT PASSPORT
                  </span>
                </div>

                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
                    Scan Food QR
                  </h2>
                  <p className="font-mono text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Identify food batch container in seconds. Unpack cryptographic provenance, real-time XGBoost risk predictions, and TreeSHAP explainability.
                  </p>
                </div>

                {/* QR Visual Flow Pipeline */}
                <div className="bg-[#FAF8F2] border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                    AUTOMATED QR INTELLIGENCE FLOW:
                  </span>
                  
                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] font-bold text-neutral-700">
                    <div className="bg-white p-1.5 rounded border border-neutral-200">
                      Scan QR
                    </div>
                    <div className="flex items-center justify-center text-neutral-400">→</div>
                    <div className="bg-white p-1.5 rounded border border-neutral-200">
                      Batch_ID
                    </div>
                    <div className="flex items-center justify-center text-neutral-400">→</div>
                    <div className="bg-[#FEF3C7] p-1.5 rounded border border-[#FDE68A] text-[#78350F]">
                      XGBoost
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] font-bold text-neutral-700 pt-0.5">
                    <div className="bg-[#FEF3C7] p-1.5 rounded border border-[#FDE68A] text-[#78350F]">
                      TreeSHAP
                    </div>
                    <div className="flex items-center justify-center text-neutral-400">→</div>
                    <div className="bg-white p-1.5 rounded border border-neutral-200">
                      Food DNA
                    </div>
                    <div className="flex items-center justify-center text-neutral-400">→</div>
                    <div className="bg-emerald-100 text-emerald-900 p-1.5 rounded border border-emerald-200">
                      Intelligence
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-neutral-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Supports retail packages, reefer cartons & distributor barcodes.</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 relative z-10 space-y-2.5">
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:scale-[1.01]"
                >
                  <QrCode className="w-5 h-5 text-amber-300" />
                  <span>SCAN QR</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
                  <span>Fast Optical Decoder</span>
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="text-[#854D0E] hover:underline font-bold"
                  >
                    Select Test QR Batch
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ACTIVE STATUS & CORE PHILOSOPHY STRIP */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#854D0E] flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>AI PREDICTS • EVIDENCE EXPLAINS • LAB VERIFIES • HUMAN DECIDES</span>
                </div>
                <p className="font-mono text-[11px] text-neutral-500">
                  Engine: <strong className="text-neutral-800 font-bold">FOODGUARD-XGBoost-Risk (v1.0-demo)</strong> • 15 Engineered Features • TreeSHAP Attribution
                </p>
              </div>

              <div className="flex items-center gap-3">
                {hasDataset && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border border-[#FDE68A] px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Open Dashboard ({dataset?.summaryStats?.totalBatches || 28} Batches)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={onOpenCanonicalModal}
                  className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#854D0E]" />
                  <span>Canonical M492</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FIVE INTERLOCKED ENGINES (PREDICT → PREVENT → TRACE → SIMULATE → ACT) */}
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[10px] font-mono text-[#854D0E] tracking-[0.3em] uppercase font-bold">
              AUTONOMOUS INTELLIGENCE STACK
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Predict → Prevent → Trace → Simulate → Act
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'PREDICT',
                desc: 'XGBoost gradient boosted trees calculate 72h microbial kinetic deterioration curves.',
                view: 'forecast'
              },
              {
                step: '02',
                title: 'PREVENT',
                desc: 'Unsupervised anomaly detection flags thermal excursions and silent laboratory drift.',
                view: 'anomalies'
              },
              {
                step: '03',
                title: 'TRACE',
                desc: 'Algorand-anchored Digital Food DNA tracks provenance from processing to consumer.',
                view: 'food-dna'
              },
              {
                step: '04',
                title: 'SIMULATE',
                desc: 'Dynamic counterfactual What-If engine tests cold-room, recall, and quarantine policies.',
                view: 'simulator'
              },
              {
                step: '05',
                title: 'ACT',
                desc: 'AI Inspector Copilot generates statutory inspection dossiers and Form VA warrants.',
                view: 'inspections'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(p.view)}
                className="bg-[#FAF8F2] border border-neutral-200 rounded-xl p-5 space-y-3 hover:border-[#854D0E] hover:bg-[#FEF3C7]/40 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="font-mono text-xs text-[#854D0E] font-black tracking-widest">
                  //{p.step}
                </div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                  {p.desc}
                </p>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E] pt-2 flex items-center gap-1">
                  <span>Launch Engine</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PARADIGM COMPARISON */}
      <section className="py-20 bg-[#FAF8F2] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reactive */}
            <div className="bg-white border border-neutral-200 rounded-xl p-7 space-y-4 shadow-xs">
              <div className="inline-block font-mono text-[10px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded border border-red-200 uppercase tracking-widest">
                TRADITIONAL FOOD SAFETY (REACTIVE)
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-neutral-900">
                Action Taken After Contamination Spreads
              </h3>
              <ul className="space-y-3 text-xs text-neutral-600 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Paper-based logs and isolated offline spreadsheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Outbreak discovered only when hospital poisoning clusters surge.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Manual invoice tracing takes 14 to 30 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Indiscriminate bulk recalls destroy safe inventory.</span>
                </li>
              </ul>
            </div>

            {/* Predictive */}
            <div className="bg-white border-2 border-amber-300 rounded-xl p-7 space-y-4 shadow-md">
              <div className="inline-block font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 uppercase tracking-widest">
                FOODGUARD X (PREDICTIVE TWIN)
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-neutral-900">
                Action Taken Before Retail Spoilage Propagates
              </h3>
              <ul className="space-y-3 text-xs text-neutral-700 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Live XGBoost thermal stress and transit degradation modeling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>TreeSHAP explainability isolates exact root causes (+10.8°C excursion).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Sub-second graph traversal identifies compromised depot in 40ms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Surgical quarantines reduce public exposure by up to 95.6%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-12 bg-white text-center text-xs font-mono text-neutral-500 border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-bold text-neutral-800">
            FOODGUARD X — NATIONAL FOOD SAFETY INTELLIGENCE PLATFORM
          </p>
          <p>
            AI PREDICTS. EVIDENCE EXPLAINS. LAB VERIFIES. HUMAN DECIDES.
          </p>
          <p className="text-[10px] text-neutral-400">
            All predictions generated using FOODGUARD-XGBoost-Risk (v1.0-demo) GBDT Ensemble with TreeSHAP local attribution.
          </p>
        </div>
      </footer>
    </div>
  );
};
