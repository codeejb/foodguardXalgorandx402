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
        return 'text-emerald-400 bg-emerald-900/20 border-emerald-800/40';
      case 'BORDERLINE':
        return 'text-amber-400 bg-amber-900/20 border-amber-800/40';
      case 'VIOLATION':
        return 'text-red-400 bg-red-900/20 border-red-800/40';
      default:
        return 'text-gray-300 bg-[#1F1F24] border-[#2A2A30]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#18181C] border border-[#2A2A30] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>NABL ASSAY ENGINE: /labs</span>
            <span>•</span>
            <span className="text-gray-100">STATUTORY FSSAI CONFORMITY</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-100">
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
                  ? 'bg-[#18181C] text-white shadow-md shadow-black/20'
                  : 'bg-[#18181C] hover:bg-[#F0F0EB] text-gray-400 border border-[#2A2A30]'
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
        <div className="lg:col-span-8 bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0EB] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#8F6B00]">
                ASSAY REPORT #{selectedReport.id}
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-100">
                Batch #{selectedReport.batchId} Laboratory Certificate
              </h2>
              <p className="text-xs text-gray-500 font-sans">
                Laboratory: {selectedReport.labName}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                selectedReport.verdict === 'PASS'
                  ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800/40'
                  : selectedReport.verdict === 'WATCH'
                  ? 'bg-amber-900/20 text-amber-400 border-amber-800/40'
                  : 'bg-red-900/20 text-red-400 border-red-800/40'
              }`}
            >
              VERDICT: {selectedReport.verdict}
            </span>
          </div>

          {/* AI Executive Summary */}
          <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-gray-100 uppercase font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8F6B00]" />
              <span>AI BIOCHEMICAL INTERPRETATION</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              {selectedReport.summary}
            </p>
          </div>

          {/* Parameters Table */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gray-100">
              Microbiological & Chemical Parameters
            </h4>

            <div className="overflow-x-auto border border-[#2A2A30] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181C] border-b border-[#2A2A30] font-mono text-[10px] text-gray-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Parameter Tested</th>
                    <th className="py-2.5 px-3">Observed Value</th>
                    <th className="py-2.5 px-3">FSSAI Permissible Limit</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0EB]">
                  {selectedReport.parameters.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#18181C]">
                      <td className="py-3 px-3 font-medium text-gray-100">{p.name}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-gray-100">{p.value} {p.unit}</td>
                      <td className="py-3 px-3 font-mono text-gray-400">{p.fssaiLimit}</td>
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
        <div className="lg:col-span-4 bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20 space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-100">
              Paste New Lab Report
            </h3>
            <p className="text-xs text-gray-400">
              Paste unstructured lab test text to parse parameters with Gemini AI.
            </p>
          </div>

          <textarea
            value={customReportText}
            onChange={(e) => setCustomReportText(e.target.value)}
            placeholder="Paste text like: 'Sample Milk M492: TPC 58000 CFU/ml, Coliforms 12 CFU/ml, MBRT 2.8 hrs, Urea negative...'"
            className="w-full h-40 text-xs border border-[#2A2A30] rounded-lg p-3 bg-[#18181C] focus:outline-none focus:border-amber-600 transition-colors"
          />

          <button
            onClick={handleAnalyzeCustom}
            disabled={!customReportText.trim() || loading}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              customReportText.trim() && !loading
                ? 'bg-[#18181C] hover:bg-amber-600 text-white shadow-md shadow-black/20'
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
