import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  FileCode,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Coins,
  RefreshCw,
  Eye,
  Check,
  FileUp,
  Download,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiClient, PipelineResponse, PipelineResult } from '../services/apiClient';

interface UniversalDataPipelineProps {
  onNavigate?: (view: string) => void;
}

const SAMPLE_DATA_PRESETS = [
  {
    title: '📊 Cold Chain Thermal CSV',
    fileName: 'okhla_depot_sensor_log_48h.csv',
    fileType: 'text/csv',
    desc: '48-hour IoT sensor thermal readings with 14.8°C excursion',
    data: 'timestamp,chamber_id,temperature_c,humidity_rh,compressor_status,batch_id\n2026-09-02T04:00:00Z,CH-17,4.1,82,NORMAL,M492\n2026-09-02T05:00:00Z,CH-17,8.4,85,WARNING,M492\n2026-09-02T06:00:00Z,CH-17,14.8,91,FAILED,M492\n2026-09-02T07:00:00Z,CH-17,13.2,89,RESTARTING,M492'
  },
  {
    title: '📸 Pouch Vision Inspection',
    fileName: 'milk_pouch_tensile_bloat.jpg',
    fileType: 'image/jpeg',
    desc: 'High-res image of bloated milk pouch with 1.2mm seam stretch',
    data: 'data:image/jpeg;base64,sample_pouch_inspection_data'
  },
  {
    title: '📄 NABL Lab Certificate (DOCX)',
    fileName: 'nabl_lab_microbial_cert_delhi.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    desc: 'Total Plate Count (42,000 CFU/ml) & MBRT chemical report',
    data: 'NABL Certificate DEL-8921: Batch M492 tested for Total Plate Count (42,000 CFU/ml), Coliform (8 CFU/ml), MBRT (3.5h). Formaldehyde: Negative. Urea: Negative.'
  },
  {
    title: '🎥 Tanker Inspection Video',
    fileName: 'tanker_unloading_inspection.mp4',
    fileType: 'video/mp4',
    desc: '1080p cold-storage dock video feed analyzing seal integrity',
    data: 'tanker_video_feed_metadata_dock_7'
  }
];

