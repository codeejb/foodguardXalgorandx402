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
  FileCheck,
  UploadCloud,
  Database,
  Download,
  FileText,
  Sliders,
  Thermometer,
  ShieldCheck
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
import { useDataset } from '../../context/DatasetContext';

interface CommandCenterViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const {
    dataset,
    hasDataset,
    summaryStats,
    foodBatches,
    predictions,
    selectedBatch,
    setSelectedBatch,
    setUploadModalOpen,
    setReportModalOpen,
    setFeedbackModalOpen,
    loadDemoData,
    downloadSampleTemplate,
    mode
  } = useDataset();

  const stats = summaryStats || dataset?.summaryStats || {
    totalBatches: predictions?.length || 28,
    highRiskBatches: predictions?.filter((p) => p.predictedRiskScore >= 61 && p.predictedRiskScore < 81).length || 3,
    criticalBatches: predictions?.filter((p) => p.predictedRiskScore >= 81).length || 2,
    activeAnomalies: 5,
    complaintSignals: 34,
    labWarnings: 4,
    storageWarnings: 3,
    highestRiskProduct: 'Mother Dairy Buffalo Milk (84/100)',
    emergingThreats: 5,
    averageRiskScore: 42
  };

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

      {/* Quick Actions & Dataset Ingestion Controls */}
      <div className="bg-white border border-neutral-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-[#854D0E] hover:bg-[#A16207] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Excel / CSV</span>
          </button>

          <button
            onClick={loadDemoData}
            className="bg-amber-50 hover:bg-amber-100 text-[#78350F] border border-amber-300 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-[#854D0E]" />
            <span>Use Demo Dataset</span>
          </button>

          <button
            onClick={downloadSampleTemplate}
            className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sample Template (.xlsx)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>Investigation Report</span>
          </button>

          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Calibrate AI Model</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">Total Batches</span>
          <span className="font-mono text-2xl font-black text-neutral-900">{stats.totalBatches}</span>
          <span className="text-[10px] text-neutral-400 block font-mono">In active memory</span>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-red-600 uppercase font-bold block">High-Risk</span>
          <span className="font-mono text-2xl font-black text-red-600">{stats.highRiskBatches}</span>
          <span className="text-[10px] text-red-500 block font-mono">Score &gt; 65</span>
        </div>

        <div className="bg-white border border-red-300 rounded-xl p-3 shadow-2xs bg-red-50/40">
          <span className="text-[10px] font-mono text-red-700 uppercase font-bold block">Critical</span>
          <span className="font-mono text-2xl font-black text-red-700">{stats.criticalBatches}</span>
          <span className="text-[10px] text-red-600 block font-mono">Quarantine needed</span>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-[#78350F] uppercase font-bold block">Anomalies</span>
          <span className="font-mono text-2xl font-black text-[#854D0E]">{stats.activeAnomalies}</span>
          <span className="text-[10px] text-neutral-400 block font-mono">Pattern flags</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">Citizen Complaints</span>
          <span className="font-mono text-2xl font-black text-neutral-900">{stats.complaintSignals}</span>
          <span className="text-[10px] text-neutral-400 block font-mono">Geocoded</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">Lab Warnings</span>
          <span className="font-mono text-2xl font-black text-neutral-900">{stats.labWarnings}</span>
          <span className="text-[10px] text-neutral-400 block font-mono">Borderline / Failed</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">Storage Alert</span>
          <span className="font-mono text-2xl font-black text-neutral-900">{stats.storageWarnings}</span>
          <span className="text-[10px] text-neutral-400 block font-mono">Non-compliant</span>
        </div>

        <div className="bg-white border border-amber-300 rounded-xl p-3 shadow-2xs bg-amber-50/40">
          <span className="text-[10px] font-mono text-[#78350F] uppercase font-bold block">Avg Risk Score</span>
          <span className="font-mono text-2xl font-black text-[#854D0E]">{stats.averageRiskScore}/100</span>
          <span className="text-[10px] text-neutral-500 block font-mono">Model estimate</span>
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

      {/* ACTIVE BATCHES & PREDICTION MATRIX */}
      <div className="bg-white border border-neutral-300 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-[10px] font-mono font-bold text-[#78350F] uppercase tracking-wider mb-1">
              <span>ACTIVE DATASET</span>
              <span>•</span>
              <span>{mode === 'DEMO' ? 'SYNTHETIC REFERENCE BENCHMARK' : 'USER-UPLOADED DATASET'}</span>
            </div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#854D0E]" />
              <span>Monitored Batches & AI Risk Classification</span>
            </h2>
            <p className="text-xs text-neutral-500 font-mono">
              AI evaluates cold-chain temperature logs, transit duration, lab microbiology, and consumer complaints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="text-xs font-bold text-[#854D0E] hover:text-[#A16207] bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New Data</span>
            </button>
          </div>
        </div>

        {/* Batches Table */}
        {predictions && predictions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-[#FAF8F2] text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                  <th className="py-3 px-3">Batch ID</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Temp (°C)</th>
                  <th className="py-3 px-3">Transit</th>
                  <th className="py-3 px-3">Lab Status</th>
                  <th className="py-3 px-3">Complaints</th>
                  <th className="py-3 px-3">Storage</th>
                  <th className="py-3 px-3">Predicted Risk</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {predictions.map((p) => {
                  const isHigh = p.predictedRiskScore >= 65;
                  const isCrit = p.riskLevel === 'CRITICAL';
                  return (
                    <tr
                      key={p.batchId}
                      className={`hover:bg-amber-50/50 transition-colors ${
                        selectedBatch?.id === p.batchId ? 'bg-amber-100/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                        #{p.batchId}
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-800">
                        {p.productName}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.temperatureC > 10
                              ? 'bg-red-100 text-red-700'
                              : p.temperatureC > 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.temperatureC}°C
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-600">
                        {p.transportHours} hrs
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            p.labStatus === 'FAILED'
                              ? 'bg-red-100 text-red-700'
                              : p.labStatus === 'BORDERLINE'
                              ? 'bg-amber-100 text-[#78350F]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.labStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`font-bold ${
                            p.complaintCount > 10
                              ? 'text-red-600'
                              : p.complaintCount > 0
                              ? 'text-amber-700'
                              : 'text-neutral-500'
                          }`}
                        >
                          {p.complaintCount} reports
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                            p.storageCondition === 'NON_COMPLIANT'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.storageCondition}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                              isCrit
                                ? 'bg-red-600 text-white'
                                : isHigh
                                ? 'bg-red-100 text-red-800'
                                : p.riskLevel === 'WATCH'
                                ? 'bg-amber-100 text-[#78350F]'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.riskLevel} ({p.predictedRiskScore})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const found = foodBatches.find((b) => b.id === p.batchId);
                              if (found) setSelectedBatch(found);
                              onNavigate('food-dna');
                            }}
                            className="text-[10px] font-bold text-[#854D0E] hover:text-white hover:bg-[#854D0E] border border-amber-300 px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Inspect DNA
                          </button>
                          <button
                            onClick={() => {
                              const found = foodBatches.find((b) => b.id === p.batchId);
                              if (found) setSelectedBatch(found);
                              onNavigate('simulator');
                            }}
                            className="text-[10px] font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Simulate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* No Dataset Loaded State */
          <div className="text-center py-12 px-4 space-y-4 border-2 border-dashed border-amber-300 rounded-xl bg-[#FFFDF5]">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#854D0E] flex items-center justify-center mx-auto">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900">
                No Food Safety Dataset Ingested
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1 font-mono">
                Upload your Excel (.xlsx) or CSV file with the 7 required columns, or load the pre-calculated synthetic demo dataset to inspect live intelligence.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-[#854D0E] hover:bg-[#A16207] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Excel / CSV</span>
              </button>
              <button
                onClick={loadDemoData}
                className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4 text-[#854D0E]" />
                <span>Load Synthetic Demo Data</span>
              </button>
            </div>
          </div>
        )}
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
