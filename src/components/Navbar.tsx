import React, { useState } from 'react';
import {
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
  LogOut,
  LogIn,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Command Center' },
    { id: 'food-dna', label: 'Food DNA' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'anomalies', label: 'Anomalies' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'inspections', label: 'Inspections' },
    { id: 'investigations', label: 'Investigations' },
    { id: 'labs', label: 'Lab Reports' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'supply-chain', label: 'Supply Chain' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'citizen', label: 'Citizen' },
    { id: 'consumer', label: 'Consumer' }
  ];

  return (
    <header className="sticky top-0 z-50 animate-slide-down">
      {/* Status Bar */}
      <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#1A1A24]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Live</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-amber-400" />
                Gemini 3.7 Flash
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* IoT Sim Toggle */}
            <div className="flex items-center gap-2 bg-[#12121A] border border-[#1A1A24] rounded-lg px-3 py-1.5">
              <span className="text-[10px] font-mono text-gray-500">IoT Sim</span>
              <button
                onClick={onToggleSim}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded flex items-center gap-1 transition-all cursor-pointer ${
                  simRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1A1A24] text-gray-500'
                }`}
              >
                {simRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                {simRunning ? 'Live' : 'Paused'}
              </button>
              <button
                onClick={onResetSim}
                className="p-1 text-gray-600 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Canonical Demo */}
            <button
              onClick={onOpenCanonicalModal}
              className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0A0A0F] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
            >
              <Sparkles className="w-3 h-3" />
              <span>Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#1A1A24]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-6">
          {/* Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="relative">
              <img src="/foodguardx-logo.png" alt="FoodGuardX" className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-base text-gray-100 tracking-tight">
                FoodGuard<span className="text-amber-400">X</span>
              </span>
              <span className="block text-[9px] text-gray-500 font-mono tracking-wider uppercase">
                AI Safety Intelligence
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
            {navItems.map((item, idx) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer will-animate animate-fade-in ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1A24]'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AI Copilot */}
            <button
              onClick={onOpenCopilot}
              className="hidden md:flex items-center gap-1.5 bg-[#12121A] hover:bg-[#1A1A24] text-gray-300 border border-[#1A1A24] hover:border-[#2A2A35] px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Copilot</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 bg-[#12121A] hover:bg-[#1A1A24] text-gray-300 border border-[#1A1A24] hover:border-[#2A2A35] px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline max-w-[100px] truncate">
                  {ROLES.find((r) => r.id === selectedRole)?.label}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#12121A] border border-[#2A2A35] rounded-xl shadow-2xl shadow-black/50 py-1.5 z-50 animate-pop">
                  <div className="px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b border-[#1A1A24]">
                    Select Role
                  </div>
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-[#1A1A24] transition-colors text-xs font-medium ${
                        selectedRole === r.id ? 'text-amber-400 bg-amber-500/10' : 'text-gray-300'
                      }`}
                    >
                      <span>{r.label}</span>
                      {selectedRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-[#12121A] border border-[#1A1A24] hover:border-amber-500/40 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-[#0A0A0F] flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#12121A] border border-[#2A2A35] rounded-xl shadow-2xl shadow-black/50 py-2 z-50 animate-pop">
                    <div className="px-3 py-2 border-b border-[#1A1A24]">
                      <div className="font-semibold text-gray-100 text-sm">{user.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{user.email || user.phoneNumber}</div>
                      <div className="flex items-center justify-between text-[10px] font-mono mt-2 text-amber-400">
                        <span>{user.algoWalletAddress?.slice(0, 6)}...</span>
                        <span>{user.algoBalance?.toFixed(2)} ALGO</span>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { onOpenPayWithAlgo(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#1A1A24] flex items-center gap-2 text-gray-300 text-xs cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>Manage Wallet</span>
                      </button>
                      <button
                        onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-red-500/10 flex items-center gap-2 text-red-400 text-xs cursor-pointer"
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
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0A0A0F] px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg hover:bg-[#1A1A24] text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-[#0A0A0F] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pop">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#1A1A24] text-gray-400 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0F] border-b border-[#1A1A24] animate-slide-down">
          <div className="px-4 py-3 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:bg-[#1A1A24]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
