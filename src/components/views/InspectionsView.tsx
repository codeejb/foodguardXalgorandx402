import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Cpu,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_INSPECTIONS } from '../../data/mockData';
import { InspectionPriority } from '../../types';

interface InspectionsViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(INITIAL_INSPECTIONS[0].id);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'item-0': true,
    'item-1': true
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const plan = INITIAL_INSPECTIONS.find((p) => p.id === selectedPlanId) || INITIAL_INSPECTIONS[0];

  const handleToggleItem = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSubmitInspection = () => {
    setSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A67C00', '#10B981', '#1A1A18']
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>FIELD OFFICER COPILOT: /inspections</span>
            <span>•</span>
            <span className="text-[#1A1A18]">AI-RANKED PRIORITY DISPATCH</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            AI Inspector Copilot
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Dynamic risk-ranked facility queues, tailored forensic checklists, and digital on-site evidence capture.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough Warehouse #17 Dispatch</span>
        </button>
      </div>

      {/* Main Grid: Priority Queue & Active Inspection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Priority Queue */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1A1A18] mb-2">
            AI-Ranked Priority Queue ({INITIAL_INSPECTIONS.length})
          </h3>

          {INITIAL_INSPECTIONS.map((p, idx) => {
            const isSelected = p.id === selectedPlanId;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPlanId(p.id);
                  setSubmitted(false);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                    : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A18] text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      #{p.rank}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8F6B00]">
                      #{p.id}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                    RISK SCORE {p.riskScore}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1A1A18]">
                  {p.targetName}
                </h4>
                <p className="text-xs text-[#666] line-clamp-2 mt-1 leading-relaxed">
                  {p.reason}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#777] pt-2 mt-2 border-t border-[#F0F0EB]">
                  <span>Location: {p.location}</span>
                  <span className="text-[#8F6B00] font-semibold">Open Checklist →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Interactive Field Checklist */}
        <div className="lg:col-span-7 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                DISPATCH ORDER #{plan.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                {plan.targetName}
              </h2>
              <p className="text-xs text-[#777] font-sans">
                Location: {plan.location}
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
              PRIORITY #{plan.rank}
            </span>
          </div>

          {/* AI Mission Briefing */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>AI FIELD BRIEFING</span>
            </span>
            <p className="text-xs text-[#333] leading-relaxed">
              {plan.reason}
            </p>
          </div>

          {/* Checklist Form */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#1A1A18] flex items-center justify-between">
              <span>Tailored Inspection Tasks</span>
              <span className="text-xs font-mono text-[#888]">
                {Object.values(completedItems).filter(Boolean).length} / {plan.checklist.length} Completed
              </span>
            </h4>

            <div className="space-y-2">
              {plan.checklist.map((task, i) => {
                const itemId = `item-${i}`;
                const isChecked = !!completedItems[itemId];
                return (
                  <div
                    key={itemId}
                    onClick={() => handleToggleItem(itemId)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-[#FDF9EE] border-[#EEDBB3] text-[#1A1A18]'
                        : 'bg-[#FAFAF7] border-[#EBEBE6] text-[#555]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleItem(itemId)}
                      className="mt-0.5 rounded text-[#8F6B00] focus:ring-[#8F6B00] cursor-pointer"
                    />
                    <div className="flex-1 text-xs leading-relaxed">
                      <span className={isChecked ? 'font-medium' : ''}>{task}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-[#F0F0EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-[#777]">
              {submitted ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Inspection Submitted & Signed on Algorand
                </span>
              ) : (
                <span>All evidence will be cryptographically anchored to Algorand TestNet.</span>
              )}
            </div>

            <button
              onClick={handleSubmitInspection}
              disabled={submitted}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                submitted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#1A1A18] hover:bg-[#8F6B00] text-white shadow-xs'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>{submitted ? 'Verified on Ledger' : 'Submit & Sign Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
