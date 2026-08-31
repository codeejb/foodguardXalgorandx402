import React, { useState } from 'react';
import {
  Eye,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Cpu,
  FileCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { ApiClient, VisionInspectionResult } from '../../services/apiClient';

interface VisionViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

const PRESET_SAMPLES = [
  {
    id: 'sample-bloated-milk',
    title: 'Batch M492: Bloated 500ml Milk Pouch',
    category: 'DAIRY (PASTEURIZED MILK)',
    sampleType: 'BLOATED_POUCH',
    description: 'Swollen LDPE pouch from South Delhi retail store exhibiting seam expansion and gas buildup.',
    imageUrl: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-spice-dye',
    title: 'Batch S309: Red Chilli Powder with Synthetic Dye',
    category: 'SPICES (POWDERED)',
    sampleType: 'SYNTHETIC_DYE',
    description: 'Microscopic optical examination of deep red powder with Sudan I fluorescent dye markers.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-clean-milk',
    title: 'Batch P812: Nominal Sealed Fresh Milk',
    category: 'DAIRY (PASTEURIZED MILK)',
    sampleType: 'CLEAN_POUCH',
    description: 'Standard taut pouch with sharp heat seals and zero gas evolution.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
  }
];

export const VisionView: React.FC<VisionViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedSample, setSelectedSample] = useState(PRESET_SAMPLES[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VisionInspectionResult>({
    verdict: 'SUSPICIOUS',
    confidence: 94,
    primaryAnomaly: 'Polyethylene package bloating with 1.2mm tensile seam stretch',
    evidence: [
      'Visible gas production convex bulge detected in 500ml milk pouch.',
      'Heat-seal crimp shows 1.2mm microbial gas expansion along upper seam.',
      'Batch M492 print timestamp matches Okhla cold storage thermal incident.'
    ],
    fssaiCompliance: 'NON_COMPLIANT',
    recommendedAction: 'Quarantine retail shelf inventory and trigger immediate NABL microbial plating.'
  });

  const handleRunInspection = async (sample = selectedSample) => {
    setSelectedSample(sample);
    setAnalyzing(true);
    try {
      const res = await ApiClient.inspectVision(undefined, sample.sampleType);
      setResult(res);
    } catch (e) {
      // Fallback
    } finally {
      setAnalyzing(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'SAFE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SUSPICIOUS':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CRITICAL_DEFECT':
      case 'TAMPERED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>MULTIMODAL AI VISION: /vision</span>
            <span>•</span>
            <span className="text-[#1A1A18]">GEMINI 3.7 FLASH OPTICAL INSPECTOR</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            AI Vision Quality Inspector
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Real-time visual anomaly detection for bloated packaging, seal tampering, mold formation, and adulteration pigments.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough M492 Vision Anomaly</span>
        </button>
      </div>

      {/* Main Grid: Sample Selector & Optical Analysis Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sample Library */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1A1A18]">
            Select Inspection Sample
          </h3>

          <div className="space-y-3">
            {PRESET_SAMPLES.map((sample) => {
              const isSelected = sample.id === selectedSample.id;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleRunInspection(sample)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-white border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                      : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-[#DDD] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-[#8F6B00] uppercase font-bold block">
                      {sample.category}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#1A1A18] truncate">
                      {sample.title}
                    </h4>
                    <p className="text-[11px] text-[#666] line-clamp-2 mt-0.5 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Optical Forensic Report */}
        <div className="lg:col-span-7 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                OPTICAL ANALYSIS DOSSIER
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                {selectedSample.title}
              </h2>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${getVerdictBadge(result.verdict)}`}>
              VERDICT: {result.verdict} ({result.confidence}%)
            </span>
          </div>

          {/* Image Canvas Preview with Bounding Box Overlay */}
          <div className="relative rounded-xl overflow-hidden border border-[#EBEBE6] bg-[#FAFAF7] h-56 flex items-center justify-center">
            <img
              src={selectedSample.imageUrl}
              alt="Optical inspection target"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Visual Bounding Box Overlay */}
            <div className="absolute inset-8 border-2 border-red-500 rounded bg-red-500/10 pointer-events-none flex items-start justify-between p-2">
              <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                ANOMALY DETECTED: {result.verdict}
              </span>
              <span className="bg-black/70 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                AI CONFIDENCE {result.confidence}%
              </span>
            </div>
          </div>

          {/* Primary Optical Finding */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>PRIMARY OPTICAL FINDING</span>
            </span>
            <p className="text-xs text-[#222] font-medium leading-relaxed">
              {result.primaryAnomaly}
            </p>
          </div>

          {/* Evidence Breakdown */}
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-[#1A1A18]">
              Corroborating Optical Evidence
            </h4>
            <ul className="space-y-1.5 text-xs text-[#555]">
              {result.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#FAFAF7] p-2.5 rounded border border-[#EBEBE6]">
                  <CheckCircle2 className="w-4 h-4 text-[#8F6B00] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statutory Recommendation */}
          <div className="bg-[#FDF9EE] border border-[#EEDBB3] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-bold block">
              FSSAI COMPLIANCE DIRECTIVE: {result.fssaiCompliance}
            </span>
            <p className="text-xs text-[#735700] font-medium leading-relaxed">
              {result.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
