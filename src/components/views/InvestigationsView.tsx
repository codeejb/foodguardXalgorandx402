import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Thermometer,
  Layers,
  MapPin,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_INVESTIGATIONS } from '../../data/mockData';
import { InvestigationLead } from '../../types';

interface InvestigationsViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(INITIAL_INVESTIGATIONS[0].id);
  const [issuedRecall, setIssuedRecall] = useState<boolean>(false);

  const selectedLead = INITIAL_INVESTIGATIONS.find((inv) => inv.id === selectedLeadId) || INITIAL_INVESTIGATIONS[0];

  const handleIssueRecall = () => {
    setIssuedRecall(true);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A67C00', '#DC2626', '#1A1A18']
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>FORENSIC INVESTIGATIONS: /investigations</span>
            <span>•</span>
            <span className="text-[#1A1A18]">EPIDEMIOLOGICAL ROOT-CAUSE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Food Safety Incident Investigations
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Automated multi-source evidence synthesis uniting temperature sensors, laboratory assays, and geotagged consumer complaints.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough INV-2026-089</span>
        </button>
      </div>

      {/* Main Grid: Investigation Leads & Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Lead List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1A1A18] mb-2">
            Active Forensic Leads ({INITIAL_INVESTIGATIONS.length})
          </h3>

          {INITIAL_INVESTIGATIONS.map((inv) => {
            const isSelected = inv.id === selectedLeadId;
            return (
              <div
                key={inv.id}
                onClick={() => {
                  setSelectedLeadId(inv.id);
                  setIssuedRecall(false);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                    : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#8F6B00]">
                    #{inv.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    CONFIDENCE {inv.confidence}%
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1A1A18]">
                  {inv.title}
                </h4>
                <p className="text-xs text-[#666] line-clamp-2 mt-1 leading-relaxed">
                  Target: {inv.targetProduct}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#777] pt-2 mt-2 border-t border-[#F0F0EB]">
                  <span>{inv.complaintCount} Complaints Linked</span>
                  <span className="text-[#8F6B00] font-semibold">Open Dossier →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Full Case Dossier */}
        <div className="lg:col-span-7 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                CASE FILE #{selectedLead.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                {selectedLead.title}
              </h2>
              <p className="text-xs text-[#777] font-sans">
                Suspect Source: {selectedLead.potentialSource}
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
              {selectedLead.status}
            </span>
          </div>

          {/* Root Cause Hypothesis Box */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>SYNTHESIZED EPIDEMIOLOGICAL ROOT CAUSE</span>
            </span>
            <p className="text-xs text-[#333] leading-relaxed">
              {selectedLead.temperatureDeviation}
            </p>
          </div>

          {/* Evidence Chain */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#1A1A18]">
              Corroborating Evidence Points ({selectedLead.evidencePoints.length})
            </h4>

            <div className="space-y-2">
              {selectedLead.evidencePoints.map((pt, idx) => (
                <div key={idx} className="p-3 bg-[#FAFAF7] border border-[#EBEBE6] rounded-lg text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8F6B00] shrink-0 mt-0.5" />
                  <span className="text-[#444] leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Directives */}
          <div className="bg-[#FDF9EE] border border-[#EEDBB3] rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-bold block">
              REGULATORY ACTION DIRECTIVE
            </span>
            <p className="text-xs text-[#735700] font-medium leading-relaxed">
              {selectedLead.recommendedAction}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#735700]">
                {issuedRecall ? 'Recall notice broadcast to retail network' : 'Immediate statutory recall recommended.'}
              </span>
              <button
                onClick={handleIssueRecall}
                disabled={issuedRecall}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  issuedRecall
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A1A18] hover:bg-[#8F6B00] text-white shadow-xs'
                }`}
              >
                {issuedRecall ? 'Recall Broadcast Sealed' : 'Issue Statutory Recall Notice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
