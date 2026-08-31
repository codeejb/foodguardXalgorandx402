import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CanonicalDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: string) => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  agentInvoked: string;
  dataMetric: string;
  description: string;
  highlightAction: string;
  targetView: string;
  badgeColor: string;
}

const CANONICAL_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'IoT Sensor Thermal Spike Detected',
    subtitle: 'Central Cold Storage #17, Okhla Phase III, New Delhi',
    agentInvoked: 'IoT Telemetry Oracle #ORC-WH17-C3',
    dataMetric: '14.8°C (+10.8°C Excursion for 4.2 Hours)',
    description: 'Chamber 3 secondary compressor tripped at 14:28 IST. Temperature climbed from 4.0°C baseline to 14.8°C, threatening 28,500L of fresh milk in Batch #M492.',
    highlightAction: 'Sensor alert logged directly to time-series stream',
    targetView: 'dashboard',
    badgeColor: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    stepNumber: 2,
    title: 'Risk Agent Escalation & Score Degradation',
    subtitle: 'Microbial Growth Kinetic Algorithm Triggered',
    agentInvoked: 'Risk Agent & Biochemical Model',
    dataMetric: 'Safety Score Plummets: 84 → 16 / 100',
    description: 'Bacterial doubling kinetics indicate standard plate count is multiplying at 3.8x baseline. The batch risk status immediately flips to HIGH RISK.',
    highlightAction: 'Digital Food DNA updated with live safety degradation',
    targetView: 'food-dna',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    stepNumber: 3,
    title: 'AI Time-Machine Forecasts 24h/48h Outbreak',
    subtitle: 'Predictive Epidemic Projection Engine',
    agentInvoked: 'Forecasting Agent (Gemini 3.7)',
    dataMetric: 'Estimated 4,200 Consumer Exposures in 36 Hours',
    description: 'Without immediate intervention, contaminated milk will reach 48 retail counters across Delhi NCR, triggering rapid citizen souring and illness complaints.',
    highlightAction: 'Time-machine forecast modeled 72 hours ahead',
    targetView: 'forecast',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300'
  },
  {
    stepNumber: 4,
    title: 'Supply Chain Graph Discovers Cross-Contamination',
    subtitle: 'Shared Transport Tanker TRK-DL-492 Cross-Linked',
    agentInvoked: 'Graph Intelligence Agent',
    dataMetric: 'Secondary Batch #P812 Flagged (14,000L Paneer)',
    description: 'Tanker TRK-DL-492 transported Batch M492 then immediately loaded pasteurized milk for Batch P812 without CIP sanitation cycle.',
    highlightAction: 'Graph link highlighted cross-contaminated batch',
    targetView: 'supply-chain',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    stepNumber: 5,
    title: 'AI Crime-Scene Investigator Identifies Root Cause',
    subtitle: 'Autonomous Correlation Across 4 Data Streams',
    agentInvoked: 'Investigation Agent',
    dataMetric: 'Compressor #2 Relay Failure & Deferred Maintenance',
    description: 'Investigator correlated 14.8°C spike with maintenance log #MNT-098 and driver telematics, ruling out sensor malfunction.',
    highlightAction: 'Automated crime-scene investigation brief produced',
    targetView: 'investigations',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    stepNumber: 6,
    title: 'NABL Lab Confirms E. coli & Coliform Outbreak',
    subtitle: 'Biochemical Re-Testing of Warehouse Samples',
    agentInvoked: 'Lab Analysis Agent',
    dataMetric: 'E. coli: 180 CFU/g (Limit: NIL) — FAILED',
    description: 'National Testing Laboratory Report #LAB-2026-948 confirmed severe bacterial growth. Automatic digital attestation issued.',
    highlightAction: 'Lab certificate cryptographically linked to batch',
    targetView: 'labs',
    badgeColor: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    stepNumber: 7,
    title: 'Citizen Network Reports Geocoded Souring Complaints',
    subtitle: '23 Verified Reports in Hauz Khas & Saket Hub',
    agentInvoked: 'Citizen Network Agent',
    dataMetric: 'Spatial Cluster Confidence: 98.4%',
    description: 'Residents logged curdled milk and off-odor packets via WhatsApp bot & QR scanner, independently corroborating sensor data.',
    highlightAction: 'Citizen cluster auto-correlated with retail delivery route',
    targetView: 'citizen',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300'
  },
  {
    stepNumber: 8,
    title: 'Consumer Scans QR Code & Sees Immediate Warning',
    subtitle: 'Frontline Public Health Shield at Point of Sale',
    agentInvoked: 'Consumer Portal Agent',
    dataMetric: 'Status: DO NOT CONSUME • BATCH UNDER RECALL',
    description: 'A consumer scanning the carton barcode in a convenience store is instantly alerted not to consume, with instant refund token.',
    highlightAction: 'Real-time consumer safety verdict delivered in <100ms',
    targetView: 'consumer',
    badgeColor: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    stepNumber: 9,
    title: 'AI Inspector Copilot Dispatches Flying Squad',
    subtitle: 'Ranked Priority Queue & Tailored Evidence Checklist',
    agentInvoked: 'Inspector Copilot Agent',
    dataMetric: 'Priority #01: Warehouse #17 (Risk Score 94)',
    description: 'Delhi Food Safety Officer receives instant mobile briefing, ATS electrical switch checklist, and tamper-proof sampling protocol.',
    highlightAction: 'Automated inspection plan generated in 2 seconds',
    targetView: 'inspections',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    stepNumber: 10,
    title: 'What-If Simulation: Warehouse Quarantined & Rerouted',
    subtitle: 'Action Taken: Statutory Hold on Batch M492 & P812',
    agentInvoked: 'Decision Engine',
    dataMetric: '18,200 Pouches Seized On-Site Before Dispatch',
    description: 'Authority issues instant digital quarantine. Secondary clean supply routed from Ambala processing plant in 3.5 hours.',
    highlightAction: 'Intervention executed live in platform twin',
    targetView: 'simulator',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    stepNumber: 11,
    title: 'Crisis Prevented: Exposure Reduced by 95.6%',
    subtitle: 'Quantified Public Health & Economic Impact',
    agentInvoked: 'Impact Analytics Engine',
    dataMetric: 'Exposure: 48,200 → 2,100 (95.6% Exposure Reduction)',
    description: 'Early intervention contained the outbreak within 8 hours, preventing an estimated 4,200 acute gastroenteritis cases and ₹2.4 Cr in economic damage.',
    highlightAction: 'Success metric recorded to National Analytics',
    targetView: 'analytics',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    stepNumber: 12,
    title: 'Algorand Blockchain Food Passport Verified',
    subtitle: 'Immutable Audit Trail on Algorand TestNet',
    agentInvoked: 'Blockchain Service',
    dataMetric: 'Block Round: 42919420 | Tx: 0x5c4b3a... (VERIFIED)',
    description: 'Seizure notice, lab re-test results, and batch status update cryptographically signed and permanently anchored on Algorand.',
    highlightAction: 'Cryptographic proof verifiable by public explorer',
    targetView: 'blockchain',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    stepNumber: 13,
    title: 'Algorand x402: External AI Agent Pays for Intelligence',
    subtitle: 'Machine-to-Machine Pay-Per-Use Intelligence Settlement',
    agentInvoked: 'x402 Protocol & Cargo Insurance AI',
    dataMetric: 'HTTP 402 → $0.005 USDC Settled → Payload Unlocked',
    description: 'HedgeShield Cargo Insurance AI requested predictive underwriting risk on Batch M492, settled via Algorand USDC micro-payment, and received verified telemetry.',
    highlightAction: 'Machine economy transaction logged to ledger',
    targetView: 'x402',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    stepNumber: 14,
    title: 'Full Lifecycle Complete: Crisis to Resolution',
    subtitle: 'The Ultimate Hackathon Demonstration',
    agentInvoked: 'FOODGUARD X Orchestration Brain',
    dataMetric: 'Predict → Prevent → Trace → Simulate → Act',
    description: 'You have witnessed the complete digital twin journey: from raw sensor spike to multi-agent correlation, public health prevention, blockchain verification, and machine economy intelligence.',
    highlightAction: 'Platform fully operational in real-time',
    targetView: 'dashboard',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  }
];

