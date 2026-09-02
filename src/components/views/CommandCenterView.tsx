import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  ShieldAlert,
  Search,
  MapPin,
  ChevronRight,
  Sparkles,
  Cpu,
  Clock,
  Coins,
  CheckCircle,
  X,
  Layers,
  ArrowUpRight,
  BarChart3,
  Radio,
  FileCheck
} from 'lucide-react';
import {
  NATIONAL_STATS,
  INDIA_STATE_RISKS,
  INITIAL_BATCHES,
  INITIAL_ANOMALIES,
  INITIAL_INVESTIGATIONS,
  INITIAL_INSPECTIONS,
  INITIAL_BLOCKCHAIN_EVENTS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_X402_SETTLEMENTS
} from '../../data/mockData';
import { StateRiskData, FoodBatch } from '../../types';
import { InteractiveIndiaMap } from '../InteractiveIndiaMap';

interface CommandCenterViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedState, setSelectedState] = useState<StateRiskData | null>(INDIA_STATE_RISKS[0]);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'WATCH' | 'LOW'>('ALL');

  const filteredStates = INDIA_STATE_RISKS.filter((s) => {
    if (riskFilter === 'ALL') return true;
    return s.riskLevel === riskFilter;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'WATCH':
        return 'bg-amber-100 text-[#78350F] border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#FAFAF8] text-neutral-900">
      {/* Top Header & National Risk Metric with White Background and Dark Yellow Accents */}
      <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#78350F] rounded">
            <span className="w-2 h-2 rounded-full bg-[#854D0E] animate-ping" />
            <span>ROUTE: /dashboard</span>
            <span>//</span>
            <span>NATIONAL FOOD DEFENSE NETWORK</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-900">
            Command Center & Risk Grid
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-mono">
            "SEE WHAT IS HAPPENING. UNDERSTAND WHY. ACT BEFORE IT SPREADS."
          </p>
        </div>

        {/* National Risk Score Metric */}
        <div className="flex items-center gap-4 bg-[#FAF8F2] border border-amber-300 rounded-xl p-4 shrink-0 shadow-xs">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold">
              National Risk Score
            </div>
            <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-bold text-red-600 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{NATIONAL_STATS.riskTrendPercent}% (24H)</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-lg bg-red-50 border-2 border-red-300 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-black text-red-600 leading-none">
              {NATIONAL_STATS.nationalRiskScore}
            </span>
            <span className="text-[8px] font-mono text-red-800 font-bold uppercase mt-0.5">/ 100</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Working Interactive India Map & Selected Regional Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Working India Map */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <InteractiveIndiaMap
            states={INDIA_STATE_RISKS}
            selectedState={selectedState}
            onSelectState={setSelectedState}
          />
        </div>

        {/* Right Column: Selected State Dossier & AI Recommended Action */}
        <div className="lg:col-span-4 bg-white border border-neutral-300 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          {selectedState ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] font-bold">
                    Regional Intelligence Dossier
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                    {selectedState.stateName}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black border uppercase tracking-wider ${getRiskBadge(selectedState.riskLevel)}`}>
                  {selectedState.riskLevel} • {selectedState.riskScore}
                </span>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#FAF8F2] p-2.5 rounded border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 uppercase block tracking-wider font-bold">Active Incidents</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {selectedState.activeIncidents} Cases
                  </span>
                </div>
                <div className="bg-[#FAF8F2] p-2.5 rounded border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 uppercase block tracking-wider font-bold">Affected Batches</span>
                  <span className="text-sm font-bold text-[#854D0E]">
                    {selectedState.affectedBatches} Lots
                  </span>
                </div>
                <div className="bg-[#FAF8F2] p-2.5 rounded border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 uppercase block tracking-wider font-bold">Complaint Clusters</span>
                  <span className="text-sm font-bold text-red-600">
                    {selectedState.complaintClusters} Clusters
                  </span>
                </div>
                <div className="bg-[#FAF8F2] p-2.5 rounded border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 uppercase block tracking-wider font-bold">24h Risk Trend</span>
                  <span className="text-sm font-bold text-neutral-900">
                    +{selectedState.riskTrend}%
                  </span>
                </div>
              </div>

              {/* Weather & Environmental signal */}
              <div className="bg-[#FAF8F2] p-3 rounded border border-neutral-200 space-y-1">
                <span className="text-[9px] font-mono text-[#854D0E] uppercase font-bold tracking-widest block">
                  METEOROLOGICAL & AMBIENT SIGNALS
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed font-mono">
                  {selectedState.weatherSignal}
                </p>
              </div>

              {/* AI Causal Explanation */}
              <div className="bg-[#FAF8F2] p-3 rounded border border-neutral-200 space-y-1">
                <span className="text-[9px] font-mono text-neutral-900 uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-red-600" />
                  <span>AI CAUSAL ROOT EXPLANATION</span>
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed font-mono">
                  {selectedState.aiExplanation}
                </p>
              </div>

              {/* Recommended Authority Action */}
              <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-lg p-3.5 space-y-1">
                <span className="text-[9px] font-mono text-[#78350F] uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#854D0E]" />
                  <span>RECOMMENDED AUTHORITY INTERVENTION</span>
                </span>
                <p className="text-xs text-[#78350F] font-bold leading-relaxed font-mono">
                  {selectedState.recommendedAction}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onNavigate('investigations')}
                  className="flex-1 bg-[#854D0E] hover:bg-[#A16207] text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
                >
                  Crime Scene Lead
                </button>
                <button
                  onClick={() => onNavigate('inspections')}
                  className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Dispatch Officer
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-neutral-500 font-mono">
              Click any node on the India Map to inspect real-time regional dossier.
            </div>
          )}
        </div>
      </div>

      {/* COMMAND CENTER 8-PANEL TELEMETRY GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
              Live Ecosystem Telemetry Channels
            </h2>
            <p className="text-xs text-neutral-500 font-mono">
              Eight synchronized multi-agent feeds monitoring India's national food safety grid.
            </p>
          </div>
          <button
            onClick={onOpenCanonicalModal}
            className="text-[10px] font-bold uppercase tracking-widest text-[#78350F] bg-[#FEF3C7] border border-[#FDE68A] px-3.5 py-2 rounded flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>Walkthrough Canonical Crisis (M492)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Emerging Threats */}
          <div
            onClick={() => onNavigate('food-dna')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 uppercase tracking-wider">
                EMERGING THREATS (3)
              </span>
              <Activity className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              Batch #M492 Milk Thermal Spike
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Okhla Warehouse #17 recorded 14.8°C thermal excursion for 4.2 hours. Safety score down to 16.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Inspect Food DNA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Active Investigations */}
          <div
            onClick={() => onNavigate('investigations')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-[#78350F] bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                ACTIVE INVESTIGATIONS (2)
              </span>
              <Search className="w-4 h-4 text-[#854D0E]" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              Delhi-NCR Milk Curdling Lead
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              23 complaints correlated with same distributor and cold-storage compressor failure. 94% confidence.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Open Investigation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Inspection Priorities */}
          <div
            onClick={() => onNavigate('inspections')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                AI INSPECTION PRIORITIES
              </span>
              <ShieldAlert className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              #01 Warehouse #17 (Okhla)
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Risk Score 94. Immediate seizure checklist and NABL sample extraction ready for mobile officer.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Generate Inspection Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: 72-Hour Forecast */}
          <div
            onClick={() => onNavigate('forecast')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wider">
                72-HOUR FORECAST
              </span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              Delhi NCR Peak Risk in +18h
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              High ambient temperature (38.5°C) predicted to accelerate bacterial growth kinetics across retail shelves.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Launch Time Machine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Unknown Anomalies */}
          <div
            onClick={() => onNavigate('anomalies')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 uppercase tracking-wider">
                UNKNOWN ANOMALIES (5)
              </span>
              <Cpu className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              Synchronized Supplier Drift
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Autonomous detector discovered 3 independent suppliers with simultaneous temperature deviations.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>View Anomaly Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Blockchain Events */}
          <div
            onClick={() => onNavigate('blockchain')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                BLOCKCHAIN EVENTS (412)
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              Algorand TestNet Verified
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Round #42918894 anchored thermal excursion event. Tamper-proof public passport proof available.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Verify Cryptographic Proof</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 7: Citizen Reports */}
          <div
            onClick={() => onNavigate('citizen')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-[#78350F] bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                CITIZEN REPORTS (39)
              </span>
              <AlertTriangle className="w-4 h-4 text-[#854D0E]" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              South Delhi Complaint Spike
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Geocoded reports of curdled milk and metallic odor processed with automated PII privacy protection.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>Open Citizen Network</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 8: x402 Activity */}
          <div
            onClick={() => onNavigate('x402')}
            className="bg-white border border-neutral-300 hover:border-[#854D0E] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A] uppercase tracking-wider">
                x402 AGENT ACTIVITY
              </span>
              <Coins className="w-4 h-4 text-[#854D0E]" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
              $184.65 USDC Settled
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              114 autonomous agents paying per query for batch intelligence, risk curves, and contamination simulations.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#854D0E] font-bold uppercase tracking-wider">
              <span>View M2M Economy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
