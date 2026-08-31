import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Building2,
  Lock,
  Activity,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiClient } from '../../services/apiClient';

interface SimulatorViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedIntervention, setSelectedIntervention] = useState<string>('CLOSE_WAREHOUSE');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{
    exposureBefore: number;
    exposureAfter: number;
    exposureReductionPercent: number;
    affectedNodesCount: number;
    alternativeSupplier: string;
    disruptionIndex: string;
    seizedPouches: number;
    hospitalizationsAvoided: number;
    costSavedCr: number;
  }>({
    exposureBefore: 48200,
    exposureAfter: 2100,
    exposureReductionPercent: 95.6,
    affectedNodesCount: 14,
    alternativeSupplier: 'Ambala Dairy Processing Plant #01',
    disruptionIndex: 'LOW',
    seizedPouches: 18200,
    hospitalizationsAvoided: 4200,
    costSavedCr: 2.4
  });

  const [executed, setExecuted] = useState<boolean>(true);

  const handleRunIntervention = async (type: string) => {
    setIsSimulating(true);
    setSelectedIntervention(type);

    try {
      const res = await ApiClient.simulateIntervention(type, 'NODE-WH-17');
      setSimResult({
        exposureBefore: res.exposureBefore || 48200,
        exposureAfter: res.exposureAfter || 2100,
        exposureReductionPercent: res.exposureReductionPercent || 95.6,
        affectedNodesCount: res.affectedNodesCount || 14,
        alternativeSupplier: res.alternativeSupplier || 'Ambala Dairy Processing Plant #01',
        disruptionIndex: res.disruptionIndex || 'LOW',
        seizedPouches: 18200,
        hospitalizationsAvoided: 4200,
        costSavedCr: 2.4
      });
      setExecuted(true);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A67C00', '#10B981', '#1A1A18']
        });
      } catch {}
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>DIGITAL TWIN SIMULATION ENGINE: /simulator</span>
            <span>•</span>
            <span className="text-[#1A1A18]">WHAT-IF INTERVENTIONS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Contamination Spread & Intervention Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Model supply chain shock propagation and test regulatory quarantine policies before executing in the field.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#8F6B00] hover:bg-[#725500] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Walkthrough Canonical Incident</span>
        </button>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Intervention Policy Selector */}
        <div className="lg:col-span-5 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#F0F0EB] pb-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1A18]">
              Select Regulatory Policy
            </h3>
            <p className="text-xs text-[#777] mt-0.5">
              Simulate the epidemiological and economic consequences of different regulatory actions.
            </p>
          </div>

          {/* Intervention Options */}
          <div className="space-y-3">
            {[
              {
                id: 'CLOSE_WAREHOUSE',
                title: 'Quarantine Warehouse #17 & Hold Batch M492',
                badge: 'RECOMMENDED (95.6% REDUCTION)',
                desc: 'Instantly issue digital statutory hold on Chamber 3. Halts 18,200 retail pouches at distributor gate.',
                badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
              },
              {
                id: 'REROUTE_SUPPLY',
                title: 'Reroute Supply from Ambala Dairy Plant #01',
                badge: 'SUPPLY STABILIZATION',
                desc: 'Direct alternative compliant supply line to South Delhi retail stores within 3.5 hours.',
                badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
              },
              {
                id: 'CITIZEN_ALERT',
                title: 'Broadcast Consumer App Push Notice (Pin 110016/17)',
                badge: 'CONSUMER RECALL',
                desc: 'Push warning to quick commerce apps and citizen portal for batches sold between 08:00 and 12:00.',
                badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
              },
              {
                id: 'FIELD_INSPECTION_ONLY',
                title: 'Dispatch Flying Squad Inspection Only',
                badge: 'PASSIVE VERIFICATION',
                desc: 'Perform manual on-site swab test without halting active retail distribution.',
                badgeColor: 'bg-gray-100 text-gray-700 border-gray-200'
              }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => handleRunIntervention(option.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedIntervention === option.id
                    ? 'bg-[#FDF9EE] border-[#8F6B00] shadow-xs ring-2 ring-[#8F6B00]/10'
                    : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-xs text-[#1A1A18]">
                    {option.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0 ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed">
                  {option.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleRunIntervention(selectedIntervention)}
              disabled={isSimulating}
              className="w-full bg-[#1A1A18] hover:bg-[#8F6B00] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {isSimulating ? (
                <span>Simulating Graph Propagation...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#C49200]" />
                  <span>Execute Real-Time Twin Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Live Simulation Outcome Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Comparison Outcome Card */}
          <div className="bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-semibold">
                  SIMULATION OUTCOME REPORT
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A18]">
                  Public Health Exposure Mitigation
                </h3>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-right">
                <span className="font-serif text-xl font-bold block leading-none">
                  -{simResult.exposureReductionPercent}%
                </span>
                <span className="text-[9px] font-mono font-bold uppercase">Exposure Drop</span>
              </div>
            </div>

            {/* Before vs After Big Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-red-700 font-medium">
                  <span>UNMITIGATED EXPOSURE</span>
                  <span className="font-mono">NO ACTION</span>
                </div>
                <div className="font-serif text-3xl font-bold text-red-700">
                  {simResult.exposureBefore.toLocaleString()}
                </div>
                <p className="text-xs text-[#666]">
                  Citizens potentially consuming soured / contaminated dairy across Delhi NCR & Gurugram.
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                  <span>MITIGATED EXPOSURE</span>
                  <span className="font-mono">EARLY INTERVENTION</span>
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-800">
                  {simResult.exposureAfter.toLocaleString()}
                </div>
                <p className="text-xs text-[#666]">
                  Contained strictly to pre-alert morning purchases prior to digital holding notice.
                </p>
              </div>
            </div>

            {/* Quantified Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6]">
                <span className="text-[10px] text-[#888] uppercase block">Seized On-Site</span>
                <span className="font-serif text-lg font-bold text-[#1A1A18]">
                  {simResult.seizedPouches.toLocaleString()} Pouches
                </span>
              </div>
              <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6]">
                <span className="text-[10px] text-[#888] uppercase block">Sickness Prevented</span>
                <span className="font-serif text-lg font-bold text-emerald-700">
                  ~{simResult.hospitalizationsAvoided.toLocaleString()} Cases
                </span>
              </div>
              <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[#EBEBE6]">
                <span className="text-[10px] text-[#888] uppercase block">Economic Value Saved</span>
                <span className="font-serif text-lg font-bold text-[#8F6B00]">
                  ₹{simResult.costSavedCr} Crores
                </span>
              </div>
            </div>

            {/* Statutory Order Action */}
            <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] font-semibold text-[#1A1A18] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Statutory Digital Enforcement Notice</span>
                </span>
                <p className="text-xs text-[#666]">
                  Anchor this intervention record immutably on Algorand TestNet ledger.
                </p>
              </div>
              <button
                onClick={() => onNavigate('blockchain')}
                className="bg-white hover:bg-[#FDF9EE] text-[#8F6B00] border border-[#EEDBB3] px-3 py-1.5 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Sign on Algorand →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