export const CanonicalDemoModal: React.FC<CanonicalDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = CANONICAL_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === CANONICAL_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStepIndex(currentStepIndex + 1);
      if (currentStepIndex + 1 === CANONICAL_STEPS.length - 1) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#854D0E', '#16A34A', '#2563EB']
          });
        } catch {}
      }
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleJumpToView = () => {
    onNavigateToView(currentStep.targetView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-300 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] text-neutral-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-[#FBF8EF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                Canonical Demonstration
              </h3>
              <p className="text-[10px] font-mono text-[#854D0E] uppercase tracking-widest font-bold">
                BATCH #M492 COLD-CHAIN CRISIS TO RESOLUTION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2 font-mono">
            <span className="font-bold tracking-widest uppercase text-[10px]">
              STEP {currentStep.stepNumber} OF {CANONICAL_STEPS.length}
            </span>
            <span className="text-[#854D0E] font-bold text-[10px] uppercase">
              {Math.round(((currentStepIndex + 1) / CANONICAL_STEPS.length) * 100)}% COMPLETE
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#854D0E] transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / CANONICAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 font-sans bg-white">
          {/* Badge & Agent Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black border uppercase tracking-wider ${currentStep.badgeColor}`}>
              {currentStep.dataMetric}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded border border-[#FDE68A]">
              <Cpu className="w-3.5 h-3.5 text-[#854D0E]" />
              <span>AGENT: <strong className="text-neutral-900">{currentStep.agentInvoked}</strong></span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
              {currentStep.title}
            </h2>
            <p className="text-xs text-[#854D0E] font-mono font-semibold mt-1">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Narrative Body */}
          <div className="bg-[#FAFAF8] border border-neutral-200 rounded-lg p-4 text-xs text-neutral-700 leading-relaxed font-mono">
            {currentStep.description}
          </div>

          {/* Key Outcome / Highlight */}
          <div className="flex items-center justify-between bg-[#FBF8EF] border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-neutral-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-mono text-[11px] font-medium">{currentStep.highlightAction}</span>
            </div>
            <button
              onClick={handleJumpToView}
              className="text-[10px] font-bold uppercase tracking-wider text-[#854D0E] underline hover:text-[#A16207] ml-2 shrink-0 cursor-pointer"
            >
              Open View →
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
              isFirst
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleJumpToView}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors cursor-pointer"
            >
              Inspect Module
            </button>

            {isLast ? (
              <button
                onClick={onClose}
                className="bg-[#854D0E] hover:bg-[#A16207] text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Story</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#854D0E] hover:bg-[#A16207] text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
