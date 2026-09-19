import React from 'react';
import {
  X,
  Printer,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  Layers,
  Thermometer,
  Clock,
  Cpu,
  Download
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { metadata, selectedBatch, predictions, anomalies, simulateSpread } = useDataset();

  if (!isOpen) return null;

  const batch = selectedBatch || predictions[0];
  if (!batch) return null;

  const spread = simulateSpread(batch.batchId);
  const relatedAnomalies = anomalies.filter((a) => a.relatedBatches.includes(batch.batchId));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F12]/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-[#18181C]">
      <div className="bg-[#18181C] border-2 border-[#3A3A42] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:my-0 print:max-w-none">
        {/* Header Bar */}
        <div className="bg-[#18181C] px-6 py-4 border-b border-[#2A2A30] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-mono font-bold text-gray-200 uppercase tracking-widest">
              OFFICIAL INVESTIGATION REPORT — FOODGUARD X
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs font-mono font-bold text-white bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-[#252529] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-8 space-y-6 text-gray-100 font-sans print:p-8">
          {/* Document Masthead */}
          <div className="border-b-2 border-neutral-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-black">
                NATIONAL FOOD SAFETY FORENSIC INTELLIGENCE DOSSIER
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
                Food Safety Incident Investigation Report
              </h1>
              <div className="text-xs font-mono text-gray-500 mt-1">
                Dataset: #{metadata?.datasetId} • Dossier Ref: INV-DOSSIER-{batch.batchId} • Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-[10px] uppercase text-gray-500 font-bold">Predicted Risk Status</div>
              <div className={`text-xl font-black ${batch.predictedRiskScore >= 61 ? 'text-red-600' : 'text-amber-600'}`}>
                {batch.predictedRiskScore}/100 ({batch.riskLevel.toUpperCase()})
              </div>
              <div className="text-[10px] text-gray-500">AI Confidence: {batch.confidence}%</div>
            </div>
          </div>

          {/* Section 1: Incident Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 pb-1 border-b border-[#2A2A30]">
              1. Incident Summary
            </h2>
            <p className="text-xs text-gray-200 leading-relaxed font-mono">
              Preliminary epidemiological lead initiated based on continuous cold-chain sensor stream and citizen complaint telemetry.
              Consignment batch #{batch.batchId} ({batch.productName}) was flagged by unsupervised drift detectors due to thermal elevation,
              lab status markers, and associated consumer sensory complaints.
            </p>
          </div>

          {/* Section 2: Batch Information & Monitored Evidence */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 pb-1 border-b border-[#2A2A30]">
              2. Batch Information & Monitored Evidence
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Batch ID</span>
                <span className="font-black text-sm text-gray-100">{batch.batchId}</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Product Name</span>
                <span className="font-black text-sm text-gray-100 truncate block">{batch.productName}</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Storage Temp</span>
                <span className="font-black text-sm text-red-600">{batch.evidence.temperatureC}°C</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Transit Hours</span>
                <span className="font-black text-sm text-gray-100">{batch.evidence.transportHours} Hours</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Lab Status</span>
                <span className="font-black text-sm text-gray-100">{batch.evidence.labStatus}</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30]">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Complaints</span>
                <span className="font-black text-sm text-red-600">{batch.evidence.complaintCount} Reports</span>
              </div>
              <div className="bg-[#18181C] p-3 rounded-lg border border-[#2A2A30] col-span-2">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Storage Condition</span>
                <span className="font-black text-sm text-gray-100">{batch.evidence.storageCondition}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Why Flagged & Causal Determinants */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 pb-1 border-b border-[#2A2A30]">
              3. Causal Determinants & Why Flagged
            </h2>
            <div className="bg-[#18181C] border border-amber-800/40 rounded-lg p-3.5 space-y-1.5 text-xs font-mono text-gray-200">
              {batch.whyFlagged.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-black">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Supply-Chain Connections & Potential Spread */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 pb-1 border-b border-[#2A2A30]">
              4. Supply-Chain Connections & Potential Spread
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="border border-[#2A2A30] rounded-lg p-3 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Connected Distribution Nodes</span>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {spread.connectedLocations.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-[#2A2A30] rounded-lg p-3 space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Potentially Affected Network</span>
                  <span className="font-black text-gray-100">{spread.potentiallyAffectedNetwork}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Recommended Containment Point</span>
                  <span className="text-gray-200 font-bold">{spread.recommendedContainmentPoint}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Regulatory Actions & Required Verifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 pb-1 border-b border-[#2A2A30]">
              5. Statutory Recommendations & Verification Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg text-amber-400">
                <strong className="block text-[10px] uppercase tracking-wider font-black mb-1">Recommended Action:</strong>
                {batch.recommendedAction}
              </div>
              <div className="bg-[#18181C] border border-[#3A3A42] p-3 rounded-lg text-gray-200">
                <strong className="block text-[10px] uppercase tracking-wider font-black mb-1">Physical / Lab Verification:</strong>
                {batch.verificationRequired}
              </div>
            </div>
          </div>

          {/* Section 6: AI Limitations & Statutory Disclaimer */}
          <div className="border-t-2 border-neutral-800 pt-4 space-y-2 text-xs font-mono text-gray-400">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <strong>AI Limitation & Statutory Disclaimer:</strong> {batch.aiLimitation} This report represents a mathematical model estimate based on ingested telemetry and complaint correlations. It does NOT constitute legal proof of contamination or guilt without NABL accredited laboratory assays and formal human inspection.
              </div>
            </div>

            <div className="text-center pt-4 font-mono font-black text-xs text-amber-400 tracking-widest uppercase">
              AI PREDICTS. EVIDENCE EXPLAINS. LAB VERIFIES. HUMAN DECIDES.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
