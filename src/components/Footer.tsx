import React from 'react';
import { Shield, Lock, Globe, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#18181C] border-t border-[#2A2A30] mt-24 py-16 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#2A2A30]">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/foodguardx-logo.png" alt="FoodGuardX" className="h-10 w-auto" />
            </div>
            <p className="text-[10px] font-mono text-amber-400 tracking-[0.2em] uppercase font-bold">
              PREDICT • PREVENT • TRACE • SIMULATE • ACT
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              An autonomous AI digital twin and early-warning intelligence platform for India's food supply chain.
              Connecting suppliers, factories, cold chains, testing labs, and citizen networks to stop contamination crises before they spread.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[10px] font-mono uppercase text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> FSSAI ALIGNED
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> ALGORAND TESTNET
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> x402 PROTOCOL
              </span>
            </div>
          </div>

          {/* Col 2: Intelligence Modules */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-100 mb-4 font-mono">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Command Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('food-dna')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Digital Food DNA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forecast')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Food Safety Time Machine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulator')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Contamination Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('investigations')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  AI Crime-Scene Investigator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('anomalies')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Unknown Risk Detector
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Field & Trust */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-100 mb-4 font-mono">
              Field & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('inspections')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  AI Inspector Copilot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vision')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  AI Vision Inspector
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('labs')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Lab Report Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('citizen')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Citizen Food Safety Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consumer')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Consumer QR Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blockchain')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  Algorand Food Passport
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Economy & Developers */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-100 mb-4 font-mono">
              M2M Economy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('x402')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  x402 Intelligence Economy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  National Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('api-docs')} className="text-gray-400 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                  API Documentation
                </button>
              </li>
              <li>
                <a
                  href="https://testnet.algoexplorer.io"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-gray-400 hover:text-amber-400 font-medium transition-colors"
                >
                  Algorand Explorer <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-900/20 px-2 py-1 rounded border border-amber-500/30 tracking-wider inline-block">
                  HTTP 402 LIVE GATEWAY
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 FOODGUARD X INTELLIGENCE SYSTEMS. PROTECTING INDIA'S FOOD SUPPLY.</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase text-gray-500">
            <span>ALGORAND APP ID: 72938104</span>
            <span>•</span>
            <span>GEMINI 3.7 FLASH BACKEND</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">ALL SYSTEMS LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
