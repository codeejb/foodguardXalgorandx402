import React, { useState } from 'react';
import {
  Dna,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  FileCheck,
  CheckCircle2,
  Lock,
  Thermometer,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { INITIAL_BATCHES } from '../../data/mockData';
import { FoodBatch } from '../../types';

interface FoodDnaViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const FoodDnaView: React.FC<FoodDnaViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('M492');
  const batch = INITIAL_BATCHES.find((b) => b.id === selectedBatchId) || INITIAL_BATCHES[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'WATCH':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'QUARANTINED':
      case 'RECALLED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>DIGITAL PASSPORT: /food-dna</span>
            <span>•</span>
            <span className="text-[#1A1A18]">CRYPTOGRAPHIC SUPPLY LOG</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Food DNA Digital Passport
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            End-to-end provenance, multi-sensor telemetric audit trails, and Algorand smart contract verification.
          </p>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          {INITIAL_BATCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBatchId(b.id)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedBatchId === b.id
                  ? 'bg-[#1A1A18] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F0F0EB] text-[#444] border border-[#DDDCD6]'
              }`}
            >
              #{b.id} ({b.category})
            </button>
          ))}
        </div>
      </div>

      {/* Main Passport Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Passport Summary */}
        <div className="lg:col-span-4 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-bold block">
                ALGORAND PASSPORT #ALGO-DNA-{batch.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                {batch.productName}
              </h2>
              <span className="text-xs text-[#777] font-mono">
                Batch ID: #{batch.id} • Vol: {batch.batchVolume}
              </span>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getStatusColor(batch.status)}`}>
              {batch.status}
            </span>
          </div>

          {/* Core Properties */}
          <div className="space-y-3 text-xs border-t border-b border-[#F0F0EB] py-4">
            <div className="flex justify-between">
              <span className="text-[#777]">Manufacturer:</span>
              <span className="font-semibold text-[#1A1A18]">{batch.factoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777]">Source Origin:</span>
              <span className="font-semibold text-[#1A1A18]">{batch.sourceOrigin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777]">Current Location:</span>
              <span className="font-semibold text-[#1A1A18]">{batch.warehouseLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777]">NABL Lab Assay:</span>
              <span className="font-mono text-emerald-700 font-semibold">{batch.labReportId || 'Verified'}</span>
            </div>
          </div>

          {/* Risk & Safety Scores */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#555]">Real-time Safety Index</span>
              <span className="text-xs font-mono font-bold text-[#1A1A18]">{batch.safetyScore} / 100</span>
            </div>
            <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  batch.safetyScore > 70 ? 'bg-emerald-600' : batch.safetyScore > 40 ? 'bg-amber-600' : 'bg-red-600'
                }`}
                style={{ width: `${batch.safetyScore}%` }}
              />
            </div>
          </div>

          {/* Quick Simulation CTA */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-lg p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#888] uppercase block">PREDICTIVE ACTION</span>
            <p className="text-xs text-[#555] leading-relaxed">
              Explore 72-hour bacterial degradation trajectory for Batch #{batch.id}.
            </p>
            <button
              onClick={() => onNavigate('forecast')}
              className="text-xs font-semibold text-[#8F6B00] hover:text-[#725500] flex items-center gap-1 cursor-pointer"
            >
              <span>Launch 72h Degradation Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blockchain Seal */}
          <div className="p-3.5 rounded-lg bg-[#FDF9EE] border border-[#EEDBB3] space-y-1.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8F6B00]" />
              <span className="text-xs font-mono font-bold text-[#8F6B00]">ALGORAND SMART CONTRACT</span>
            </div>
            <p className="font-mono text-[10px] text-[#735700] break-all">
              {batch.blockchainTx}
            </p>
          </div>
        </div>

        {/* Right Col: Provenance Timeline & Temperature Journey */}
        <div className="lg:col-span-8 space-y-6">
          {/* Temperature & Humidity Telemetry */}
          <div className="bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
                  Continuous Cold-Chain Telemetry
                </h3>
                <p className="text-xs text-[#777]">
                  Ambient temperature recorded at 15-minute intervals across all custody transfers.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200">
                Peak: {batch.temperatureMax}°C (Limit: 4.0°C)
              </span>
            </div>

            {/* Journey steps */}
            <div className="space-y-3 pt-2">
              {batch.journey.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8F6B00]">{step.stage}</span>
                      <span className="text-[#777]">•</span>
                      <span className="font-semibold text-[#1A1A18]">{step.actor}</span>
                    </div>
                    <p className="text-[#666]">{step.location} • {step.notes}</p>
                  </div>

                  <div className="flex items-center gap-3 font-mono shrink-0">
                    <span className={step.temperature > 6 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {step.temperature}°C
                    </span>
                    <span className="text-[#888]">{step.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
