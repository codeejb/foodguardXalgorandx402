import React from 'react';
import {
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Clock,
  Network,
  Eye,
  FileCheck,
  Users,
  Lock,
  Coins,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Flame,
  Radio
} from 'lucide-react';
import { INDIA_STATE_RISKS } from '../../data/mockData';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenCanonicalModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  return (
    <div className="bg-white text-neutral-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-neutral-200 bg-linear-to-b from-[#FAF8F2] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#78350F] rounded">
                <span className="w-2 h-2 rounded-full bg-[#854D0E] animate-ping" />
                <span>NATIONAL FOOD SAFETY INTELLIGENCE TWIN</span>
              </div>

              <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-neutral-900 uppercase leading-[0.88]">
                FOOD SAFETY <br />
                <span className="text-[#854D0E]">BEFORE</span> THE CRISIS.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl font-normal">
                An autonomous digital twin of India's food supply network. Predict bacterial degradation, pinpoint cold-chain excursions across highways, and trigger surgical quarantines before contamination reaches consumers.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-[#854D0E] hover:bg-[#A16207] text-white px-7 py-3.5 rounded font-black text-xs uppercase tracking-[0.18em] flex items-center gap-2.5 transition-all cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>ENTER COMMAND CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCanonicalModal}
                  className="bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-[#854D0E] px-6 py-3.5 rounded font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-[#854D0E]" />
                  <span>RUN CANONICAL DEMO (M492)</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-neutral-200 text-xs">
                <div>
                  <div className="font-mono text-3xl font-black text-[#854D0E]">500+</div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mt-1 font-bold">Batches Monitored</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-black text-red-600">95.6%</div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mt-1 font-bold">Exposure Reduction</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-black text-emerald-600">100%</div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mt-1 font-bold">Algorand Verified</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: India Map & Live Intelligence Twin */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-amber-200/80 rounded-xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-neutral-900">
                      LIVE INDIA RISK MAP
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 border border-[#FDE68A] uppercase tracking-widest rounded">
                    10 NODES ACTIVE
                  </span>
                </div>

                {/* Interactive SVG India Grid Preview */}
                <div className="relative h-68 bg-[#FAF8F2] rounded-lg border border-neutral-200 p-4 flex flex-col justify-between overflow-hidden">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAE7DC_1px,transparent_1px),linear-gradient(to_bottom,#EAE7DC_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />

                  {/* Nodes on India canvas */}
                  <div className="relative z-10 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-red-200 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-700 uppercase text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-600" /> Delhi NCR
                        </span>
                        <span className="font-mono text-[9px] font-black text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                          RISK 86
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-600 mt-1 font-mono">
                        Batch M492 excursion (+10.8°C).
                      </p>
                    </div>

                    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-amber-200 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#854D0E] uppercase text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#854D0E]" /> Bengaluru
                        </span>
                        <span className="font-mono text-[9px] font-black text-[#78350F] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A]">
                          RISK 78
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-600 mt-1 font-mono">
                        Batch C104 transit stoppage at Hosur.
                      </p>
                    </div>
                  </div>

                  {/* Center Pulse graphic */}
                  <div className="relative z-10 text-center py-2">
                    <div className="inline-flex items-center gap-2 bg-white border border-[#FDE68A] text-[#78350F] px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-xs">
                      <Radio className="w-3 h-3 text-[#854D0E] animate-pulse" />
                      <span>AUTONOMOUS MULTI-AGENT SWARM ACTIVE</span>
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-neutral-200">
                    <span className="text-neutral-600">Algorand Round: #42918402</span>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="text-[#854D0E] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                    >
                      Open Full Map →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PARADIGM SHIFT: REACTIVE TO PREDICTIVE */}
      <section className="py-24 bg-[#FAFAF8] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-mono text-[#854D0E] tracking-[0.3em] uppercase font-bold">
              THE STRUCTURAL TRANSFORMATION
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-900">
              From Reactive Crisis Management to Autonomous Early Warning.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 space-y-5 shadow-xs">
              <div className="inline-block font-mono text-[10px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded border border-red-200 uppercase tracking-widest">
                TRADITIONAL FOOD SAFETY (REACTIVE)
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-neutral-900">
                Action Happens After People Fall Sick
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 leading-relaxed font-mono">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Paper logbooks and localized temperature checks hidden in isolated silos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Contamination discovered only after hospitals report poisoning outbreaks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Tracing takes 14 to 30 days via manual supplier invoice audits.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Uncoordinated bulk recalls that cause massive food waste and panic.</span>
                </li>
              </ul>
            </div>

            {/* The FoodGuard X Way */}
            <div className="bg-white border-2 border-amber-300 rounded-xl p-8 space-y-5 shadow-md">
              <div className="inline-block font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 uppercase tracking-widest">
                FOODGUARD X (PREDICTIVE TWIN)
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-neutral-900">
                Action Happens Before Spoilage Propagates
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-700 leading-relaxed font-mono">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Real-time IoT cold-chain telemetry with continuous bacterial kinetic modeling.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Autonomous Multi-Agent AI correlates citizen reports with highway transit delays in seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Sub-second supply graph traversal pinpoints exact warehouse chambers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Surgical digital quarantines reduce consumer exposure by up to 95.6%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURE PILLARS */}
      <section className="py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-mono text-[#854D0E] tracking-[0.3em] uppercase font-bold">
              FIVE INTERLOCKED ENGINES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-900">
              Predict → Prevent → Trace → Simulate → Act
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'PREDICT',
                desc: 'Continuous microbial degradation forecast 72 hours ahead of spoilage.',
                view: 'forecast'
              },
              {
                step: '02',
                title: 'PREVENT',
                desc: 'Autonomous anomaly detection flags synchronized supplier & thermal drifts.',
                view: 'anomalies'
              },
              {
                step: '03',
                title: 'TRACE',
                desc: 'Algorand-anchored Digital Food DNA tracks every batch from cow to carton.',
                view: 'food-dna'
              },
              {
                step: '04',
                title: 'SIMULATE',
                desc: 'Contamination Spread Engine tests what-if intervention policies in real time.',
                view: 'simulator'
              },
              {
                step: '05',
                title: 'ACT',
                desc: 'AI Inspector Copilot dispatches tailored checklists to field officers.',
                view: 'inspections'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(p.view)}
                className="bg-[#FAFAF8] border border-neutral-200 rounded-xl p-6 space-y-3 hover:border-[#854D0E] hover:bg-[#FEF3C7]/30 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="font-mono text-xs text-[#854D0E] font-black tracking-widest">
                  //{p.step}
                </div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                  {p.desc}
                </p>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E] pt-2 flex items-center gap-1">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURE SHOWCASES GRID */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-mono text-[#854D0E] tracking-[0.3em] uppercase font-bold">
              COMPLETE PLATFORM CAPABILITIES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-900">
              A Digital Brain for India's Food Safety
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Food DNA */}
            <div
              onClick={() => onNavigate('food-dna')}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-[#854D0E] transition-all cursor-pointer space-y-3 group shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                Digital Food DNA
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Every major food batch receives a unique cryptographic passport combining telemetry, NABL testing, cold-storage duration, and historical complaints.
              </p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E] inline-flex items-center gap-1 pt-1 group-hover:underline">
                View Batch M492 Passport →
              </span>
            </div>

            {/* Card 2: AI Crime Scene Investigator */}
            <div
              onClick={() => onNavigate('investigations')}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-[#854D0E] transition-all cursor-pointer space-y-3 group shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                AI Crime-Scene Investigator
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Connects 23 citizen complaints to the same distributor, same reefer truck, and isolated compressor malfunction at Warehouse #17 with 94% confidence.
              </p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E] inline-flex items-center gap-1 pt-1 group-hover:underline">
                Open Investigation Dossier →
              </span>
            </div>

            {/* Card 3: x402 Intelligence Economy */}
            <div
              onClick={() => onNavigate('x402')}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-[#854D0E] transition-all cursor-pointer space-y-3 group shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#854D0E]">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-neutral-900 group-hover:text-[#854D0E] transition-colors">
                x402 M2M Economy
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Autonomous AI agents (Insurance, Logistics, Fleet Management) pay micro-fractions of USDC on Algorand to unlock real-time food risk APIs.
              </p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E] inline-flex items-center gap-1 pt-1 group-hover:underline">
                Explore M2M Marketplace →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-24 bg-white border-t border-neutral-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-[10px] font-mono text-[#854D0E] tracking-[0.3em] uppercase font-bold">
            NATIONAL SCALE DEPLOYMENT
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-neutral-900 uppercase">
            Protecting Every Meal Across India.
          </h2>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto font-mono">
            Experience the working national intelligence platform. Test live simulations, investigate real-time anomalies, and verify immutable blockchain passports.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-[#854D0E] hover:bg-[#A16207] text-white px-8 py-4 rounded font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCanonicalModal}
              className="bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-[#854D0E] px-6 py-4 rounded font-bold text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer shadow-2xs"
            >
              RUN CANONICAL DEMO (BATCH M492)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
