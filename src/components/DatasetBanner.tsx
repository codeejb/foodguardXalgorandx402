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
      <div className="bg-[#18181C] border-b-2 border-amber-600/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span className="font-mono text-xs font-bold text-gray-300 uppercase">
              NO ACTIVE DATASET LOADED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="text-xs font-mono font-bold text-white bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Excel</span>
            </button>
            <button
              onClick={loadDemoData}
              className="text-xs font-mono font-bold text-gray-100 bg-[#CA8A04] hover:bg-amber-400 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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
    <div className="bg-[#18181C] border-b-2 border-[#3A3A42] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Mode Badge & Metadata */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-900/20 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04] animate-pulse" />
              DEMO MODE — SYNTHETIC DATA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/30 border border-emerald-600 text-emerald-900 font-mono text-[10px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              USER DATA — UPLOADED DATASET
            </span>
          )}

          <span className="font-mono text-xs text-gray-300 font-bold">
            ID: <span className="text-gray-100 font-black">{metadata.datasetId}</span>
          </span>

          <span className="text-gray-600 font-mono">•</span>

          <span className="font-mono text-xs text-gray-400">
            {metadata?.summaryStats?.totalBatches || 0} Batches Analyzed
          </span>

          <span className="text-gray-600 font-mono">•</span>

          <span className="font-mono text-xs text-gray-400">
            {metadata?.summaryStats?.criticalBatches || 0} Critical, {metadata?.summaryStats?.highRiskBatches || 0} High
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="text-xs font-mono font-bold text-gray-200 hover:text-gray-100 bg-[#18181C] hover:bg-[#252529] border border-[#3A3A42] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-black/30"
            title="Switch or re-upload dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Dataset</span>
          </button>

          <button
            onClick={downloadSampleExcelFile}
            className="text-xs font-mono font-bold text-gray-200 hover:text-gray-100 bg-[#18181C] hover:bg-[#252529] border border-[#3A3A42] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-black/30"
            title="Download the 7-column Excel template"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Excel Template</span>
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs font-mono font-bold text-white bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-black/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Investigation Report</span>
          </button>

          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="text-xs font-mono font-bold text-gray-300 hover:text-gray-100 bg-[#18181C] hover:bg-[#252529] border border-[#3A3A42] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-black/30"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
            <span>AI Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};
