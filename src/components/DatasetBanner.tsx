import React from 'react';
import {
  Upload,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Download
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { downloadSampleExcelFile } from '../services/dataIntelligenceEngine';

export const DatasetBanner: React.FC = () => {
  const {
    metadata,
    hasDataset,
    setUploadModalOpen,
    setReportModalOpen,
    setFeedbackModalOpen,
    loadDemoData
  } = useDataset();

  if (!hasDataset || !metadata) {
    return (
      <div className="bg-[#FAF8F2] border-b-2 border-amber-300 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span className="font-mono text-xs font-bold text-neutral-700 uppercase">
              NO ACTIVE DATASET LOADED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="text-xs font-mono font-bold text-white bg-[#854D0E] hover:bg-[#A16207] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Excel</span>
            </button>
            <button
              onClick={loadDemoData}
              className="text-xs font-mono font-bold text-neutral-900 bg-[#CA8A04] hover:bg-[#A16207] hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDemo = metadata.mode === 'DEMO';

  return (
    <div className="bg-[#FAF8F2] border-b-2 border-neutral-300 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Mode Badge & Metadata */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] font-mono text-[10px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04] animate-pulse" />
              DEMO MODE — SYNTHETIC DATA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-[10px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              USER DATA — UPLOADED DATASET
            </span>
          )}

          <span className="font-mono text-xs text-neutral-700 font-bold">
            ID: <span className="text-neutral-900 font-black">{metadata.datasetId}</span>
          </span>

          <span className="text-neutral-300 font-mono">•</span>

          <span className="font-mono text-xs text-neutral-600">
            {metadata?.summaryStats?.totalBatches || 0} Batches Analyzed
          </span>

          <span className="text-neutral-300 font-mono">•</span>

          <span className="font-mono text-xs text-neutral-600">
            {metadata?.summaryStats?.criticalBatches || 0} Critical, {metadata?.summaryStats?.highRiskBatches || 0} High
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="text-xs font-mono font-bold text-neutral-800 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Switch or re-upload dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>Switch Dataset</span>
          </button>

          <button
            onClick={downloadSampleExcelFile}
            className="text-xs font-mono font-bold text-neutral-800 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Download the 7-column Excel template"
          >
            <Download className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>Excel Template</span>
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs font-mono font-bold text-white bg-[#854D0E] hover:bg-[#A16207] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Investigation Report</span>
          </button>

          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="text-xs font-mono font-bold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
            <span>AI Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};
