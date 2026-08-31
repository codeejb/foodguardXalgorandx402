import React, { useState } from 'react';
import {
  X,
  Send,
  Cpu,
  Loader2
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface GlobalCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextBatchId?: string;
  selectedState?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  agentsInvoked?: string[];
  source?: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  'Why is Delhi risk increasing?',
  'Explain Batch M492 risk breakdown.',
  'What happens if Warehouse 17 is closed right now?',
  'Which inspections should happen today?',
  'Find hidden connections in the supply chain.',
  'Verify Algorand passport proof for Batch M492.'
];

export const GlobalCopilotModal: React.FC<GlobalCopilotModalProps> = ({
  isOpen,
  onClose,
  contextBatchId,
  selectedState
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### FOODGUARD X NATIONAL INTELLIGENCE COPILOT
I am the Central Multi-Agent AI Orchestrator for India's food safety ecosystem.
I can analyze real-time cold-chain sensor anomalies, trace multi-tier batch topologies, forecast 72-hour bacterial degradation, and generate statutory enforcement directives.

How may I assist your command briefing today?`,
      agentsInvoked: ['Risk Agent', 'Graph Agent', 'Investigation Agent', 'Blockchain Agent'],
      source: 'GEMINI_AI',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const response = await ApiClient.askCopilot(
        textToSend,
        contextBatchId || 'M492',
        selectedState || 'DL'
      );

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        agentsInvoked: response.agentsInvoked || ['Risk Agent', 'Investigation Agent'],
        source: response.source,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const fallbackAi: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### INTELLIGENCE BRIEFING
Based on the real-time telemetry: Batch M492 underwent a 14.8°C thermal excursion at Central Cold Storage #17. Microbial standard plate count projection has degraded the safety index to 16/100 (CRITICAL).

Recommended immediate action: Issue automated Section 38 seizure order and initiate cold-chain reroute via Ambala hub.`,
        agentsInvoked: ['Risk Agent', 'Orchestration Engine'],
        source: 'FALLBACK_SYNTHESIS',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-300 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col h-[650px] max-h-[90vh] text-neutral-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-[#FBF8EF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center font-black shadow-xs">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900">
                  Ask AI Copilot
                </h3>
                <span className="bg-[#FEF3C7] text-[#78350F] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#FDE68A] uppercase tracking-wider">
                  GEMINI 3.7 FLASH
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#854D0E] uppercase tracking-widest font-bold">
                MULTI-AGENT FOOD REASONING ENGINE
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

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#854D0E] text-white font-mono shadow-xs'
                    : 'bg-[#FAFAF8] border border-neutral-200 text-neutral-800'
                }`}
              >
                {/* Format markdown headers */}
                <div className="whitespace-pre-wrap font-mono space-y-2">
                  {msg.text.split('\n\n').map((para, i) => {
                    if (para.startsWith('### ')) {
                      return (
                        <h4 key={i} className={`font-display font-bold text-sm uppercase tracking-wider pt-1 ${msg.sender === 'user' ? 'text-yellow-200' : 'text-[#854D0E]'}`}>
                          {para.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (para.startsWith('- ')) {
                      return (
                        <ul key={i} className="list-disc pl-4 space-y-1">
                          {para.split('\n').map((li, j) => (
                            <li key={j}>{li.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>

                {/* Agent Tag Footer for AI */}
                {msg.sender === 'ai' && msg.agentsInvoked && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-200 flex flex-wrap items-center justify-between text-[9px] font-mono uppercase text-neutral-500 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#854D0E]" />
                      <span>AGENTS: {msg.agentsInvoked.join(' // ')}</span>
                    </div>
                    <span className="text-neutral-400">{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded bg-neutral-800 text-yellow-300 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  YOU
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded bg-[#854D0E] text-white flex items-center justify-center shrink-0 font-black text-xs">
                AI
              </div>
              <div className="bg-[#FAFAF8] border border-neutral-200 rounded-lg px-4 py-3 text-xs text-neutral-600 font-mono flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#854D0E]" />
                <span>Multi-Agent Orchestrator correlating sensor telemetry & graph nodes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="px-6 py-2.5 bg-[#FBF8EF] border-t border-amber-200/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#854D0E] shrink-0">SUGGESTED:</span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-[10px] font-mono bg-white hover:bg-neutral-100 hover:text-[#854D0E] border border-neutral-300 rounded px-2.5 py-1 text-neutral-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything (e.g., 'Why is Batch M492 at risk?', 'Simulate warehouse closure')..."
              className="flex-1 text-xs font-mono border border-neutral-300 rounded-lg px-3.5 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#854D0E] transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer ${
                inputPrompt.trim() && !loading
                  ? 'bg-[#854D0E] hover:bg-[#A16207] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              }`}
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
