import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  Phone,
  Mail,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'FOOD_SAFETY_AUTHORITY'
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('729184');

  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const demoUser: UserProfile = {
        id: `usr-g-${Date.now().toString().slice(-6)}`,
        name: 'Nikhil Tyagi',
        email: 'nikhiltyagi8093@gmail.com',
        role: selectedRole,
        authMethod: 'google',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        algoWalletAddress: 'ALGO7W2K9XN5M4P3Q8T6R1Y2Z9V0B4C7D',
        algoBalance: 35.84,
        verifiedAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('foodguard_user', JSON.stringify(demoUser));
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#CA8A04', '#16A34A', '#2563EB']
        });
      } catch {}

      setLoading(false);
      onLoginSuccess(demoUser);
      onClose();
    }, 1200);
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedDemoOtp(code);
      setOtpSent(true);
      setTimer(30);
      setLoading(false);
    }, 900);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const phoneUser: UserProfile = {
        id: `usr-p-${Date.now().toString().slice(-6)}`,
        name: `Officer ${phoneNumber.slice(-4)}`,
        phoneNumber: `${countryCode} ${phoneNumber}`,
        role: selectedRole,
        authMethod: 'phone',
        algoWalletAddress: 'ALGO9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M',
        algoBalance: 20.00,
        verifiedAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('foodguard_user', JSON.stringify(phoneUser));
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#CA8A04', '#16A34A', '#2563EB']
        });
      } catch {}

      setLoading(false);
      onLoginSuccess(phoneUser);
      onClose();
    }, 1000);
  };

  const handleFillDemoOtp = () => {
    const digits = generatedDemoOtp.split('');
    setOtpCode(digits);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-300 shadow-2xl max-w-md w-full overflow-hidden text-neutral-900 animate-in zoom-in-95 duration-200">
        {/* Header with Dark Yellow Brand Bar */}
        <div className="px-6 py-4 bg-[#FBF8EF] border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center font-black text-sm shadow-xs">
              X
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                Sign In to FoodGuard <span className="text-[#854D0E]">X</span>
              </h3>
              <p className="text-[10px] font-mono text-[#854D0E] uppercase tracking-wider font-bold">
                NATIONAL INTELLIGENCE & BLOCKCHAIN ACCESS
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

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-2 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider font-mono">
          <button
            onClick={() => {
              setAuthMethod('google');
              setError(null);
            }}
            className={`py-2.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMethod === 'google'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign-In</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('phone');
              setError(null);
            }}
            className={`py-2.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#854D0E]" />
            <span>Phone OTP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* Role Selection Badge */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600 flex items-center justify-between">
              <span>Select Access Role:</span>
              <span className="text-[#854D0E] font-bold">FSSAI / Enterprise Profile</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
            >
              <option value="FOOD_SAFETY_AUTHORITY">Food Safety Authority (Full Command)</option>
              <option value="INSPECTOR">Field Food Inspector (Mobile Checklists)</option>
              <option value="MANUFACTURER">Dairy / Food Manufacturer</option>
              <option value="SUPPLIER">Agro Cooperative / Supplier</option>
              <option value="LABORATORY">NABL Certified Testing Lab</option>
              <option value="LOGISTICS">Cold-Chain Fleet Logistics</option>
              <option value="CONSUMER">Citizen & Consumer Advocate</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: GOOGLE SIGN IN */}
          {authMethod === 'google' && (
            <div className="space-y-4 pt-1">
              <div className="p-4 bg-[#FBF8EF] border border-amber-200 rounded-lg text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm border border-neutral-200">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h4 className="font-display font-bold text-sm text-neutral-900">
                  Fast Single-Click Google Authentication
                </h4>
                <p className="text-xs text-neutral-600 font-mono">
                  Sign in instantly with your authorized Google Account. Generates Algorand keypair for verifiable actions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-[#854D0E] font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#854D0E]" />
                    <span>Connecting Google Identity...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* METHOD 2: PHONE NUMBER + OTP */}
          {authMethod === 'phone' && (
            <div className="space-y-4 pt-1">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-24 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded px-2 py-2.5 text-neutral-900 focus:outline-none focus:border-[#854D0E]"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="flex-1 text-sm font-mono tracking-wider bg-neutral-50 border border-neutral-300 rounded px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length < 10}
                    className={`w-full font-black text-xs uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      phoneNumber.length >= 10 && !loading
                        ? 'bg-[#854D0E] hover:bg-[#A16207] text-white shadow-md'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending SMS OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Demo OTP Helper Banner */}
                  <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-md text-xs flex items-center justify-between text-[#78350F] font-mono">
                    <div>
                      <span className="font-bold">Test OTP:</span> <span className="font-black text-sm tracking-widest text-[#854D0E]">{generatedDemoOtp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemoOtp}
                      className="text-[10px] bg-[#854D0E] text-white px-2 py-1 rounded font-bold uppercase tracking-wider hover:bg-[#A16207] transition-colors cursor-pointer"
                    >
                      Auto Fill
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600">
                        Enter 6-Digit Code
                      </label>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Sent to {countryCode} {phoneNumber}
                      </span>
                    </div>

                    <div className="flex justify-between gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-11 h-12 text-center text-lg font-mono font-bold bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-[#854D0E] focus:bg-white"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.join('').length !== 6}
                    className={`w-full font-black text-xs uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      otpCode.join('').length === 6 && !loading
                        ? 'bg-[#854D0E] hover:bg-[#A16207] text-white shadow-md'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Token...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="hover:underline text-neutral-600 cursor-pointer"
                    >
                      Change Number
                    </button>
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        className="text-[#854D0E] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#854D0E]" /> 256-BIT ENCRYPTED
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600" /> FSSAI COMPLIANT
          </span>
        </div>
      </div>
    </div>
  );
};