export const UniversalDataPipeline: React.FC<UniversalDataPipelineProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: string;
    size: string;
    data?: string;
  } | null>(null);
  const [targetBatchId, setTargetBatchId] = useState('M492');
  const [userNotes, setUserNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: (file.size / 1024).toFixed(1) + ' KB',
        data: (event.target?.result as string) || ''
      });
      setPipelineResult(null);
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (preset: typeof SAMPLE_DATA_PRESETS[0]) => {
    setSelectedFile({
      name: preset.fileName,
      type: preset.fileType,
      size: '14.2 KB',
      data: preset.data
    });
    setUserNotes(preset.desc);
    setPipelineResult(null);
  };

  const handleRunPipeline = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setCurrentStepIndex(1);

    // Simulate animated step progression
    const stepTimer1 = setTimeout(() => setCurrentStepIndex(2), 500);
    const stepTimer2 = setTimeout(() => setCurrentStepIndex(3), 1100);

    try {
      const res: PipelineResponse = await ApiClient.processDataPipeline({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileData: selectedFile.data,
        targetBatchId,
        notes: userNotes
      });

      setCurrentStepIndex(4);
      setTimeout(() => {
        setPipelineResult(res.result);
        setProcessing(false);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#854D0E', '#F59E0B', '#10B981']
          });
        } catch {}
      }, 500);
    } catch (err) {
      setProcessing(false);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPipelineResult(null);
    setProcessing(false);
    setCurrentStepIndex(0);
    setUserNotes('');
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'WATCH':
        return 'bg-amber-100 text-[#78350F] border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden text-neutral-900">
      {/* Top Banner with Dark Yellow Branding & Handwriting Note */}
      <div className="bg-[#FAF8F2] border-b border-amber-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#78350F] px-2.5 py-0.5 rounded border border-[#FDE68A] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#854D0E]" />
              <span>UNIVERSAL FOOD DATA INGESTION & PIPELINE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
              Drop Any File → AI Algo Runs → Task Completed Instantly
            </h2>
            <p className="text-xs text-neutral-600 font-mono">
              Accepts Images, Video Feeds, Excel spreadsheets (.xlsx), CSV data, and Word documents (.docx).
            </p>
          </div>

          <div className="bg-white border border-[#FDE68A] px-4 py-2.5 rounded-lg shadow-2xs rotate-1 shrink-0">
            <span className="text-[10px] font-mono font-bold text-[#854D0E] uppercase block">
              ✍️ Real Field Workflow:
            </span>
            <p className="handwriting-note text-sm text-[#854D0E]">
              "Data upload karo, AI analyse karega, Algorand pe stamp hoga, aur decision instant ready!"
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* If no result yet: Upload & Configuration Stage */}
        {!pipelineResult ? (
          <div className="space-y-6">
            {/* Quick Presets Bar */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                Quick Sample Presets (Click to Test):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SAMPLE_DATA_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="p-3 bg-[#FAF8F2] hover:bg-[#FEF3C7]/60 border border-neutral-200 hover:border-[#854D0E] rounded-lg text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="font-bold text-xs text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                      {preset.title}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 line-clamp-1 mt-1">
                      {preset.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#854D0E] bg-[#FEF3C7]/40 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/40'
                  : 'border-neutral-300 hover:border-[#854D0E] bg-[#FAFAF8]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,.csv,.xlsx,.xls,.docx,.doc,.txt,.json,.pdf"
                onChange={handleFileChange}
              />

              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#854D0E] flex items-center justify-center mx-auto shadow-xs">
                  {selectedFile ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-neutral-900">
                    {selectedFile ? selectedFile.name : 'Drop photo, video, Excel, CSV or Word file here'}
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    {selectedFile
                      ? `Type: ${selectedFile.type} • Size: ${selectedFile.size}`
                      : 'or click to browse from device (Any file format supported)'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#854D0E]" /> Image / Photo
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-blue-600" /> Video
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel & CSV
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-600" /> Word & Docs
                  </span>
                </div>
              </div>
            </div>

            {/* Target Batch & Custom Notes Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-600 block mb-1">
                  Target Batch Identifier
                </label>
                <input
                  type="text"
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  placeholder="e.g. M492, C104, DAIRY-88"
                  className="w-full bg-[#FAF8F2] border border-neutral-300 rounded px-3 py-2 font-bold text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-neutral-600 block mb-1">
                  Inspection Notes / Operational Context
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Okhla Sector 17 cold storage dock inspection, tanker sample #4"
                  className="w-full bg-[#FAF8F2] border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                />
              </div>
            </div>

            {/* Run Button or Processing State */}
            {processing ? (
              <div className="p-6 bg-[#FBF8EF] border border-amber-300 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-[#854D0E] animate-spin" />
                    <span className="font-display font-bold text-sm uppercase text-neutral-900">
                      Executing FoodGuard Pipeline & Algorand Ledger Anchor...
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#854D0E] font-bold">
                    Step {currentStepIndex} of 4
                  </span>
                </div>

                {/* Progress Bar Steps */}
                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono font-bold">
                  {[
                    { step: 1, label: 'Ingesting Data' },
                    { step: 2, label: 'Running AI & Algo' },
                    { step: 3, label: 'Algorand Anchor' },
                    { step: 4, label: 'Task Completed' }
                  ].map((s) => (
                    <div
                      key={s.step}
                      className={`p-2 rounded border text-center transition-all ${
                        currentStepIndex >= s.step
                          ? 'bg-[#FEF3C7] text-[#78350F] border-[#A16207]'
                          : 'bg-white text-neutral-400 border-neutral-200'
                      }`}
                    >
                      <span>{s.step}. {s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRunPipeline}
                disabled={!selectedFile}
                className={`w-full font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  selectedFile
                    ? 'bg-[#854D0E] hover:bg-[#A16207] text-white shadow-md hover:shadow-lg'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Process Data & Execute Algorand Pipeline Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* =========================================================================
             TASK FINISHED & RESULTS VIEW ("bnde ne data dia and then algo hua then uska kaam hogya")
             ========================================================================= */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Success Celebration Top Bar */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg uppercase tracking-tight text-neutral-900">
                      Task Completed Successfully!
                    </h3>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase">
                      JOB RESOLVED
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono">
                    Data analyzed, kinetic risk calculated, and blockchain passport sealed on Algorand TestNet.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 px-3.5 py-2 rounded text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Process Another File</span>
                </button>
              </div>
            </div>

            {/* Main Result Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Safety Score & Key Findings */}
              <div className="lg:col-span-7 bg-[#FAF8F2] border border-neutral-300 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
                      Target Batch Assessment
                    </span>
                    <h4 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                      Batch #{pipelineResult.batchId}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black border uppercase tracking-wider ${getRiskBadge(pipelineResult.riskLevel)}`}>
                    RISK: {pipelineResult.riskLevel}
                  </span>
                </div>

                {/* Score & Metrics Strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 font-bold block">
                      Safety Score
                    </span>
                    <span className={`font-mono text-2xl font-black ${
                      pipelineResult.safetyScore >= 80
                        ? 'text-emerald-600'
                        : pipelineResult.safetyScore >= 50
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {pipelineResult.safetyScore}/100
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 font-bold block">
                      Adulteration
                    </span>
                    <span className={`font-mono text-xs font-black uppercase block mt-1 ${
                      pipelineResult.adulterationStatus === 'PURE' ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {pipelineResult.adulterationStatus}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 font-bold block">
                      FSSAI Compliance
                    </span>
                    <span className="font-mono text-xs font-black text-[#854D0E] uppercase block mt-1">
                      {pipelineResult.complianceStatus}
                    </span>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-white p-4 rounded-lg border border-neutral-200 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#854D0E] font-bold tracking-wider block flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Algorithmic Intelligence Output:</span>
                  </span>
                  <p className="text-xs text-neutral-700 font-mono leading-relaxed">
                    {pipelineResult.summary}
                  </p>
                </div>

                {/* Extracted Parameters Table */}
                {pipelineResult.parameters && pipelineResult.parameters.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-600 font-bold tracking-wider block">
                      Extracted Laboratory & Sensory Parameters:
                    </span>
                    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden text-xs font-mono">
                      <table className="w-full text-left">
                        <thead className="bg-[#F6F4EB] text-neutral-600 text-[10px] uppercase font-bold border-b border-neutral-200">
                          <tr>
                            <th className="p-2.5">Parameter</th>
                            <th className="p-2.5">Value</th>
                            <th className="p-2.5">FSSAI Norm</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {pipelineResult.parameters.map((param, pIdx) => (
                            <tr key={pIdx} className="hover:bg-neutral-50">
                              <td className="p-2.5 font-medium text-neutral-900">{param.parameter}</td>
                              <td className="p-2.5 font-bold text-neutral-800">{param.value}</td>
                              <td className="p-2.5 text-neutral-500 text-[11px]">{param.standard}</td>
                              <td className="p-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  param.status === 'NORMAL'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : param.status === 'WARNING'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Algorand Blockchain Seal & Legal Directive */}
              <div className="lg:col-span-5 space-y-4">
                {/* Algorand Blockchain Receipt Card */}
                <div className="bg-[#FBF8EF] border-2 border-amber-300 rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#854D0E]" />
                      <span className="font-display font-black text-xs uppercase tracking-wider text-neutral-900">
                        Algorand Passport Sealed
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-bold bg-[#FEF3C7] text-[#78350F] px-2 py-0.5 rounded border border-[#FDE68A]">
                      FINALITY 3.3s
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold">TxID:</span>
                      <span className="font-bold text-neutral-900 text-[11px]">{pipelineResult.blockchainAnchor.txId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold">Block Round:</span>
                      <span className="font-bold text-[#854D0E]">#{pipelineResult.blockchainAnchor.round}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold">Passport Hash:</span>
                      <span className="text-neutral-600 text-[10px] truncate max-w-[170px]">{pipelineResult.blockchainAnchor.anchorHash}</span>
                    </div>
                  </div>

                  <a
                    href={pipelineResult.blockchainAnchor.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#854D0E] hover:bg-[#A16207] text-white p-2.5 rounded-lg text-center text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs block"
                  >
                    <span>Verify On AlgoExplorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Real Handwriting Field Inspection Stamp */}
                <div className="bg-white border border-[#FDE68A] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-mono font-bold text-[#854D0E] uppercase block mb-1">
                    📋 Direct Action Checklist Dispatched:
                  </span>
                  <ul className="text-xs font-mono text-neutral-700 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Batch certificate generated & signed</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Regional FSSAI officer notified automatically</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Retail shelf quarantine policy stamped</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
