import React, { useState, useMemo } from 'react';
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
  Layers,
  Sliders,
  Thermometer,
  Clock,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiClient } from '../../services/apiClient';
import { useDataset } from '../../context/DatasetContext';
import { runWhatIfSimulation, runXGBoostInference } from '../../services/xgboostEngine';
import { INITIAL_BATCHES } from '../../data/mockData';

interface SimulatorViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const { foodBatches } = useDataset();
  const activeBatches = foodBatches.length > 0 ? foodBatches : INITIAL_BATCHES;

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

  // --- Interactive XGBoost Counterfactual State ---
  const [sandboxBatchId, setSandboxBatchId] = useState<string>(activeBatches[0]?.id || 'M492');
  const targetBatch = activeBatches.find(b => b.id === sandboxBatchId) || activeBatches[0];

  const [simTemp, setSimTemp] = useState<number>(3.5);
  const [simHours, setSimHours] = useState<number>(6);
  const [simStorage, setSimStorage] = useState<string>('Chilled Reefer (2-4°C)');

  // Baseline XGBoost prediction
  const baselinePrediction = useMemo(() => {
    return runXGBoostInference({
      Batch_ID: targetBatch?.id || 'M492',
      Product_Name: targetBatch?.productName || 'Pasteurized Toned Milk',
      Temperature_C: targetBatch?.temperatureMax ?? 8.4,
      Transport_Hours: 14,
      Lab_Status: targetBatch?.status === 'SAFE' ? 'Pass' : 'Borderline',
      Complaint_Count: 12,
      Storage_Condition: 'Refrigerated Cold Room'
    });
  }, [targetBatch]);

  // Counterfactual XGBoost prediction
  const counterfactualPrediction = useMemo(() => {
    return runXGBoostInference({
      Batch_ID: targetBatch?.id || 'M492',
      Product_Name: targetBatch?.productName || 'Pasteurized Toned Milk',
      Temperature_C: simTemp,
      Transport_Hours: simHours,
      Lab_Status: baselinePrediction.evidence.labStatus,
      Complaint_Count: Math.max(0, Math.floor(baselinePrediction.evidence.complaintCount * (simTemp <= 4 ? 0.2 : 0.8))),
      Storage_Condition: simStorage
    });
  }, [targetBatch, simTemp, simHours, simStorage, baselinePrediction]);

  const riskDelta = baselinePrediction.predictedRiskScore - counterfactualPrediction.predictedRiskScore;

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
      <div className="will-animate animate-slide-up bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#18181C] border border-[#2A2A30] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>DIGITAL TWIN SIMULATION ENGINE: /simulator</span>
            <span>•</span>
            <span className="text-gray-100">XGBOOST WHAT-IF COUNTERFACTUALS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-100">
            Contamination Spread & Intervention Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Model supply chain shock propagation and test regulatory quarantine policies before executing in the field.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-amber-600 hover:bg-[#725500] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-lg shadow-black/30 hover:scale-[1.02] hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Walkthrough Canonical Incident</span>
        </button>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Intervention Policy Selector */}
        <div className="lg:col-span-5 will-animate animate-slide-left delay-200 bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-6">
          <div className="border-b border-[#F0F0EB] pb-4">
            <h3 className="font-serif text-xl font-bold text-gray-100">
              Select Regulatory Policy
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
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
                badgeColor: 'bg-emerald-900/20 text-emerald-400 border-emerald-800/40'
              },
              {
                id: 'REROUTE_SUPPLY',
                title: 'Reroute Supply from Ambala Dairy Plant #01',
                badge: 'SUPPLY STABILIZATION',
                desc: 'Direct alternative compliant supply line to South Delhi retail stores within 3.5 hours.',
                badgeColor: 'bg-blue-900/20 text-blue-800 border-blue-800/40'
              },
              {
                id: 'CITIZEN_ALERT',
                title: 'Broadcast Consumer App Push Notice (Pin 110016/17)',
                badge: 'CONSUMER RECALL',
                desc: 'Push warning to quick commerce apps and citizen portal for batches sold between 08:00 and 12:00.',
                badgeColor: 'bg-amber-900/20 text-amber-400 border-amber-800/40'
              },
              {
                id: 'FIELD_INSPECTION_ONLY',
                title: 'Dispatch Flying Squad Inspection Only',
                badge: 'PASSIVE VERIFICATION',
                desc: 'Perform manual on-site swab test without halting active retail distribution.',
                badgeColor: 'bg-[#252529] text-gray-300 border-[#2A2A30]'
              }
            ].map((option, idx) => (
              <div
                key={option.id}
                onClick={() => handleRunIntervention(option.id)}
                className={`will-animate animate-slide-up hover:scale-[1.01] hover:shadow-lg transition-all duration-300 p-4 rounded-xl border cursor-pointer ${
                  selectedIntervention === option.id
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-black/20 ring-2 ring-amber-500/10'
                    : 'bg-[#18181C] hover:bg-[#18181C] border-[#2A2A30]'
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-xs text-gray-100">
                    {option.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0 ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {option.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleRunIntervention(selectedIntervention)}
              disabled={isSimulating}
              className="w-full bg-[#18181C] hover:bg-amber-600 text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md shadow-black/20 hover:scale-[1.02] hover:-translate-y-0.5"
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
        <div className="lg:col-span-7 will-animate animate-slide-right delay-200 space-y-6">
          {/* Main Comparison Outcome Card */}
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-semibold">
                  SIMULATION OUTCOME REPORT
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-100">
                  Public Health Exposure Mitigation
                </h3>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-800/40 text-emerald-400 px-3 py-1.5 rounded-lg text-right">
                <span className="font-serif text-xl font-bold block leading-none">
                  -{simResult.exposureReductionPercent}%
                </span>
                <span className="text-[9px] font-mono font-bold uppercase">Exposure Drop</span>
              </div>
            </div>

            {/* Before vs After Big Bars */}
            <div className="will-animate animate-pop delay-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-900/20/70 border border-red-800/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-red-400 font-medium">
                  <span>UNMITIGATED EXPOSURE</span>
                  <span className="font-mono">NO ACTION</span>
                </div>
                <div className="font-serif text-3xl font-bold text-red-400">
                  {simResult.exposureBefore.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">
                  Citizens potentially consuming soured / contaminated dairy across Delhi NCR & Gurugram.
                </p>
              </div>

              <div className="bg-emerald-900/20/70 border border-emerald-800/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span>MITIGATED EXPOSURE</span>
                  <span className="font-mono">EARLY INTERVENTION</span>
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-400">
                  {simResult.exposureAfter.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">
                  Contained strictly to pre-alert morning purchases prior to digital holding notice.
                </p>
              </div>
            </div>

            {/* Quantified Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-[#888] uppercase block">Seized On-Site</span>
                <span className="font-serif text-lg font-bold text-gray-100">
                  {simResult.seizedPouches.toLocaleString()} Pouches
                </span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-[#888] uppercase block">Sickness Prevented</span>
                <span className="font-serif text-lg font-bold text-emerald-400">
                  ~{simResult.hospitalizationsAvoided.toLocaleString()} Cases
                </span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-[#888] uppercase block">Economic Value Saved</span>
                <span className="font-serif text-lg font-bold text-[#8F6B00]">
                  ₹{simResult.costSavedCr} Crores
                </span>
              </div>
            </div>

            {/* Statutory Order Action */}
            <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] font-semibold text-gray-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Statutory Digital Enforcement Notice</span>
                </span>
                <p className="text-xs text-gray-400">
                  Anchor this intervention record immutably on Algorand TestNet ledger.
                </p>
              </div>
              <button
                onClick={() => onNavigate('blockchain')}
                className="bg-[#18181C] hover:bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Sign on Algorand →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE XGBOOST WHAT-IF COUNTERFACTUAL ENGINE */}
      <div className="will-animate animate-slide-up delay-400 bg-[#18181C] border-2 border-amber-600/50 rounded-2xl p-7 shadow-md shadow-black/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A30]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-amber-900/20 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 rounded">
              <span>XGBOOST ML COUNTERFACTUAL ENGINE</span>
            </div>
            <h2 className="font-display font-black text-2xl text-gray-100 uppercase tracking-tight mt-1">
              Dynamic Parameter Counterfactual Simulator
            </h2>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Adjust cold-chain handling variables in real time to calculate live XGBoost risk reduction curves.
            </p>
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 font-bold uppercase">Target Batch:</span>
            <select
              value={sandboxBatchId}
              onChange={(e) => setSandboxBatchId(e.target.value)}
              className="bg-[#18181C] border border-amber-800/40 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-gray-100 focus:outline-hidden"
            >
              {activeBatches.map(b => (
                <option key={b.id} value={b.id}>
                  #{b.id} — {b.productName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 will-animate animate-fade-in delay-500 space-y-5 bg-[#18181C] p-5 rounded-xl border border-amber-800/40/80">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gray-100">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Counterfactual Control Sliders</span>
            </div>

            {/* Slider 1: Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-gray-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Ambient Temperature (°C)</span>
                </span>
                <span className={`font-black text-sm px-2 py-0.5 rounded ${simTemp <= 4 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-100 text-red-400'}`}>
                  {simTemp.toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={simTemp}
                onChange={(e) => setSimTemp(parseFloat(e.target.value))}
                className="w-full accent-[#854D0E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>0°C (Ice Point)</span>
                <span>4°C (Safe Threshold)</span>
                <span>25°C (Room Temp)</span>
              </div>
            </div>

            {/* Slider 2: Transit Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-gray-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transport Transit Duration (Hours)</span>
                </span>
                <span className="font-black text-sm px-2 py-0.5 rounded bg-[#2A2A30] text-gray-100">
                  {simHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="48"
                step="1"
                value={simHours}
                onChange={(e) => setSimHours(parseInt(e.target.value))}
                className="w-full accent-[#854D0E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>1 Hour (Express)</span>
                <span>12 Hours</span>
                <span>48 Hours (Extended)</span>
              </div>
            </div>

            {/* Select 3: Storage Condition */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-amber-400" />
                <span>Cold-Room Storage Protocol</span>
              </label>
              <select
                value={simStorage}
                onChange={(e) => setSimStorage(e.target.value)}
                className="w-full bg-[#18181C] border border-[#3A3A42] rounded-lg p-2.5 text-xs font-mono font-bold text-gray-100 focus:outline-hidden"
              >
                <option value="Chilled Reefer (2-4°C)">Chilled Reefer Chamber (2-4°C)</option>
                <option value="Refrigerated Cold Room">Refrigerated Cold Room (4-6°C)</option>
                <option value="Ambient Depot Storage">Ambient Depot Storage (18-24°C)</option>
                <option value="Frozen Quarantine (-18°C)">Deep Freeze Quarantine (-18°C)</option>
              </select>
            </div>
          </div>

          {/* Real-Time Outcome Comparison */}
          <div className="lg:col-span-6 will-animate animate-fade-in delay-500 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Actual / Baseline */}
              <div className="p-4 rounded-xl border border-[#2A2A30] bg-[#1F1F24] space-y-2 text-center font-mono">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  BASELINE ESTIMATE
                </span>
                <div className="text-4xl font-black text-gray-100">
                  {baselinePrediction.predictedRiskScore}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-block ${
                  baselinePrediction.riskLevel === 'Critical' ? 'bg-red-100 text-red-400 border-red-800/40' : 'bg-amber-900/30 text-amber-400 border-amber-800/40'
                }`}>
                  {baselinePrediction.riskLevel}
                </span>
                <p className="text-[10px] text-gray-500 pt-1">
                  Recorded telemetry & lab status
                </p>
              </div>

              {/* Counterfactual Outcome */}
              <div className="p-4 rounded-xl border-2 border-amber-600/50 bg-[#18181C] space-y-2 text-center font-mono shadow-md shadow-black/20">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  SIMULATED OUTCOME
                </span>
                <div className="text-4xl font-black text-amber-400">
                  {counterfactualPrediction.predictedRiskScore}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-block ${
                  counterfactualPrediction.riskLevel === 'Safe' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40' : 'bg-amber-900/30 text-amber-400 border-amber-800/40'
                }`}>
                  {counterfactualPrediction.riskLevel}
                </span>
                <p className="text-[10px] text-gray-500 pt-1">
                  {riskDelta >= 0 ? `-${riskDelta.toFixed(0)} risk points reduction` : `+${Math.abs(riskDelta).toFixed(0)} risk points increase`}
                </p>
              </div>
            </div>

            {/* SHAP impact change */}
            <div className="bg-[#18181C] border border-amber-800/40 rounded-xl p-4 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                PRIMARY COUNTERFACTUAL DRIVER:
              </span>
              <p className="text-gray-200 leading-relaxed">
                {simTemp <= 4
                  ? `Maintaining cold-chain at ${simTemp.toFixed(1)}°C suppresses microbial kinetic escalation, avoiding an estimated ${Math.max(0, Math.floor(riskDelta * 0.8))} risk points.`
                  : `Elevated ambient temp of ${simTemp.toFixed(1)}°C accelerates bacterial doubling rate by ${((simTemp - 4) * 18).toFixed(0)}%.`}
              </p>
            </div>

            {/* Safety disclaimer */}
            <div className="text-[10px] font-mono text-gray-500 pt-1 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>AI PREDICTS. EVIDENCE EXPLAINS. LAB VERIFIES. HUMAN DECIDES.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
