import React, { useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Filter,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Thermometer,
  Layers
} from 'lucide-react';
import { INITIAL_ANOMALIES } from '../../data/mockData';
import { AnomalyRecord } from '../../types';

interface AnomaliesViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>(INITIAL_ANOMALIES[0].id);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filteredAnomalies = INITIAL_ANOMALIES.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const selectedAnomaly = INITIAL_ANOMALIES.find((a) => a.id === selectedAnomalyId) || INITIAL_ANOMALIES[0];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>UNSUPERVISED DISCOVERY: /anomalies</span>
            <span>•</span>
            <span className="text-[#1A1A18]">SYNCHRONIZED DRIFT DETECTOR</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Unknown Risk Detector
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Autonomous multi-sensor pattern discovery that uncovers novel contamination vectors before statutory threshold alerts.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-[#1A1A18] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#F0F0EB] text-[#555] border border-[#DDDCD6]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Anomaly Stream & Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Anomaly Stream */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1A1A18] mb-2">
            Detected Anomaly Streams ({filteredAnomalies.length})
          </h3>

          {filteredAnomalies.map((anom) => {
            const isSelected = anom.id === selectedAnomalyId;
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomalyId(anom.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/10'
                    : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#8F6B00]">
                    #{anom.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(anom.severity)}`}>
                    {anom.severity} (CONFIDENCE {anom.confidence}%)
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1A1A18]">
                  {anom.title}
                </h4>
                <p className="text-xs text-[#666] line-clamp-2 mt-1 leading-relaxed">
                  {anom.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#777] pt-2 mt-2 border-t border-[#F0F0EB]">
                  <span>Entity: {anom.relatedEntity}</span>
                  <span className="text-[#8F6B00] font-semibold">Inspect Telemetry →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Deep Anomaly Detail */}
        <div className="lg:col-span-7 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                ANOMALY EVENT #{selectedAnomaly.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                {selectedAnomaly.title}
              </h2>
              <p className="text-xs text-[#777] font-sans">
                Detected: {selectedAnomaly.detectedAt} • Target Entity: {selectedAnomaly.relatedEntity}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${getSeverityBadge(selectedAnomaly.severity)}`}>
              {selectedAnomaly.severity} SEVERITY
            </span>
          </div>

          {/* AI Explanation Box */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>AI ANOMALY INTERPRETATION</span>
            </span>
            <p className="text-xs text-[#333] leading-relaxed">
              {selectedAnomaly.description}
            </p>
          </div>

          {/* Root Cause Hypothesis / Action */}
          <div className="bg-white p-4 rounded-xl border border-[#EBEBE6] space-y-1.5">
            <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-semibold block">
              CORROBORATED SUGGESTED ACTION
            </span>
            <p className="text-xs text-[#222] font-medium leading-relaxed">
              {selectedAnomaly.suggestedAction}
            </p>
          </div>

          {/* Action Directive */}
          <div className="bg-[#FDF9EE] border border-[#EEDBB3] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-bold block">
                SUGGESTED REGULATORY ACTION
              </span>
              <p className="text-xs text-[#735700] font-medium">
                Dispatch field officer and issue pre-emptive batch freeze on related consignments.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inspections')}
              className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Dispatch Officer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
