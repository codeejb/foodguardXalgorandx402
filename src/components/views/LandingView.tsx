import React, { useState } from 'react';
import {
  UploadCloud,
  QrCode,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  ChevronRight,
  Zap
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
  const { setUploadModalOpen, downloadSampleTemplate, dataset, hasDataset } = useDataset();
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);

  const requiredColumns = [
    'Batch_ID', 'Product_Name', 'Temperature_C', 'Transport_Hours',
    'Lab_Status', 'Complaint_Count', 'Storage_Condition'
  ];

  return (
    <div className="bg-[#0A0A0F] text-gray-100 min-h-screen">
      <QrScanModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-8 will-animate animate-pop">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#12121A] border border-[#1A1A24] rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-400">Decentralized Food Purity Network</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">v3.8</span>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8 will-animate animate-scale-in">
            <img src="/foodguardx-logo.png" alt="FoodGuardX" className="h-28 w-auto mix-blend-multiply" />
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto space-y-6 mb-12">
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight text-gray-100 leading-[1.05] will-animate animate-slide-up">
              National Food Safety{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                Intelligence
              </span>{' '}
              Platform
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed will-animate animate-slide-up delay-200">
              AI-powered digital twin and early-warning system for India's entire food ecosystem. Predict, prevent, trace, simulate, and act.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14 will-animate animate-slide-up delay-300">
            {[
              { icon: Zap, label: 'Real-time Monitoring' },
              { icon: ShieldCheck, label: 'FSSAI Compliant' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-[#12121A] border border-[#1A1A24] rounded-xl text-sm text-gray-300 hover:border-amber-500/30 transition-all duration-300">
                <f.icon className="w-4 h-4 text-amber-400" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Entry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Upload Card */}
            <div className="group bg-[#12121A] border border-[#1A1A24] hover:border-amber-500/40 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 will-animate animate-slide-left delay-400">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  PRIMARY INGEST
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl text-gray-100 mb-2">
                Upload Batch Dataset
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                National food batch ledger ingest with autonomous validation and XGBoost predictive modeling.
              </p>

              {/* Schema Pills */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-500">7-Column Schema</span>
                  <button onClick={downloadSampleTemplate} className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                    <Download className="w-3 h-3" /> Template
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {requiredColumns.map((col) => (
                    <span key={col} className="font-mono text-[10px] font-semibold px-2 py-1 rounded-md bg-[#1A1A24] border border-[#2A2A35] text-gray-300">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0A0F] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Dataset
              </button>

              <p className="text-center text-[11px] text-gray-500 mt-3">Supported: .xlsx, .xls, .csv</p>
            </div>

            {/* QR Card */}
            <div className="group bg-[#12121A] border border-[#1A1A24] hover:border-amber-500/40 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 will-animate animate-slide-right delay-400">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  INSTANT PASSPORT
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl text-gray-100 mb-2">
                Scan Food QR
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Identify food batch container in seconds. Unpack cryptographic provenance and real-time risk predictions.
              </p>

              {/* QR Pipeline */}
              <div className="bg-[#0A0A0F] border border-[#1A1A24] rounded-xl p-4 mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-500 block mb-3">Intelligence Flow</span>
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono font-semibold">
                  <div className="flex-1 bg-[#12121A] border border-[#2A2A35] p-2 rounded-lg text-center text-gray-300">Scan</div>
                  <div className="text-gray-600">→</div>
                  <div className="flex-1 bg-[#12121A] border border-[#2A2A35] p-2 rounded-lg text-center text-gray-300">Analyze</div>
                  <div className="text-gray-600">→</div>
                  <div className="flex-1 bg-amber-500/15 border border-amber-500/30 p-2 rounded-lg text-center text-amber-400">Report</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Supports retail packages, reefer cartons & distributor barcodes.</span>
              </div>

              <button
                onClick={() => setQrModalOpen(true)}
                className="w-full bg-[#0A0A0F] hover:bg-[#12121A] text-gray-100 border border-[#2A2A35] hover:border-amber-500/40 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                Launch QR Scanner
              </button>
            </div>
          </div>

          {/* Status Strip */}
          <div className="mt-10 max-w-4xl mx-auto will-animate animate-slide-up delay-600">
            <div className="bg-[#12121A] border border-[#1A1A24] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium">AI Predicts • Evidence Explains • Lab Verifies • Human Decides</span>
              </div>
              <div className="flex items-center gap-3">
                {hasDataset && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    Dashboard ({dataset?.summaryStats?.totalBatches || 28})
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onOpenCanonicalModal}
                  className="bg-[#0A0A0F] hover:bg-[#1A1A24] text-gray-300 border border-[#2A2A35] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIVE ENGINES */}
      <section className="py-24 bg-[#0A0A0F] border-t border-[#1A1A24]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 will-animate animate-slide-up">
            <span className="text-[10px] font-mono text-amber-400 tracking-[0.3em] uppercase font-semibold">Autonomous Intelligence Stack</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-100">
              Five AI Agents. One Mission.
            </h2>
            <p className="text-gray-400">Continuously monitoring India's cold chain to prevent public outbreaks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'PREDICT', desc: 'XGBoost calculates 72h microbial deterioration curves.', view: 'forecast' },
              { step: '02', title: 'PREVENT', desc: 'Anomaly detection flags thermal excursions and drift.', view: 'anomalies' },
              { step: '03', title: 'TRACE', desc: 'Algorand-anchored Digital Food DNA tracks provenance.', view: 'food-dna' },
              { step: '04', title: 'SIMULATE', desc: 'What-If engine tests cold-room and recall policies.', view: 'simulator' },
              { step: '05', title: 'ACT', desc: 'AI Inspector generates statutory inspection dossiers.', view: 'inspections' }
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(p.view)}
                className="group bg-[#12121A] border border-[#1A1A24] hover:border-amber-500/40 rounded-xl p-5 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-amber-500/5 will-animate animate-slide-up"
                style={{ animationDelay: `${idx * 100 + 200}ms` }}
              >
                <div className="font-mono text-[10px] text-amber-400 font-bold tracking-widest mb-2">//{p.step}</div>
                <h3 className="font-display font-bold text-base text-gray-100 group-hover:text-amber-400 transition-colors mb-2">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                <div className="text-[10px] font-semibold text-amber-400 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Launch <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 bg-[#0A0A0F] border-t border-[#1A1A24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 will-animate animate-slide-up">
            <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase font-semibold">The Predictive Difference</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-100">
              Crisis Reaction vs Autonomous Prevention
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reactive */}
            <div className="bg-[#12121A] border border-[#1A1A24] rounded-2xl p-7 space-y-5 will-animate animate-slide-left delay-200">
              <div className="inline-block font-mono text-[10px] font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest">
                Traditional (Reactive)
              </div>
              <h3 className="font-display font-bold text-xl text-gray-100">After Contamination Spreads</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-bold mt-0.5">✕</span><span>Paper-based logs and isolated offline spreadsheets.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-bold mt-0.5">✕</span><span>Outbreak discovered only when hospital clusters surge.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-bold mt-0.5">✕</span><span>Manual invoice tracing takes 14 to 30 days.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-bold mt-0.5">✕</span><span>Indiscriminate bulk recalls destroy safe inventory.</span></li>
              </ul>
            </div>

            {/* Predictive */}
            <div className="bg-[#12121A] border border-amber-500/30 rounded-2xl p-7 space-y-5 will-animate animate-slide-right delay-200">
              <div className="inline-block font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
                FoodGuard X (Predictive)
              </div>
              <h3 className="font-display font-bold text-xl text-gray-100">Before Retail Spoilage Propagates</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2.5"><span className="text-emerald-500 font-bold mt-0.5">✓</span><span>Live XGBoost thermal stress and transit degradation modeling.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-emerald-500 font-bold mt-0.5">✓</span><span>TreeSHAP explainability isolates exact root causes.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-emerald-500 font-bold mt-0.5">✓</span><span>Sub-second graph traversal identifies compromised depot in 40ms.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-emerald-500 font-bold mt-0.5">✓</span><span>Surgical quarantines reduce public exposure by up to 95.6%.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
