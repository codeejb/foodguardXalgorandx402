import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Cpu,
  Coins,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bell,
  Layers,
  ChevronDown,
  User,
  LogOut,
  Zap,
  LogIn
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  simRunning: boolean;
  onToggleSim: () => void;
  onResetSim: () => void;
  onOpenCanonicalModal: () => void;
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onOpenPayWithAlgo: () => void;
}

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'FOOD_SAFETY_AUTHORITY', label: 'Food Safety Authority' },
  { id: 'INSPECTOR', label: 'Field Food Inspector' },
  { id: 'MANUFACTURER', label: 'Dairy / Food Manufacturer' },
  { id: 'SUPPLIER', label: 'Agro Cooperative / Supplier' },
  { id: 'LABORATORY', label: 'NABL Certified Lab' },
  { id: 'LOGISTICS', label: 'Cold Chain Logistics' },
  { id: 'RESTAURANT', label: 'Restaurant / Cloud Kitchen' },
  { id: 'CONSUMER', label: 'Consumer Portal' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  selectedRole,
  onRoleChange,
  simRunning,
  onToggleSim,
  onResetSim,
  onOpenCanonicalModal,
  onOpenCopilot,
  onOpenNotifications,
  unreadCount,
  user,
  onOpenAuthModal,
  onSignOut,
  onOpenPayWithAlgo
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Command Center' },
    { id: 'food-dna', label: 'Food DNA' },
    { id: 'forecast', label: 'Time Machine' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'investigations', label: 'Investigations' },
    { id: 'supply-chain', label: 'Supply Graph' },
    { id: 'anomalies', label: 'Anomalies' },
    { id: 'inspections', label: 'Inspector AI' },
    { id: 'vision', label: 'Vision AI' },
    { id: 'labs', label: 'Lab Reports' },
    { id: 'citizen', label: 'Citizen Network' },
    { id: 'consumer', label: 'Consumer Scan' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'x402', label: 'x402 Economy' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'api-docs', label: 'API Docs' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      {/* Top Intelligence & Blockchain Ticker Bar with Dark Yellow Accents */}
      <div className="bg-[#FBF8EF] border-b border-amber-200/70 px-4 lg:px-8 py-1.5 text-xs text-neutral-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
            <span className="text-neutral-900 text-xs font-black tracking-[0.2em] uppercase font-display">
              FOODGUARD <span className="text-[#854D0E]">X</span>
            </span>
            <span className="text-neutral-300">//</span>
            <span className="font-mono text-[10px] text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 border border-[#FDE68A] tracking-wider uppercase font-bold rounded">
              PREDICT • PREVENT • TRACE • SIMULATE • ACT
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-wider uppercase text-neutral-600">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#A16207]" />
              AI: <strong className="text-neutral-900">GEMINI 3.7 FLASH</strong>
            </span>
            <span className="text-neutral-300">/</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-600" />
              LEDGER: <strong className="text-neutral-900">ALGORAND TESTNET</strong>
            </span>
            <span className="text-neutral-300">/</span>
            <span className="flex items-center gap-1.5">
              <Coins className="w-3 h-3 text-[#854D0E]" />
              PROTOCOL: <strong className="text-neutral-900">x402 M2M USDC</strong>
            </span>
          </div>
        </div>

        {/* Live Simulation Controls & Canonical Walkthrough */}
        <div className="flex items-center gap-2">
          {/* Live Simulator Ticker Button */}
          <div className="flex items-center bg-white border border-neutral-300 rounded px-2 py-0.5 shadow-2xs">
            <span className="text-[10px] font-mono text-neutral-500 mr-2 tracking-wider font-semibold">IoT SIM:</span>
            <button
              onClick={onToggleSim}
              className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded flex items-center gap-1 transition-colors cursor-pointer ${
                simRunning ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-100 text-neutral-600'
              }`}
              title="Toggle Live IoT Simulation Engine"
            >
              {simRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              {simRunning ? 'STREAMING' : 'PAUSED'}
            </button>
            <button
              onClick={onResetSim}
              className="p-1 text-neutral-400 hover:text-neutral-800 ml-1 cursor-pointer transition-colors"
              title="Reset Simulation State"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Canonical Story Modal Trigger */}
          <button
            onClick={onOpenCanonicalModal}
            className="bg-[#854D0E] hover:bg-[#A16207] text-white px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>CANONICAL DEMO (BATCH M492)</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-[#A16207] transition-colors">
            X
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-neutral-900 leading-none flex items-center gap-1.5 uppercase font-display">
              FOODGUARD <span className="text-[#854D0E]">X</span>
            </div>
            <div className="text-[9px] tracking-[0.25em] text-[#854D0E] uppercase font-mono font-bold mt-0.5">
              NATIONAL INTELLIGENCE TWIN
            </div>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 max-w-[48vw]">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A] shadow-2xs font-extrabold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* PAY WITH ALGO BUTTON */}
          <button
            onClick={onOpenPayWithAlgo}
            className="flex items-center gap-1.5 bg-[#854D0E] hover:bg-[#A16207] text-white border border-[#78350F] px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:shadow"
            title="Settle x402 Micropayments with Algorand"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-300" />
            <span className="font-mono">Pay with ALGO</span>
          </button>

          {/* Ask AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="hidden sm:flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#854D0E]" />
            <span>AI Copilot</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#854D0E]" />
              <span className="hidden md:inline max-w-[110px] truncate">
                {ROLES.find((r) => r.id === selectedRole)?.label}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-neutral-300 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 font-bold text-[9px] text-neutral-500 uppercase tracking-[0.2em] border-b border-neutral-200 bg-neutral-50">
                  Select Operating Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-100 transition-colors uppercase text-[11px] font-semibold tracking-wider ${
                      selectedRole === r.id ? 'font-bold text-[#854D0E] bg-[#FEF3C7] border-l-3 border-[#854D0E]' : 'text-neutral-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {selectedRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#854D0E]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SIGN IN / USER PROFILE BUTTON */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 bg-[#FEF3C7] border border-[#FDE68A] hover:bg-[#FDE68A] text-[#78350F] px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-[#854D0E] text-white flex items-center justify-center text-[9px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[85px] truncate font-mono">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-[#854D0E]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-neutral-300 rounded-lg shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-neutral-200 bg-[#FBF8EF]">
                    <div className="font-bold text-neutral-900 truncate">{user.name}</div>
                    <div className="text-[10px] font-mono text-neutral-500 truncate">
                      {user.email || user.phoneNumber}
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono mt-1 text-[#854D0E] font-bold">
                      <span>WALLET: {user.algoWalletAddress?.slice(0, 6)}...</span>
                      <span>{user.algoBalance?.toFixed(2)} ALGO</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenPayWithAlgo();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-700 text-[11px] font-mono cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#854D0E]" />
                      <span>Manage Algorand Wallet</span>
                    </button>
                    <button
                      onClick={() => {
                        onSignOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-700 flex items-center gap-2 text-[11px] font-mono cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-[#854D0E] px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#854D0E]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-300 transition-colors cursor-pointer"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-neutral-200 bg-[#FAFAF8] scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                isActive ? 'bg-[#854D0E] text-white' : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
