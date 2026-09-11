import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { REQUIRED_COLUMNS, downloadSampleExcelFile, downloadSampleCsvFile } from '../services/dataIntelligenceEngine';
import { DataQualityReport } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { parseAndUploadFile, loadDemoData, isProcessing, processingStep } = useDataset();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [qualityPreview, setQualityPreview] = useState<DataQualityReport | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState<number>(0);
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ANALYSIS_STEPS = [
    'Reading Spreadsheet Data...',
    'Validating Required 7-Column Schema...',
    'Checking Quality & Integrity Constraints...',
    'Running Cold-Chain Kinetic Risk Engine...',
    'Detecting Unsupervised Drift & Anomalies...',
    'Synthesizing Supply-Chain Intelligence...',
    'Generating 72-Hour Predictions...',
    'Initializing Command Center...'
  ];

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    // Preliminary check
    const res = await parseAndUploadFile(file);
    setQualityPreview(res.report);
  };

  const handleProceedWithUpload = async () => {
    if (!selectedFile) return;
    setIsSimulatingAnalysis(true);

    // Multi-step loading experience
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalyzingStage(i);
      await new Promise((r) => setTimeout(r, 260));
    }

    setIsSimulatingAnalysis(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleUseDemo = async () => {
    setIsSimulatingAnalysis(true);
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalyzingStage(i);
      await new Promise((r) => setTimeout(r, 200));
    }
    await loadDemoData();
    setIsSimulatingAnalysis(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-neutral-300 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#FAF8F2] px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#854D0E]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#854D0E] font-bold">
                DATA INGESTION & PIPELINE
              </span>
            </div>
            <h2 className="font-display font-black text-xl text-neutral-900 uppercase tracking-tight mt-0.5">
              Load Dataset into FOODGUARD X
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isSimulatingAnalysis ? (
            /* Multi-step loading experience */
            <div className="py-12 px-6 text-center space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#854D0E] animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-neutral-900 uppercase">
                  {ANALYSIS_STEPS[analyzingStage]}
                </h3>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Step {analyzingStage + 1} of {ANALYSIS_STEPS.length} • Running verification pipeline
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md mx-auto bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#854D0E] h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${((analyzingStage + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="text-[11px] font-mono text-neutral-600 max-w-sm mx-auto">
                Validating 7-column schema, computing thermal kinetics, and evaluating predictive confidence.
              </div>
            </div>
          ) : qualityPreview ? (
            /* Data Quality Screen */
            <div className="space-y-6">
              <div className="bg-[#FAF8F2] border border-neutral-200 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#854D0E]" />
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {selectedFile?.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-300 text-neutral-700">
                    Confidence: {Math.round((qualityPreview.confidenceModifier || 1) * 100)}%
                  </span>
                </div>

                {/* Quality Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 pt-3 text-center">
                  <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Total Rows</span>
                    <span className="font-mono text-base font-black text-neutral-900">{qualityPreview.totalRecords}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Valid Batches</span>
                    <span className="font-mono text-base font-black text-emerald-700">{qualityPreview.validRecords}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Warnings</span>
                    <span className="font-mono text-base font-black text-amber-700">{qualityPreview.warningsCount}</span>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Errors</span>
                    <span className="font-mono text-base font-black text-red-600">{qualityPreview.errorsCount}</span>
                  </div>
                </div>
              </div>

              {/* Warning/Error Logs if any */}
              {qualityPreview.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs font-mono space-y-1.5 text-red-800">
                  <div className="font-bold flex items-center gap-1.5 text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Errors Requiring Attention:</span>
                  </div>
                  {qualityPreview.errors.map((err, i) => (
                    <div key={i} className="pl-5">• {err}</div>
                  ))}
                </div>
              )}

              {qualityPreview.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-mono space-y-1.5 text-amber-800 max-h-32 overflow-y-auto">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>Data Quality Warnings (Auto-corrected with reduced confidence):</span>
                  </div>
                  {qualityPreview.warnings.map((w, i) => (
                    <div key={i} className="pl-5">• {w}</div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setQualityPreview(null);
                    setSelectedFile(null);
                  }}
                  className="text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Choose Different File
                </button>

                <button
                  onClick={handleProceedWithUpload}
                  disabled={qualityPreview.validRecords === 0}
                  className={`text-xs font-mono font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs ${
                    qualityPreview.validRecords > 0
                      ? 'bg-[#854D0E] hover:bg-[#A16207] text-white'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to AI Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Options */
            <div className="space-y-6">
              {/* Option 1: File Upload Box */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#854D0E] bg-[#FEF3C7]/40'
                    : 'border-neutral-300 hover:border-[#854D0E] bg-[#FAF8F2] hover:bg-amber-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="inline-flex p-4 rounded-2xl bg-white border border-neutral-200 text-[#854D0E] mb-4 shadow-2xs">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-base text-neutral-900 uppercase">
                  Click to Upload or Drag & Drop File
                </h3>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Supports Excel (.xlsx, .xls) and CSV (.csv) format
                </p>

                {/* 7 Columns Checklist */}
                <div className="mt-6 pt-4 border-t border-neutral-200/80 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                    Exact 7 Columns Required:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {REQUIRED_COLUMNS.map((col) => (
                      <span
                        key={col}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-300 text-neutral-700 font-bold"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Template Downloads */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-mono text-neutral-600">
                  Need the exact schema template?
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSampleExcelFile();
                    }}
                    className="text-xs font-mono font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#854D0E]" />
                    <span>Sample Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSampleCsvFile();
                    }}
                    className="text-xs font-mono font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#854D0E]" />
                    <span>Sample CSV</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Use Demo Data */}
              <div className="bg-[#FAF8F2] border-2 border-amber-300/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#854D0E]" />
                    <span className="font-display font-black text-sm text-neutral-900 uppercase">
                      Or Explore With Demo Data
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-600 mt-1 max-w-md">
                    Instantly load a realistic synthetic 12-batch dataset featuring temperature excursions, silent lab failures, high complaints, and supply-chain anomalies.
                  </p>
                  <span className="inline-block text-[9px] font-mono text-amber-800 font-bold bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A] mt-2">
                    DEMO MODE — Synthetic Data
                  </span>
                </div>

                <button
                  onClick={handleUseDemo}
                  className="text-xs font-mono font-bold text-neutral-900 bg-[#CA8A04] hover:bg-[#A16207] hover:text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <span>Load Demo Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
