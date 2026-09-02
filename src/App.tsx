import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CanonicalDemoModal } from './components/CanonicalDemoModal';
import { GlobalCopilotModal } from './components/GlobalCopilotModal';
import { NotificationCenter, AppNotification } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import { PayWithAlgoModal } from './components/PayWithAlgoModal';

// Views
import { LandingView } from './components/views/LandingView';
import { CommandCenterView } from './components/views/CommandCenterView';
import { FoodDnaView } from './components/views/FoodDnaView';
import { ForecastView } from './components/views/ForecastView';
import { SimulatorView } from './components/views/SimulatorView';
import { InvestigationsView } from './components/views/InvestigationsView';
import { SupplyChainGraphView } from './components/views/SupplyChainGraphView';
import { AnomaliesView } from './components/views/AnomaliesView';
import { InspectionsView } from './components/views/InspectionsView';
import { VisionView } from './components/views/VisionView';
import { LabReportsView } from './components/views/LabReportsView';
import { CitizenNetworkView } from './components/views/CitizenNetworkView';
import { ConsumerScanView } from './components/views/ConsumerScanView';
import { BlockchainView } from './components/views/BlockchainView';
import { X402EconomyView } from './components/views/X402EconomyView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ApiDocsView } from './components/views/ApiDocsView';

import { UserRole, UserProfile, AlgoTransactionRecord } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  
  // Operating Role persistence (remains fixed across sessions)
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('foodguard_operating_role');
      return (savedRole as UserRole) || 'FOOD_SAFETY_AUTHORITY';
    } catch {
      return 'FOOD_SAFETY_AUTHORITY';
    }
  });

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    try {
      localStorage.setItem('foodguard_operating_role', role);
    } catch {}
  };
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [canonicalModalOpen, setCanonicalModalOpen] = useState<boolean>(false);
  const [copilotModalOpen, setCopilotModalOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [payAlgoModalOpen, setPayAlgoModalOpen] = useState<boolean>(false);

  // User Authentication state with localStorage persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('foodguard_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'CRITICAL',
      title: 'Thermal Excursion at Warehouse #17',
      message: 'Batch M492 temperature peaked at 14.8°C (+10.8°C over limit). Microbial doubling active.',
      time: '10m ago',
      read: false,
      batchId: 'M492',
      linkView: 'food-dna'
    },
    {
      id: 'notif-2',
      type: 'WARNING',
      title: 'South Delhi Citizen Cluster',
      message: '23 geocoded souring reports linked to Batch M492 morning distribution.',
      time: '25m ago',
      read: false,
      batchId: 'M492',
      linkView: 'citizen'
    },
    {
      id: 'notif-3',
      type: 'X402',
      title: 'x402 Micro-Settlement Received',
      message: 'HedgeShield Cargo Insurance settled 0.005 USDC for predictive risk intelligence.',
      time: '1h ago',
      read: true,
      linkView: 'x402'
    },
    {
      id: 'notif-4',
      type: 'BLOCKCHAIN',
      title: 'Algorand Passport Round #42918894',
      message: 'Digital seizure order stamped on TestNet with instant finality.',
      time: '2h ago',
      read: true,
      batchId: 'M492',
      linkView: 'blockchain'
    }
  ]);

  // Periodic simulation ticker
  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      // Background simulated tick
    }, 4000);
    return () => clearInterval(interval);
  }, [simRunning]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.linkView) {
      handleNavigate(notif.linkView);
      setNotificationsOpen(false);
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    handleRoleChange(loggedInUser.role);
    setNotifications((prev) => [
      {
        id: `notif-login-${Date.now()}`,
        type: 'BLOCKCHAIN',
        title: `Welcome, ${loggedInUser.name}!`,
        message: `Signed in with ${loggedInUser.authMethod.toUpperCase()}. Algorand Keypair initialized (${loggedInUser.algoBalance} ALGO).`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('foodguard_user');
    } catch {}
  };

  const handlePaymentSuccess = (tx: AlgoTransactionRecord) => {
    setNotifications((prev) => [
      {
        id: `notif-tx-${Date.now()}`,
        type: 'X402',
        title: `ALGO Payment Confirmed #${tx.round}`,
        message: `Settled ${tx.amountAlgo} ALGO for ${tx.purpose}. TxID: ${tx.txId.slice(0, 12)}...`,
        time: 'Just now',
        read: false,
        linkView: 'x402'
      },
      ...prev
    ]);

    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              algoBalance: Math.max(0, (prev.algoBalance || 20) - tx.amountAlgo)
            }
          : null
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A18] selection:bg-amber-100 selection:text-[#78350F]">
      {/* Top Fixed Navigation with White & Dark Yellow Theme */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        simRunning={simRunning}
        onToggleSim={() => setSimRunning(!simRunning)}
        onResetSim={() => setSimRunning(true)}
        onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
        onOpenCopilot={() => setCopilotModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
        user={user}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenPayWithAlgo={() => setPayAlgoModalOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'dashboard' && (
          <CommandCenterView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'food-dna' && (
          <FoodDnaView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'forecast' && (
          <ForecastView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'simulator' && (
          <SimulatorView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'investigations' && (
          <InvestigationsView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'supply-chain' && (
          <SupplyChainGraphView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'anomalies' && (
          <AnomaliesView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'inspections' && (
          <InspectionsView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'vision' && (
          <VisionView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'labs' && (
          <LabReportsView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'citizen' && (
          <CitizenNetworkView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'consumer' && (
          <ConsumerScanView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'blockchain' && (
          <BlockchainView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'x402' && (
          <X402EconomyView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'analytics' && (
          <AnalyticsView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
        {currentView === 'api-docs' && (
          <ApiDocsView
            onNavigate={handleNavigate}
            onOpenCanonicalModal={() => setCanonicalModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sign In Modal (Google & Phone OTP) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={selectedRole}
      />

      {/* Pay with ALGO Modal */}
      <PayWithAlgoModal
        isOpen={payAlgoModalOpen}
        onClose={() => setPayAlgoModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        defaultAmountAlgo={0.05}
        defaultPurpose="x402 AI Intelligence Query Fee (Batch M492)"
      />

      {/* Canonical Hackathon Interactive Walkthrough Modal */}
      <CanonicalDemoModal
        isOpen={canonicalModalOpen}
        onClose={() => setCanonicalModalOpen(false)}
        onNavigateToView={handleNavigate}
      />

      {/* Ask FoodGuard AI Copilot Modal */}
      <GlobalCopilotModal
        isOpen={copilotModalOpen}
        onClose={() => setCopilotModalOpen(false)}
      />

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onSelectNotification={handleSelectNotification}
      />
    </div>
  );
};

export default App;
