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
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-[#78350F] border-amber-300';
      case 'Watch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white border-2 border-neutral-300 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header with Title & Prediction */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#854D0E] animate-pulse" />
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] font-bold">
              XGBOOST PREDICTIVE ENGINE & TREESHAP
            </span>
          </div>
          <h3 className="font-display font-black text-xl text-neutral-900 uppercase tracking-tight mt-1">
            Batch #{batchId} — {productName}
          </h3>
          <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 mt-0.5">
            <span>Model: <strong className="text-neutral-700">{modelVersion || 'FOODGUARD-XGBoost-Risk-v1.0-demo'}</strong></span>
            <span>•</span>
            <span>Pipeline: <strong className="text-neutral-700">{featureVersion || '15 Derived Features'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              AI PREDICTED RISK
            </div>
            <div className="text-xs font-mono font-bold text-neutral-600">
              Confidence: <span className="text-[#854D0E] font-black">{confidence}%</span>
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
          <div className="p-3 bg-[#FAF8F2] border border-amber-200 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">72h Escalation Probability</span>
            <span className="text-base font-black text-neutral-900 mt-0.5 block">{escalationProbability || 75}%</span>
            <span className="text-[9px] text-neutral-500">Risk expansion across network</span>
          </div>
          <div className="p-3 bg-[#FAF8F2] border border-amber-200 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Complaint Spike Risk</span>
            <span className="text-base font-black text-neutral-900 mt-0.5 block">{complaintSpikeProbability || 80}%</span>
            <span className="text-[9px] text-neutral-500">Retail consumer reports projected</span>
          </div>
          <div className="p-3 bg-[#FAF8F2] border border-amber-200 rounded-lg">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Verification Priority</span>
            <span className={`text-base font-black mt-0.5 block ${verificationPriority === 'CRITICAL' ? 'text-red-700' : 'text-[#854D0E]'}`}>
              {verificationPriority || 'CRITICAL'}
            </span>
            <span className="text-[9px] text-neutral-500">Field inspector protocol tier</span>
          </div>
        </div>
      )}

      {/* TreeSHAP Feature Explanations */}
      {shapExplanations && shapExplanations.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-[#854D0E]" />
              <span>TreeSHAP Feature Attribution (Local Explanations)</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              Shapley Value Additive Contributions
            </span>
          </div>

          <div className="space-y-2 bg-[#FAF8F2] border border-amber-200/80 rounded-xl p-4">
            {shapExplanations.map((shap, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-neutral-800">{shap.displayName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      shap.impactLevel === 'HIGH IMPACT'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-[#78350F] border border-amber-200'
                    }`}>
                      {shap.impactLevel}
                    </span>
                  </div>
                  <div className="font-bold shrink-0">
                    <span className={shap.shapValue > 0 ? 'text-red-700' : 'text-emerald-700'}>
                      {shap.shapValue > 0 ? `+${shap.shapValue}` : shap.shapValue} pts
                    </span>
                    <span className="text-neutral-500 text-[10px] ml-1.5">({shap.percentageContribution}%)</span>
                  </div>
                </div>

                {/* Progress bar visual for SHAP contribution */}
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
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
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[#854D0E]" />
            <span>Why Flagged (Causal Determinants)</span>
          </div>
          <div className="bg-[#FAF8F2] border border-amber-200/80 rounded-lg p-3.5 space-y-2 text-xs text-neutral-800 font-mono">
            {whyFlagged.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#854D0E] font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objective Evidence Signals */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-600" />
            <span>Monitored Input Signals (Raw Evidence)</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-normal">7-Column Input Signals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">Temperature</span>
            <span className={`text-sm font-black ${evidence.temperatureC > 4.0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {evidence.temperatureC.toFixed(1)}°C
            </span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">Transit Time</span>
            <span className={`text-sm font-black ${evidence.transportHours > 12 ? 'text-orange-600' : 'text-neutral-800'}`}>
              {evidence.transportHours} Hours
            </span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">Lab Status</span>
            <span className={`text-sm font-black ${evidence.labStatus === 'Fail' ? 'text-red-600' : evidence.labStatus === 'Borderline' ? 'text-amber-700' : 'text-emerald-700'}`}>
              {evidence.labStatus}
            </span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">Complaints</span>
            <span className={`text-sm font-black ${evidence.complaintCount > 0 ? 'text-red-600' : 'text-neutral-800'}`}>
              {evidence.complaintCount} Reports
            </span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-2.5 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">Storage</span>
            <span className="text-xs font-black text-neutral-800 truncate block" title={evidence.storageCondition}>
              {evidence.storageCondition}
            </span>
          </div>
        </div>
      </div>

      {/* 15 Engineered Features Accordion */}
      {engineeredFeatures && (
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowEngineeredFeatures(!showEngineeredFeatures)}
            className="w-full bg-[#FAF8F2] p-3 flex items-center justify-between text-xs font-mono font-bold text-neutral-800 hover:bg-amber-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#854D0E]" />
              <span>15 ENGINEERED ML FEATURES & INTERACTION TERMS ({showEngineeredFeatures ? 'HIDE' : 'SHOW'})</span>
            </span>
            {showEngineeredFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showEngineeredFeatures && (
            <div className="p-3 bg-white grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] border-t border-neutral-200">
              {Object.entries(engineeredFeatures).map(([k, v]) => (
                <div key={k} className="p-1.5 bg-[#FAF8F2] rounded border border-neutral-100 flex justify-between">
                  <span className="text-neutral-500 truncate" title={k}>{k}:</span>
                  <strong className="text-neutral-900 font-bold ml-1">{v}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Action & Verification Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-lg p-4 space-y-1.5">
          <span className="text-[10px] font-mono text-[#78350F] uppercase font-bold tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#854D0E]" />
            <span>Recommended Action</span>
          </span>
          <p className="text-xs text-[#78350F] font-bold font-mono leading-relaxed">
            {recommendedAction}
          </p>
        </div>

        <div className="bg-[#FAF8F2] border border-neutral-300 rounded-lg p-4 space-y-1.5">
          <span className="text-[10px] font-mono text-neutral-700 uppercase font-bold tracking-widest flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-neutral-600" />
            <span>Physical / Lab Verification Required</span>
          </span>
          <p className="text-xs text-neutral-800 font-mono leading-relaxed">
            {verificationRequired}
          </p>
        </div>
      </div>

      {/* AI Limitation & Core Motto */}
      <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px]">
          <Info className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>
            <strong className="text-neutral-700">Model Limitation:</strong> {aiLimitation}
          </span>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-widest font-black text-[#78350F] bg-[#FEF3C7] px-3 py-1 rounded border border-[#FDE68A] shrink-0">
          AI PREDICTS. EVIDENCE EXPLAINS. LAB VERIFIES. HUMAN DECIDES.
        </div>
      </div>

      {/* Action Buttons */}
      {(onOpenReport || onOpenFeedback) && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="text-xs font-mono font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Submit Actual Lab Feedback
            </button>
          )}
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="text-xs font-mono font-bold text-white bg-[#854D0E] hover:bg-[#A16207] px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Generate Investigation Report
            </button>
          )}
        </div>
      )}
    </div>
  );
};
