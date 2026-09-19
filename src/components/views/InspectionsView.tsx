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
      <div className="will-animate animate-slide-up bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#18181C] border border-[#2A2A30] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>FIELD OFFICER COPILOT: /inspections</span>
            <span>•</span>
            <span className="text-gray-100">AI-RANKED PRIORITY DISPATCH</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-100">
            AI Inspector Copilot
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Dynamic risk-ranked facility queues, tailored forensic checklists, and digital on-site evidence capture.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#18181C] hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-black/30"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough Warehouse #17 Dispatch</span>
        </button>
      </div>

      {/* Main Grid: Priority Queue & Active Inspection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Priority Queue */}
        <div className="will-animate animate-slide-left delay-200 lg:col-span-5 space-y-3">
          <h3 className="font-serif text-base font-bold text-gray-100 mb-2">
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
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`will-animate animate-slide-up hover:scale-[1.01] hover:shadow-lg transition-all duration-300 p-4 rounded-xl border ${
                  isSelected
                    ? 'bg-[#18181C] border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                    : 'bg-[#18181C] hover:bg-[#18181C] border-[#2A2A30]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#18181C] text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      #{p.rank}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8F6B00]">
                      #{p.id}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-900/20 text-red-400 border border-red-800/40">
                    RISK SCORE {p.riskScore}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-gray-100">
                  {p.targetName}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                  {p.reason}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 mt-2 border-t border-[#F0F0EB]">
                  <span>Location: {p.location}</span>
                  <span className="text-[#8F6B00] font-semibold">Open Checklist →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Interactive Field Checklist */}
        <div className="will-animate animate-slide-right delay-200 lg:col-span-7 bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                DISPATCH ORDER #{plan.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-100">
                {plan.targetName}
              </h2>
              <p className="text-xs text-gray-500 font-sans">
                Location: {plan.location}
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-900/20 text-red-400 border border-red-800/40">
              PRIORITY #{plan.rank}
            </span>
          </div>

          {/* AI Mission Briefing */}
          <div className="will-animate animate-fade-in delay-300 bg-[#18181C] border border-[#2A2A30] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-gray-100 uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>AI FIELD BRIEFING</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              {plan.reason}
            </p>
          </div>

          {/* Checklist Form */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gray-100 flex items-center justify-between">
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
                    style={{ animationDelay: `${i * 60 + 300}ms` }}
                    className={`will-animate animate-slide-up hover:scale-[1.005] transition-all duration-200 p-3.5 rounded-lg border cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-[#18181C] border-[#2A2A30] text-gray-400'
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
          <div className="will-animate animate-pop delay-500 pt-2 border-t border-[#F0F0EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              {submitted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Inspection Submitted & Signed on Algorand
                </span>
              ) : (
                <span>All evidence will be cryptographically anchored to Algorand TestNet.</span>
              )}
            </div>

            <button
              onClick={handleSubmitInspection}
              disabled={submitted}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                submitted
                  ? 'bg-emerald-600 text-white shadow-md shadow-black/20'
                  : 'bg-[#18181C] hover:bg-amber-600 text-white shadow-md shadow-black/20'
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
