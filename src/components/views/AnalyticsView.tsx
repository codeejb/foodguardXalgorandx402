import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldCheck,
  Building2,
  Users,
  Coins,
  MapPin,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { NATIONAL_STATS } from '../../data/mockData';

interface AnalyticsViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

const CATEGORY_DATA = [
  { name: 'Dairy & Milk', value: 42, color: '#A67C00' },
  { name: 'Poultry & Meat', value: 24, color: '#DC2626' },
  { name: 'Spices & Condiments', value: 18, color: '#D97706' },
  { name: 'Edible Oils', value: 10, color: '#2563EB' },
  { name: 'Bakery & Packaged', value: 6, color: '#059669' }
];

const INCIDENT_TREND = [
  { month: 'Mar 2026', incidents: 142, prevented: 136 },
  { month: 'Apr 2026', incidents: 188, prevented: 180 },
  { month: 'May 2026', incidents: 215, prevented: 206 },
  { month: 'Jun 2026', incidents: 280, prevented: 268 },
  { month: 'Jul 2026', incidents: 310, prevented: 298 },
  { month: 'Aug 2026', incidents: 348, prevented: 334 }
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>NATIONAL INTELLIGENCE METRICS: /analytics</span>
            <span>•</span>
            <span className="text-[#1A1A18]">EPIDEMIOLOGICAL MONITORING</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            National Food Safety Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Macro-level trends, commodity vulnerability indices, and economic protection across all Indian states.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-[#DDDCD6] rounded-xl p-3 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#888] uppercase block">Protected Population</span>
            <span className="font-serif text-xl font-bold text-emerald-700">1.42M Citizens</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EBEBE6] rounded-xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Monitored Supply Nodes</span>
          <div className="font-serif text-3xl font-bold text-[#1A1A18]">{NATIONAL_STATS.monitoredNodes.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-mono font-medium">+18.4% this quarter</span>
        </div>

        <div className="bg-white border border-[#EBEBE6] rounded-xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Active Incidents</span>
          <div className="font-serif text-3xl font-bold text-red-600">{NATIONAL_STATS.activeIncidents}</div>
          <span className="text-[11px] text-red-600 font-mono font-medium">{NATIONAL_STATS.quarantinedBatches} Batches Quarantined</span>
        </div>

        <div className="bg-white border border-[#EBEBE6] rounded-xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Estimated Prevented Exposure</span>
          <div className="font-serif text-3xl font-bold text-[#8F6B00]">{NATIONAL_STATS.preventedExposureEstimated.toLocaleString()}</div>
          <span className="text-[11px] text-[#777] font-mono">Via sub-hour early alerts</span>
        </div>

        <div className="bg-white border border-[#EBEBE6] rounded-xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Algorand Passports Sealed</span>
          <div className="font-serif text-3xl font-bold text-purple-700">{NATIONAL_STATS.blockchainVerifiedBatches.toLocaleString()}</div>
          <span className="text-[11px] text-purple-700 font-mono font-medium">100% On-Chain Verifiable</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Incident Prevention Trend */}
        <div className="lg:col-span-8 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
                Monthly Contamination Incidents vs Pre-Emptive Preventions
              </h3>
              <p className="text-xs text-[#777]">
                Tracking early-warning interventions across major Indian logistics corridors.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INCIDENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#777' }} />
                <YAxis tick={{ fontSize: 11, fill: '#777' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDDCD6',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="incidents" name="Detected Threats" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prevented" name="Pre-Emptively Mitigated" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Food Category Vulnerability Breakdown */}
        <div className="lg:col-span-4 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
              Risk by Food Category
            </h3>
            <p className="text-xs text-[#777]">
              Thermal sensitivity distribution.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#1A1A18]">{cat.name}</span>
                  <span className="font-mono text-[#666]">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
