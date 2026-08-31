import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Thermometer,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { INITIAL_BATCHES } from '../../data/mockData';

interface ForecastViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

const FORECAST_STEPS = [
  { hours: 0, label: 'NOW (0h)', riskScore: 16, bacterialCount: '42,000 CFU/ml', status: 'VIOLATION' },
  { hours: 6, label: '+6 HOURS', riskScore: 38, bacterialCount: '115,000 CFU/ml', status: 'CRITICAL' },
  { hours: 12, label: '+12 HOURS', riskScore: 54, bacterialCount: '340,000 CFU/ml', status: 'CRITICAL' },
  { hours: 24, label: '+24 HOURS', riskScore: 78, bacterialCount: '1,200,000 CFU/ml', status: 'SPOILED' },
  { hours: 48, label: '+48 HOURS', riskScore: 92, bacterialCount: '4,800,000 CFU/ml', status: 'TOXIC' },
  { hours: 72, label: '+72 HOURS', riskScore: 98, bacterialCount: '12,000,000 CFU/ml', status: 'TOXIC' }
];

const DEGRADATION_CHART_DATA = [
  { hour: '0h', unmitigated: 16, withColdRecovery: 16, withImmediateRecall: 16 },
  { hour: '+6h', unmitigated: 38, withColdRecovery: 22, withImmediateRecall: 18 },
  { hour: '+12h', unmitigated: 54, withColdRecovery: 28, withImmediateRecall: 18 },
  { hour: '+24h', unmitigated: 78, withColdRecovery: 32, withImmediateRecall: 18 },
  { hour: '+48h', unmitigated: 92, withColdRecovery: 36, withImmediateRecall: 18 },
  { hour: '+72h', unmitigated: 98, withColdRecovery: 40, withImmediateRecall: 18 }
];

export const ForecastView: React.FC<ForecastViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const currentStep = FORECAST_STEPS[selectedStepIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>PREDICTIVE TIME MACHINE: /forecast</span>
            <span>•</span>
            <span className="text-[#1A1A18]">72-HOUR BIOCHEMICAL KINETICS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Food Safety Time Machine
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Simulate future microbial growth trajectories and citizen exposure 72 hours before spoilage becomes visible.
          </p>
        </div>

        <button
          onClick={() => onNavigate('simulator')}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Zap className="w-4 h-4 text-[#C49200]" />
          <span>Launch Intervention Simulator</span>
        </button>
      </div>

      {/* Interactive Time Slider Controller */}
      <div className="bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A18] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8F6B00]" />
              <span>Autonomous Temporal Forecast Controller</span>
            </h3>
            <p className="text-xs text-[#777]">
              Drag or select time horizon to project bacterial multiplication on Batch M492 across Delhi NCR.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#8F6B00] bg-[#FDF9EE] px-3 py-1 rounded border border-[#EEDBB3]">
            PREDICTED STATUS: {currentStep.status}
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FORECAST_STEPS.map((step, idx) => {
            const isSelected = idx === selectedStepIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedStepIndex(idx)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A18] text-white border-[#1A1A18] shadow-md'
                    : 'bg-[#FAFAF7] hover:bg-white text-[#444] border-[#EBEBE6]'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">{step.label}</div>
                <div className="font-serif text-lg font-bold mt-0.5">
                  Score: {step.riskScore}
                </div>
                <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-[#C49200]' : 'text-red-600'}`}>
                  {step.bacterialCount}
                </div>
              </button>
            );
          })}
        </div>

        {/* Projected Impact Cards for Current Step */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#FAFAF7] p-4 rounded-lg border border-[#EBEBE6] space-y-1">
            <span className="text-[10px] font-mono text-[#888] uppercase block">
              Estimated Affected Retail Units
            </span>
            <span className="font-serif text-2xl font-bold text-[#1A1A18]">
              {selectedStepIndex === 0 ? '18,200 Pouches' : `${(selectedStepIndex + 1) * 9500} Pouches`}
            </span>
            <p className="text-[11px] text-[#666]">
              Distributed across 84 South Delhi retail stores and quick commerce hubs.
            </p>
          </div>

          <div className="bg-[#FAFAF7] p-4 rounded-lg border border-[#EBEBE6] space-y-1">
            <span className="text-[10px] font-mono text-[#888] uppercase block">
              Potential Public Exposure
            </span>
            <span className="font-serif text-2xl font-bold text-red-700">
              {selectedStepIndex === 0 ? '48,200 Citizens' : `${Math.min(94000, 48200 + selectedStepIndex * 12000)} Citizens`}
            </span>
            <p className="text-[11px] text-[#666]">
              Assuming average 2.4 consumers per household pouch consumption.
            </p>
          </div>

          <div className="bg-[#FAFAF7] p-4 rounded-lg border border-[#EBEBE6] space-y-1">
            <span className="text-[10px] font-mono text-[#888] uppercase block">
              Economic Loss if Unchecked
            </span>
            <span className="font-serif text-2xl font-bold text-[#8F6B00]">
              ₹{(1.2 + selectedStepIndex * 0.45).toFixed(2)} Crores
            </span>
            <p className="text-[11px] text-[#666]">
              Including medical claims, brand damage, and bulk supply recalls.
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Comparison Chart */}
      <div className="bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
              72-Hour Risk Trajectory Under Different Action Scenarios
            </h3>
            <p className="text-xs text-[#777]">
              Simulating Unmitigated Heatwave Spoilage vs. Immediate Digital Seizure.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Unmitigated
            </span>
            <span className="flex items-center gap-1.5 text-[#8F6B00]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8F6B00]" /> Cold Recovery
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Immediate Seizure
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEGRADATION_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EB" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#777' }} />
              <YAxis tick={{ fontSize: 11, fill: '#777' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#DDDCD6',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="unmitigated"
                name="Unmitigated Risk"
                stroke="#DC2626"
                fill="#FEE2E2"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="withColdRecovery"
                name="Cold Recovery Only"
                stroke="#A67C00"
                fill="#FEF3C7"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="withImmediateRecall"
                name="Immediate Digital Seizure"
                stroke="#059669"
                fill="#D1FAE5"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
