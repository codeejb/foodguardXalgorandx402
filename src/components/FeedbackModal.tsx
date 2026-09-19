import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { selectedBatch, predictions, addFeedback, feedbackList } = useDataset();
  const batch = selectedBatch || predictions[0];

  const [actualResult, setActualResult] = useState<string>('Contamination Confirmed in Lab');
  const [predictionCorrect, setPredictionCorrect] = useState<boolean>(true);
  const [labResult, setLabResult] = useState<string>('E. coli count > 10^4 CFU/g via NABL culture assay');
  const [actionTaken, setActionTaken] = useState<string>('Inventory quarantined; Form VA seizure executed');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !batch) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      batchId: batch.batchId,
      predictedRisk: batch.predictedRiskScore,
      actualResult,
      predictionCorrect,
      labResult,
      actionTaken
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F12]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#18181C] border-2 border-[#3A3A42] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#18181C] px-6 py-4 border-b border-[#2A2A30] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                MODEL CALIBRATION & EVALUATION
              </span>
            </div>
            <h2 className="font-display font-black text-lg text-gray-100 uppercase tracking-tight mt-0.5">
              Submit Field & Lab Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 p-2 rounded-lg hover:bg-[#252529] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-lg text-gray-100 uppercase">
              Feedback Successfully Logged
            </h3>
            <p className="text-xs font-mono text-gray-400 max-w-md mx-auto">
              Verification telemetry recorded to the audit ledger. Data will be incorporated into the offline model calibration and validation benchmarks.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Context Summary */}
            <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-4 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[10px] font-bold uppercase">Evaluating Batch</span>
                <span className="font-black text-gray-100 text-sm">#{batch.batchId} ({batch.productName})</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">AI Prediction</span>
                <span className="font-black text-gray-100 text-sm">{batch.predictedRiskScore}/100 ({batch.riskLevel})</span>
              </div>
            </div>

            {/* Field: Prediction Correct? */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider block">
                Did the AI prediction align with real-world inspection findings?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPredictionCorrect(true)}
                  className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    predictionCorrect
                      ? 'bg-emerald-900/20 border-emerald-400 text-emerald-400 shadow-lg shadow-black/30'
                      : 'bg-[#18181C] border-[#3A3A42] text-gray-400 hover:bg-[#1F1F24]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Yes, Aligned</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPredictionCorrect(false)}
                  className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    !predictionCorrect
                      ? 'bg-red-900/20 border-red-400 text-red-400 shadow-lg shadow-black/30'
                      : 'bg-[#18181C] border-[#3A3A42] text-gray-400 hover:bg-[#1F1F24]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>No, Discrepancy</span>
                </button>
              </div>
            </div>

            {/* Field: Actual Result */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider block">
                Actual Field / Inspection Result
              </label>
              <input
                type="text"
                value={actualResult}
                onChange={(e) => setActualResult(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-[#3A3A42] bg-[#18181C] focus:border-amber-600 focus:outline-hidden"
              />
            </div>

            {/* Field: Laboratory Assays Result */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider block">
                Official Laboratory Findings (Assay / Culture)
              </label>
              <input
                type="text"
                value={labResult}
                onChange={(e) => setLabResult(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-[#3A3A42] bg-[#18181C] focus:border-amber-600 focus:outline-hidden"
              />
            </div>

            {/* Field: Action Taken */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider block">
                Regulatory Action Taken
              </label>
              <input
                type="text"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-[#3A3A42] bg-[#18181C] focus:border-amber-600 focus:outline-hidden"
              />
            </div>

            {/* Disclaimer & Policy */}
            <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-3 flex items-start gap-2.5 text-[11px] font-mono text-gray-400">
              <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <strong>Model Retraining Governance:</strong> Automatic retraining is strictly prevented in production to protect against adversarial feedback drift. All submitted evaluations are archived for supervised NABL validation batches.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-mono font-bold text-gray-400 hover:text-gray-100 px-4 py-2 border border-[#3A3A42] rounded-lg hover:bg-[#1F1F24] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs font-mono font-bold text-white bg-amber-500 hover:bg-amber-400 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-black/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Evaluation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
