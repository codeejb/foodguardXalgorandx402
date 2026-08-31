import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Cpu,
  FileCheck,
  Send,
  Loader2
} from 'lucide-react';
import { ApiClient } from '../../services/apiClient';

interface LabReportsViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

const PRESET_REPORTS = [
  {
    id: 'LAB-DEL-8921',
    batchId: 'M492',
    labName: 'National Food Quality & Safety Analysis Lab (NABL #TC-8192)',
    sampleDate: '2026-08-30 08:30 IST',
    summary: 'Total Plate Count (42,000 CFU/ml) and MBRT (3.5h) indicate elevated microbial activity approaching maximum permissible limit.',
    violationsCount: 1,
    verdict: 'WATCH',
    parameters: [
      { name: 'Total Plate Count (TPC)', value: '42,000', unit: 'CFU/ml', fssaiLimit: '< 50,000 CFU/ml', status: 'BORDERLINE' },
      { name: 'Coliform Count', value: '8', unit: 'CFU/ml', fssaiLimit: '< 10 CFU/ml', status: 'BORDERLINE' },
      { name: 'Methylene Blue Reduction Time (MBRT)', value: '3.5', unit: 'Hours', fssaiLimit: '> 4.0 Hours', status: 'VIOLATION' },
      { name: 'Neutralizers (Sodium Hydroxide)', value: 'ABSENT', unit: 'Qualitative', fssaiLimit: 'Nil', status: 'PASS' },
      { name: 'Detergents & Urea', value: 'ABSENT', unit: 'Qualitative', fssaiLimit: 'Nil', status: 'PASS' }
    ]
  },
  {
    id: 'LAB-BLR-4022',
    batchId: 'C104',
    labName: 'Southern Regional Analytical Laboratory (NABL #TC-5521)',
    sampleDate: '2026-08-29 16:15 IST',
    summary: 'Salmonella detected in raw sample. Immediate Class I recall mandatory.',
    violationsCount: 2,
    verdict: 'FAIL',
    parameters: [
      { name: 'Total Viable Count', value: '180,000', unit: 'CFU/g', fssaiLimit: '< 100,000 CFU/g', status: 'VIOLATION' },
      { name: 'Salmonella spp.', value: 'PRESENT / 25g', unit: 'Qualitative', fssaiLimit: 'Absent in 25g', status: 'VIOLATION' },
      { name: 'E. Coli', value: '< 10', unit: 'CFU/g', fssaiLimit: '< 100 CFU/g', status: 'PASS' }
    ]
  }
];

export const LabReportsView: React.FC<LabReportsViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedReport, setSelectedReport] = useState(PRESET_REPORTS[0]);
  const [customReportText, setCustomReportText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyzeCustom = async () => {
    if (!customReportText.trim() || loading) return;
    setLoading(true);
    try {
      const res = await ApiClient.analyzeLabReport(customReportText, selectedReport.batchId);
      if (res.data) {
        setSelectedReport(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'BORDERLINE':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'VIOLATION':
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
            <span>NABL ASSAY ENGINE: /labs</span>
            <span>•</span>
            <span className="text-[#1A1A18]">STATUTORY FSSAI CONFORMITY</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Lab Report Analyzer & Chemical Assay
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Automated parameter parsing, FSSAI statutory threshold checking, and microbiological verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {PRESET_REPORTS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedReport.id === r.id
                  ? 'bg-[#1A1A18] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F0F0EB] text-[#444] border border-[#DDDCD6]'
              }`}
            >
              #{r.id} (Batch {r.batchId})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Lab Report Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Dossier Overview & Parameters */}
        <div className="lg:col-span-8 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                ASSAY REPORT #{selectedReport.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A18]">
                Batch #{selectedReport.batchId} Laboratory Certificate
              </h2>
              <p className="text-xs text-[#777] font-sans">
                Laboratory: {selectedReport.labName}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                selectedReport.verdict === 'PASS'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedReport.verdict === 'WATCH'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              VERDICT: {selectedReport.verdict}
            </span>
          </div>

          {/* AI Executive Summary */}
          <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>AI BIOCHEMICAL INTERPRETATION</span>
            </span>
            <p className="text-xs text-[#333] leading-relaxed">
              {selectedReport.summary}
            </p>
          </div>

          {/* Parameters Table */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#1A1A18]">
              Microbiological & Chemical Parameters
            </h4>

            <div className="overflow-x-auto border border-[#EBEBE6] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[#EBEBE6] font-mono text-[10px] text-[#777] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Parameter Tested</th>
                    <th className="py-2.5 px-3">Observed Value</th>
                    <th className="py-2.5 px-3">FSSAI Permissible Limit</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0EB]">
                  {selectedReport.parameters.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFAF7]">
                      <td className="py-3 px-3 font-medium text-[#1A1A18]">{p.name}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-[#1A1A18]">{p.value} {p.unit}</td>
                      <td className="py-3 px-3 font-mono text-[#666]">{p.fssaiLimit}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Custom Text Analyzer */}
        <div className="lg:col-span-4 bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
              Paste New Lab Report
            </h3>
            <p className="text-xs text-[#666]">
              Paste unstructured lab test text to parse parameters with Gemini AI.
            </p>
          </div>

          <textarea
            value={customReportText}
            onChange={(e) => setCustomReportText(e.target.value)}
            placeholder="Paste text like: 'Sample Milk M492: TPC 58000 CFU/ml, Coliforms 12 CFU/ml, MBRT 2.8 hrs, Urea negative...'"
            className="w-full h-40 text-xs border border-[#DDDCD6] rounded-lg p-3 bg-white focus:outline-none focus:border-[#8F6B00] transition-colors"
          />

          <button
            onClick={handleAnalyzeCustom}
            disabled={!customReportText.trim() || loading}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              customReportText.trim() && !loading
                ? 'bg-[#1A1A18] hover:bg-[#8F6B00] text-white shadow-xs'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C49200]" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C49200]" />
                <span>Parse with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
