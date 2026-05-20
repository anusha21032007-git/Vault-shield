import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Lock, AlertTriangle, Activity, Cpu, ShieldAlert, ShieldCheck, HelpCircle, Check } from 'lucide-react';
import { analyzePassword, generateMutations, AnalysisResult } from '../analysis/password-engine';

interface FloatingAssistantProps {
  passwordValue: string;
  onApply: (value: string) => void;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ passwordValue, onApply }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzePassword(passwordValue));
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debouncedAnalysis = setTimeout(() => {
      setAnalysis(analyzePassword(passwordValue));
      if (passwordValue.length > 0) {
        setSuggestions(generateMutations(passwordValue));
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(debouncedAnalysis);
  }, [passwordValue]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleApply = (text: string, index: number) => {
    onApply(text);
    setAppliedIndex(index);
    setTimeout(() => {
      setAppliedIndex(null);
      setIsOpen(false);
    }, 1500);
  };

  // Determine color scheme based on strength
  const getStrengthConfig = () => {
    switch (analysis.strength) {
      case 'Fortified':
        return {
          color: 'text-cyan-400',
          bg: 'bg-cyan-500',
          glow: 'shadow-[0_0_12px_rgba(34,211,238,0.8)]',
          border: 'border-cyan-500/30',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          pulse: 'bg-cyan-400/40'
        };
      case 'Secure':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500',
          glow: 'shadow-[0_0_10px_rgba(52,211,153,0.7)]',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          pulse: 'bg-emerald-400/40'
        };
      case 'Risky':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-500',
          glow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          pulse: 'bg-amber-400/40'
        };
      default:
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500',
          glow: 'shadow-[0_0_10px_rgba(244,63,94,0.6)]',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          pulse: 'bg-rose-500/40'
        };
    }
  };

  const config = getStrengthConfig();

  return (
    <div ref={containerRef} className="relative font-sans text-slate-200 pointer-events-auto select-none">
      {/* Minimal Glowing Security Circle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="relative flex h-4.5 w-4.5 items-center justify-center rounded-full focus:outline-none transition-transform duration-300 hover:scale-110"
          title="Vault-Shield Security Status"
        >
          {/* Outer Pulse Aura */}
          <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 duration-1000 ${config.pulse}`} />
          
          {/* Inner Glowing Core */}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-all duration-500 ${config.bg} ${config.glow}`} />
        </button>
      </div>

      {/* Compact Intelligent Analyzer Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-[999999]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-900 bg-slate-900/20">
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${config.color}`} />
                <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">VAULT-SHIELD</span>
              </div>
              <div className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${config.badge}`}>
                {analysis.strength}
              </div>
            </div>

            <div className="p-3.5 space-y-3.5">
              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className="space-y-1">
                  {analysis.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] text-rose-400 bg-rose-500/5 p-1.5 rounded-lg border border-rose-500/10">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span className="font-medium truncate">{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Smart Mutations */}
              {suggestions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Intelligent Mutations</p>
                  <div className="space-y-1.5">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-slate-900/50 p-2 border border-slate-900 hover:border-slate-800 transition-all">
                        <span className="text-xs font-mono text-slate-300 truncate max-w-[160px]">{s}</span>
                        <button
                          onClick={() => handleApply(s, i)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-bold transition-all ${
                            appliedIndex === i 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                          }`}
                        >
                          {appliedIndex === i ? (
                            <><Check className="h-2.5 w-2.5" /> APPLIED</>
                          ) : (
                            <><Sparkles className="h-2.5 w-2.5" /> APPLY</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threat Simulation & Attack Exposure */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-900/30 p-2 border border-slate-900">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <Cpu className="h-2.5 w-2.5 text-slate-400" /> Crack Time
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate">{analysis.crackAttempts}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/30 p-2 border border-slate-900">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <Activity className="h-2.5 w-2.5 text-slate-400" /> Entropy
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-200">{analysis.entropy} bits</p>
                  </div>
                </div>

                {/* Attack Exposure List */}
                <div className="space-y-1">
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Attack Vector Exposure</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {analysis.threats.slice(0, 4).map((threat, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-900/20 border border-slate-900/50">
                        <span className="text-[9px] text-slate-400 truncate max-w-[90px]">{threat.label}</span>
                        <span className={`text-[8px] font-bold px-1 rounded ${
                          threat.status === 'Highly Resistant' ? 'text-emerald-400 bg-emerald-500/5' :
                          threat.status === 'Resistant' ? 'text-cyan-400 bg-cyan-500/5' :
                          threat.status === 'Moderate' ? 'text-amber-400 bg-amber-500/5' : 'text-rose-400 bg-rose-500/5'
                        }`}>
                          {threat.status === 'Highly Resistant' ? 'Safe' : threat.status === 'Resistant' ? 'Low' : threat.status === 'Moderate' ? 'Med' : 'High'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-1.5 text-[8px] text-slate-500 pt-1.5 border-t border-slate-900">
                <Lock className="h-2.5 w-2.5 text-slate-400" />
                <span>Local analysis. No data is transmitted.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAssistant;