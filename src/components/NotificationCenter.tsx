import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, ShieldCheck, Coins, CheckCheck } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'BLOCKCHAIN' | 'X402';
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkView?: string;
  batchId?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'BLOCKCHAIN':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'X402':
        return <Coins className="w-4 h-4 text-amber-300" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#18181C] h-full shadow-2xl border-l border-[#3A3A42] flex flex-col text-gray-100 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-amber-800/40 bg-[#18181C] flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-base uppercase tracking-tight text-gray-100">
              Notification Center
            </h3>
            <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
              REAL-TIME MULTI-AGENT TELEMETRY
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllRead}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> MARK READ
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-500 hover:text-gray-100 hover:bg-[#2A2A30] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#18181C]">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-mono text-xs">
              No active notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#0F0F12] border-[#2A2A30] hover:border-[#3A3A42]'
                    : 'bg-amber-900/20/40 border-amber-600/50 shadow-lg shadow-black/30 hover:bg-amber-900/20/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-xs uppercase tracking-tight text-gray-100 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[9px] font-mono text-gray-500 shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.batchId && (
                      <span className="inline-block mt-2 font-mono text-[9px] font-bold bg-[#252529] text-amber-400 px-1.5 py-0.5 rounded border border-[#3A3A42]">
                        BATCH #{notif.batchId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1F1F24] border-t border-[#2A2A30] text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
            AUTO-STREAMING ORACLE TELEMETRY ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
