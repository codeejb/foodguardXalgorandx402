import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Cpu,
  Info,
  Layers,
  Thermometer,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { BatchPrediction } from '../types';

interface AITrustPanelProps {
  prediction: BatchPrediction;
  onOpenReport?: () => void;
  onOpenFeedback?: () => void;
}

export const AITrustPanel: React.FC<AITrustPanelProps> = ({
  prediction,
  onOpenReport,
  onOpenFeedback
}) => {
  const [showEngineeredFeatures, setShowEngineeredFeatures] = useState<boolean>(false);
  const {
    batchId,
    productName,
    predictedRiskScore,
    riskLevel,
    confidence,
    whyFlagged,
    evidence,
    recommendedAction,
    verificationRequired,
    aiLimitation,
    shapExplanations,
    engineeredFeatures,
    modelVersion,
    featureVersion,
    escalationProbability,
    complaintSpikeProbability,
    verificationPriority
  } = prediction;

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-400 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate':
        return 'bg-amber-900/30 text-amber-400 border-amber-600/50';
      case 'Watch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-600';
    }
  };

  return (
    <div className="bg-[#18181C] border-2 border-[#3A3A42] rounded-xl p-6 shadow-md shadow-black/30 space-y-6">
      {/* Header with Title & Prediction */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A30]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">
              XGBOOST PREDICTIVE ENGINE & TREESHAP
            </span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-100 uppercase tracking-tight mt-1">
            Batch #{batchId} — {productName}
          </h3>
          <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500 mt-0.5">
            <span>Model: <strong className="text-gray-300">{modelVersion || 'FOODGUARD-XGBoost-Risk-v1.0-demo'}</strong></span>
            <span>•</span>
            <span>Pipeline: <strong className="text-gray-300">{featureVersion || '15 Derived Features'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
              AI PREDICTED RISK
            </div>
            <div className="text-xs font-mono font-bold text-gray-400">
              Confidence: <span className="text-amber-400 font-black">{confidence}%</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border font-mono flex flex-col items-center justify-center min-w-[72px] ${getRiskBadgeColor(riskLevel)}`}>
            <span className="text-2xl font-black leading-none">{predictedRiskScore}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Multi-Task Predictive Projections */}
      {(escalationProbability !== undefined || complaintSpikeProbability !== undefined) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#18181C] border border-amber-800/40 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">72h Escalation Probability</span>
            <span className="text-base font-black text-gray-100 mt-0.5 block">{escalationProbability || 75}%</span>
            <span className="text-[9px] text-gray-500">Risk expansion across network</span>
          </div>
          <div className="p-3 bg-[#18181C] border border-amber-800/40 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Complaint Spike Risk</span>
            <span className="text-base font-black text-gray-100 mt-0.5 block">{complaintSpikeProbability || 80}%</span>
            <span className="text-[9px] text-gray-500">Retail consumer reports projected</span>
          </div>
          <div className="p-3 bg-[#18181C] border border-amber-800/40 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Verification Priority</span>
            <span className={`text-base font-black mt-0.5 block ${verificationPriority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
              {verificationPriority || 'CRITICAL'}
            </span>
            <span className="text-[9px] text-gray-500">Field inspector protocol tier</span>
          </div>
        </div>
      )}

      {/* TreeSHAP Feature Explanations */}
      {shapExplanations && shapExplanations.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-100 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>TreeSHAP Feature Attribution (Local Explanations)</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">
              Shapley Value Additive Contributions
            </span>
          </div>

          <div className="space-y-2 bg-[#18181C] border border-amber-800/40/80 rounded-xl p-4">
            {shapExplanations.map((shap, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-gray-200">{shap.displayName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      shap.impactLevel === 'HIGH IMPACT'
                        ? 'bg-red-100 text-red-400 border border-red-800/40'
                        : 'bg-amber-900/30 text-amber-400 border border-amber-800/40'
                    }`}>
                      {shap.impactLevel}
                    </span>
                  </div>
                  <div className="font-bold shrink-0">
                    <span className={shap.shapValue > 0 ? 'text-red-400' : 'text-emerald-400'}>
                      {shap.shapValue > 0 ? `+${shap.shapValue}` : shap.shapValue} pts
                    </span>
                    <span className="text-gray-500 text-[10px] ml-1.5">({shap.percentageContribution}%)</span>
                  </div>
                </div>

                {/* Progress bar visual for SHAP contribution */}
                <div className="w-full h-1.5 bg-[#2A2A30] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${shap.shapValue > 0 ? 'bg-red-600' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, shap.percentageContribution * 2.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fallback Why Flagged */
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-100 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Why Flagged (Causal Determinants)</span>
          </div>
          <div className="bg-[#18181C] border border-amber-800/40/80 rounded-lg p-3.5 space-y-2 text-xs text-gray-200 font-mono">
            {whyFlagged.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objective Evidence Signals */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-gray-100 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span>Monitored Input Signals (Raw Evidence)</span>
          </span>
          <span className="text-[10px] text-gray-500 font-normal">7-Column Input Signals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-bold">Temperature</span>
            <span className={`text-sm font-black ${evidence.temperatureC > 4.0 ? 'text-red-600' : 'text-emerald-400'}`}>
              {evidence.temperatureC.toFixed(1)}°C
            </span>
          </div>
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-bold">Transit Time</span>
            <span className={`text-sm font-black ${evidence.transportHours > 12 ? 'text-orange-600' : 'text-gray-200'}`}>
              {evidence.transportHours} Hours
            </span>
          </div>
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-bold">Lab Status</span>
            <span className={`text-sm font-black ${evidence.labStatus === 'Fail' ? 'text-red-600' : evidence.labStatus === 'Borderline' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {evidence.labStatus}
            </span>
          </div>
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-bold">Complaints</span>
            <span className={`text-sm font-black ${evidence.complaintCount > 0 ? 'text-red-600' : 'text-gray-200'}`}>
              {evidence.complaintCount} Reports
            </span>
          </div>
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-lg p-2.5 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-bold">Storage</span>
            <span className="text-xs font-black text-gray-200 truncate block" title={evidence.storageCondition}>
              {evidence.storageCondition}
            </span>
          </div>
        </div>
      </div>

      {/* 15 Engineered Features Accordion */}
      {engineeredFeatures && (
        <div className="border border-[#2A2A30] rounded-lg overflow-hidden">
          <button
            onClick={() => setShowEngineeredFeatures(!showEngineeredFeatures)}
            className="w-full bg-[#18181C] p-3 flex items-center justify-between text-xs font-mono font-bold text-gray-200 hover:bg-amber-900/20 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>15 ENGINEERED ML FEATURES & INTERACTION TERMS ({showEngineeredFeatures ? 'HIDE' : 'SHOW'})</span>
            </span>
            {showEngineeredFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showEngineeredFeatures && (
            <div className="p-3 bg-[#18181C] grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] border-t border-[#2A2A30]">
              {Object.entries(engineeredFeatures).map(([k, v]) => (
                <div key={k} className="p-1.5 bg-[#18181C] rounded border border-[#2A2A30] flex justify-between">
                  <span className="text-gray-500 truncate" title={k}>{k}:</span>
                  <strong className="text-gray-100 font-bold ml-1">{v}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Action & Verification Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-900/20/60 border border-amber-500/30 rounded-lg p-4 space-y-1.5">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Recommended Action</span>
          </span>
          <p className="text-xs text-amber-400 font-bold font-mono leading-relaxed">
            {recommendedAction}
          </p>
        </div>

        <div className="bg-[#18181C] border border-[#3A3A42] rounded-lg p-4 space-y-1.5">
          <span className="text-[10px] font-mono text-gray-300 uppercase font-bold tracking-widest flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-gray-400" />
            <span>Physical / Lab Verification Required</span>
          </span>
          <p className="text-xs text-gray-200 font-mono leading-relaxed">
            {verificationRequired}
          </p>
        </div>
      </div>

      {/* AI Limitation & Core Motto */}
      <div className="pt-2 border-t border-[#2A2A30] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px]">
          <Info className="w-4 h-4 text-gray-500 shrink-0" />
          <span>
            <strong className="text-gray-300">Model Limitation:</strong> {aiLimitation}
          </span>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-900/20 px-3 py-1 rounded border border-amber-500/30 shrink-0">
          AI PREDICTS. EVIDENCE EXPLAINS. LAB VERIFIES. HUMAN DECIDES.
        </div>
      </div>

      {/* Action Buttons */}
      {(onOpenReport || onOpenFeedback) && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="text-xs font-mono font-bold text-gray-300 hover:text-gray-100 border border-[#3A3A42] hover:bg-[#1F1F24] px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Submit Actual Lab Feedback
            </button>
          )}
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="text-xs font-mono font-bold text-white bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-black/20"
            >
              Generate Investigation Report
            </button>
          )}
        </div>
      )}
    </div>
  );
};
