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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-neutral-300 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#854D0E]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#854D0E] font-bold">
                MODEL CALIBRATION & EVALUATION
              </span>
            </div>
            <h2 className="font-display font-black text-lg text-neutral-900 uppercase tracking-tight mt-0.5">
              Submit Field & Lab Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-lg text-neutral-900 uppercase">
              Feedback Successfully Logged
            </h3>
            <p className="text-xs font-mono text-neutral-600 max-w-md mx-auto">
              Verification telemetry recorded to the audit ledger. Data will be incorporated into the offline model calibration and validation benchmarks.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Context Summary */}
            <div className="bg-[#FAF8F2] border border-neutral-200 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[10px] font-bold uppercase">Evaluating Batch</span>
                <span className="font-black text-neutral-900 text-sm">#{batch.batchId} ({batch.productName})</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 block text-[10px] font-bold uppercase">AI Prediction</span>
                <span className="font-black text-neutral-900 text-sm">{batch.predictedRiskScore}/100 ({batch.riskLevel})</span>
              </div>
            </div>

            {/* Field: Prediction Correct? */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider block">
                Did the AI prediction align with real-world inspection findings?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPredictionCorrect(true)}
                  className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    predictionCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs'
                      : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
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
                      ? 'bg-red-50 border-red-400 text-red-800 shadow-2xs'
                      : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>No, Discrepancy</span>
                </button>
              </div>
            </div>

            {/* Field: Actual Result */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider block">
                Actual Field / Inspection Result
              </label>
              <input
                type="text"
                value={actualResult}
                onChange={(e) => setActualResult(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:border-[#854D0E] focus:outline-hidden"
              />
            </div>

            {/* Field: Laboratory Assays Result */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider block">
                Official Laboratory Findings (Assay / Culture)
              </label>
              <input
                type="text"
                value={labResult}
                onChange={(e) => setLabResult(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:border-[#854D0E] focus:outline-hidden"
              />
            </div>

            {/* Field: Action Taken */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider block">
                Regulatory Action Taken
              </label>
              <input
                type="text"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:border-[#854D0E] focus:outline-hidden"
              />
            </div>

            {/* Disclaimer & Policy */}
            <div className="bg-[#FAF8F2] border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] font-mono text-neutral-600">
              <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong>Model Retraining Governance:</strong> Automatic retraining is strictly prevented in production to protect against adversarial feedback drift. All submitted evaluations are archived for supervised NABL validation batches.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs font-mono font-bold text-white bg-[#854D0E] hover:bg-[#A16207] px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
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
