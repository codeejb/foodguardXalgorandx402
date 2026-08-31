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
  Radio
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
  const [stateDrawerOpen, setStateDrawerOpen] = useState(false);

  const filteredStates = INDIA_STATE_RISKS.filter((s) => {
    if (riskFilter === 'ALL') return true;
    return s.riskLevel === riskFilter;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border-red-800/80';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-400 border-orange-800/80';
      case 'WATCH':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      default:
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
    }
  };

  const getRiskPinColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-600 border-black ring-2 ring-red-500/50';
      case 'HIGH':
        return 'bg-orange-500 border-black ring-2 ring-orange-500/50';
      case 'WATCH':
        return 'bg-amber-500 border-black ring-2 ring-amber-500/50';
      default:
        return 'bg-emerald-500 border-black ring-2 ring-emerald-500/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#0A0A0A] text-white">
      {/* Top Header & National Risk Metric */}
      <div className="bg-[#121212] border border-neutral-800 rounded p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-300 mb-2">
            <span>ROUTE: /dashboard</span>
            <span>//</span>
            <span className="text-white">AUTONOMOUS SWARM ONLINE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            National Food Safety Command Center
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-1">
            "SEE WHAT IS HAPPENING. UNDERSTAND WHY. ACT BEFORE IT SPREADS."
          </p>
        </div>

        {/* Big National Risk Score Badge */}
        <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded p-4 shrink-0 shadow-lg">
          <div className="text-right">
            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold">
              National Risk Score
            </div>
            <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-bold text-red-500 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{NATIONAL_STATS.riskTrendPercent}% (24H)</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded bg-red-950/80 border border-red-800/80 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-black text-red-400 leading-none">
              {NATIONAL_STATS.nationalRiskScore}
            </span>
            <span className="text-[8px] font-mono text-red-300 font-bold uppercase mt-0.5">/ 100</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive India Risk Map & State Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive India Risk Visualizer */}
        <div className="lg:col-span-8 bg-[#121212] border border-neutral-800 rounded p-6 shadow-xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="font-display font-bold text-xl uppercase tracking-tight text-white flex items-center gap-2">
                <span>Live India Food Risk Matrix</span>
                <span className="font-mono text-[10px] text-neutral-300 font-bold bg-neutral-900 px-2 py-0.5 border border-neutral-800 uppercase tracking-wider">
                  10 REGIONS MONITORED
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Click any regional telemetry node to inspect active incidents and dispatch directives.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              {(['ALL', 'CRITICAL', 'HIGH', 'WATCH', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    riskFilter === lvl
                      ? 'bg-white text-black shadow-xs'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Visual Map Container */}
          <div className="relative my-6 min-h-[380px] bg-[#0A0A0A] rounded border border-neutral-800 p-6 overflow-hidden flex flex-col justify-between">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C1C1C_1px,transparent_1px),linear-gradient(to_bottom,#1C1C1C_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />

            {/* State Markers Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStates.map((state) => {
                const isSelected = selectedState?.stateCode === state.stateCode;
                return (
                  <div
                    key={state.stateCode}
                    onClick={() => {
                      setSelectedState(state);
                      setStateDrawerOpen(true);
                    }}
                    className={`p-3.5 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-white shadow-xl ring-1 ring-white/20'
                        : 'bg-[#141414]/90 hover:bg-[#1A1A1A] border-neutral-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${getRiskPinColor(state.riskLevel)}`} />
                        <div>
                          <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
                            {state.stateName}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {state.activeIncidents} Active Cases
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black border uppercase tracking-wider ${getRiskColor(state.riskLevel)}`}>
                          RISK {state.riskScore}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-2 leading-tight font-mono">
                      {state.aiExplanation}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between text-xs text-neutral-400 border-t border-neutral-800 mt-4 font-mono">
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> LOW (0-40)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> WATCH (41-65)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> HIGH (66-80)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" /> CRITICAL (81-100)
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                Select state node to load dossier
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected State Dossier & AI Recommended Action */}
        <div className="lg:col-span-4 bg-[#121212] border border-neutral-800 rounded p-6 shadow-xl flex flex-col justify-between">
          {selectedState ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-[0.2em] font-bold">
                    Regional Dossier
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
                    {selectedState.stateName}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black border uppercase tracking-wider ${getRiskColor(selectedState.riskLevel)}`}>
                  {selectedState.riskLevel} (SCORE {selectedState.riskScore})
                </span>
              </div>

              {/* Mini telemetry stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#171717] p-2.5 rounded border border-neutral-800">
                  <span className="text-[9px] text-neutral-400 uppercase block tracking-wider">Active Incidents</span>
                  <span className="text-sm font-bold text-white">
                    {selectedState.activeIncidents} Cases
                  </span>
                </div>
                <div className="bg-[#171717] p-2.5 rounded border border-neutral-800">
                  <span className="text-[9px] text-neutral-400 uppercase block tracking-wider">Affected Batches</span>
                  <span className="text-sm font-bold text-amber-400">
                    {selectedState.affectedBatches} Lots
                  </span>
                </div>
                <div className="bg-[#171717] p-2.5 rounded border border-neutral-800">
                  <span className="text-[9px] text-neutral-400 uppercase block tracking-wider">Complaint Clusters</span>
                  <span className="text-sm font-bold text-red-400">
                    {selectedState.complaintClusters} Clusters
                  </span>
                </div>
                <div className="bg-[#171717] p-2.5 rounded border border-neutral-800">
                  <span className="text-[9px] text-neutral-400 uppercase block tracking-wider">24h Risk Trend</span>
                  <span className="text-sm font-bold text-white">
                    +{selectedState.riskTrend}%
                  </span>
                </div>
              </div>

              {/* Weather & Environmental signal */}
              <div className="bg-[#171717] p-3 rounded border border-neutral-800 space-y-1">
                <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-widest block">
                  METEOROLOGICAL & GRID SIGNALS
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                  {selectedState.weatherSignal}
                </p>
              </div>

              {/* AI Explanation */}
              <div className="bg-[#171717] p-3 rounded border border-neutral-800 space-y-1">
                <span className="text-[9px] font-mono text-white uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-red-500" />
                  <span>AI CAUSAL EXPLANATION</span>
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                  {selectedState.aiExplanation}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="bg-neutral-900 border border-neutral-700 rounded p-3.5 space-y-1">
                <span className="text-[9px] font-mono text-white uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>RECOMMENDED AUTHORITY INTERVENTION</span>
                </span>
                <p className="text-xs text-neutral-300 font-medium leading-relaxed font-mono">
                  {selectedState.recommendedAction}
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onNavigate('investigations')}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Crime Scene Lead
                </button>
                <button
                  onClick={() => onNavigate('inspections')}
                  className="flex-1 bg-transparent hover:bg-neutral-800 text-white border border-neutral-700 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Dispatch Officer
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-neutral-400 font-mono">
              Select a state on the risk matrix to load intelligence dossier.
            </div>
          )}
        </div>
      </div>

      {/* COMMAND CENTER 8-PANEL INTERACTIVE GRID */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">
              Live Ecosystem Telemetry Channels
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Eight synchronized multi-agent feeds monitoring India's national food safety grid.
            </p>
          </div>
          <button
            onClick={onOpenCanonicalModal}
            className="text-[10px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Walkthrough Canonical Crisis (M492)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Emerging Threats */}
          <div
            onClick={() => onNavigate('food-dna')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/80 uppercase tracking-wider">
                EMERGING THREATS (3)
              </span>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
              Batch #M492 Milk Thermal Spike
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Okhla Warehouse #17 recorded 14.8°C thermal excursion for 4.2 hours. Safety score down to 16.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Inspect Food DNA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Active Investigations */}
          <div
            onClick={() => onNavigate('investigations')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 uppercase tracking-wider">
                ACTIVE INVESTIGATIONS (2)
              </span>
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Delhi-NCR Milk Curdling Lead
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              23 complaints correlated with same distributor and cold-storage compressor failure. 94% confidence.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Open Investigation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Inspection Priorities */}
          <div
            onClick={() => onNavigate('inspections')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80 uppercase tracking-wider">
                AI INSPECTION PRIORITIES
              </span>
              <ShieldAlert className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
              #01 Warehouse #17 (Okhla)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Risk Score 94. Immediate seizure checklist and NABL sample extraction ready for mobile officer.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Generate Inspection Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: 72-Hour Forecast */}
          <div
            onClick={() => onNavigate('forecast')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80 uppercase tracking-wider">
                72-HOUR FORECAST
              </span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">
              Delhi NCR Peak Risk in +18h
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              High ambient temperature (38.5°C) predicted to accelerate bacterial growth kinetics across retail shelves.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Launch Time Machine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Unknown Anomalies */}
          <div
            onClick={() => onNavigate('anomalies')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/80 uppercase tracking-wider">
                UNKNOWN ANOMALIES (5)
              </span>
              <Cpu className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
              Synchronized Supplier Drift
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Autonomous detector discovered 3 independent suppliers with simultaneous temperature deviations.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>View Anomaly Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Blockchain Events */}
          <div
            onClick={() => onNavigate('blockchain')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 uppercase tracking-wider">
                BLOCKCHAIN EVENTS (412)
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Algorand TestNet Verified
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Round #42918894 anchored thermal excursion event. Tamper-proof public passport proof available.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Verify Cryptographic Proof</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 7: Citizen Reports */}
          <div
            onClick={() => onNavigate('citizen')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 uppercase tracking-wider">
                CITIZEN REPORTS (39)
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
              South Delhi Complaint Spike
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Geocoded reports of curdled milk and metallic odor processed with automated PII privacy protection.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>Open Citizen Network</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 8: x402 Activity */}
          <div
            onClick={() => onNavigate('x402')}
            className="bg-[#121212] border border-neutral-800 rounded p-5 hover:border-neutral-600 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-black text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wider">
                x402 AGENT ACTIVITY
              </span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
              $184.65 USDC Settled
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              114 autonomous agents paying per query for batch intelligence, risk curves, and contamination simulations.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-white font-bold uppercase tracking-wider">
              <span>View M2M Economy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
