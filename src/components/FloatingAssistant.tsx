"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Lock, AlertTriangle, Check, X, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { PasswordMutationEngine, MutationCategory } from '../utils/PasswordMutationEngine';
import { MemorabilityEngine, MemorabilityMetrics } from '../utils/MemorabilityEngine';
import { ThreatSimulationEngine, ThreatGuess } from '../utils/ThreatSimulationEngine';
import { SimilarityDetectionEngine } from '../utils/SimilarityDetectionEngine';
import { BreachPatternEngine } from '../utils/BreachPatternEngine';

interface FloatingAssistantProps {
  passwordValue: string;
  onApply: (value: string) => void;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ passwordValue, onApply }) => {
  const [metrics, setMetrics] = useState<MemorabilityMetrics>(MemorabilityEngine.analyze(passwordValue));
  const [suggestions, setSuggestions] = useState<MutationCategory[]>([]);
  const [guesses, setGuesses] = useState<ThreatGuess[]>([]);
  const [isBreached, setIsBreached] = useState(false);
  const [similarityWarning, setSimilarityWarning] = useState<string | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPassword = passwordValue.length > 0;

  useEffect(() => {
    const debouncedAnalysis = setTimeout(() => {
      const newMetrics = MemorabilityEngine.analyze(passwordValue);
      setMetrics(newMetrics);
      
      if (hasPassword) {
        setSuggestions(PasswordMutationEngine.generate(passwordValue));
        setGuesses(ThreatSimulationEngine.simulate(passwordValue));
        setIsBreached(BreachPatternEngine.checkBreach(passwordValue));
        
        const simCheck = SimilarityDetectionEngine.checkSimilarity(passwordValue);
        setSimilarityWarning(simCheck.warning || null);
      } else {
        setSuggestions([]);
        setGuesses([]);
        setIsBreached(false);
        setSimilarityWarning(null);
      }
    }, 100);

    return () => clearTimeout(debouncedAnalysis);
  }, [passwordValue, hasPassword]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const path = e.composedPath ? e.composedPath() : [];
      if (!containerRef.current.contains(e.target as Node) && !path.includes(containerRef.current)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleApply = (text: string, index: number) => {
    const newMetrics = MemorabilityEngine.analyze(text);
    setMetrics(newMetrics);
    setSuggestions(PasswordMutationEngine.generate(text));
    setAppliedIndex(index);
    
    onApply(text);

    setTimeout(() => {
      setAppliedIndex(null);
    }, 1500);
  };

  const getStrengthConfig = () => {
    if (!hasPassword) {
      return {
        color: 'text-slate-400',
        bg: 'bg-slate-500',
        glow: 'shadow-[0_0_8px_rgba(148,163,184,0.3)]',
        border: 'border-slate-800',
        badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        pulse: 'bg-slate-400/10'
      };
    }

    switch (metrics.label) {
      case 'Strong':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500',
          glow: 'shadow-[0_0_12px_rgba(52,211,153,0.6)]',
          border: 'border-emerald-500/20',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          pulse: 'bg-emerald-400/20'
        };
      case 'Balanced':
        return {
          color: 'text-cyan-400',
          bg: 'bg-cyan-500',
          glow: 'shadow-[0_0_12px_rgba(34,211,238,0.6)]',
          border: 'border-cyan-500/20',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          pulse: 'bg-cyan-400/20'
        };
      default:
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]',
          border: 'border-rose-500/20',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          pulse: 'bg-rose-500/20'
        };
    }
  };

  const config = getStrengthConfig();
  const topSuggestions = suggestions.slice(0, 2);

  return (
    <div 
      ref={containerRef} 
      className="relative font-sans text-slate-200 pointer-events-auto select-none"
      onMouseDown={(e) => e.preventDefault()}
    >
      
      {/* Minimal Health Dot Indicator */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-5 w-5 items-center justify-center rounded-full focus:outline-none transition-transform duration-300 hover:scale-110"
          title="Vault-Shield Status Indicator"
        >
          <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 duration-1000 ${config.pulse}`} />
          <span className={`relative inline-flex rounded-full h-3 w-3 transition-all duration-500 ${config.bg} ${config.glow}`} />
        </button>
      </div>

      {/* Premium Spring Animated Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute left-0 mt-2.5 w-80 h-[420px] flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.65)] z-[999999]"
          >
            {/* Elegant Header with Simple Confidence Indicator */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-900 bg-slate-900/10 shrink-0">
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${config.color} transition-colors duration-500`} />
                <span className="text-xs font-bold text-slate-300 tracking-tight">Vault-Shield Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassword && (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize transition-all duration-500 ${config.badge}`}
                  >
                    {metrics.label} Password
                  </motion.div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-300 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Workspace */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {!hasPassword ? (
                <div className="py-6 text-center space-y-2.5">
                  <div className="h-10 w-10 rounded-full bg-slate-900/60 flex items-center justify-center mx-auto border border-slate-800/60">
                    <Lock className="h-4 w-4 text-slate-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">Ready to Assist</p>
                  <p className="text-[10px] text-slate-500 max-w-[210px] mx-auto leading-relaxed">
                    Type a password to instantly generate a strengthened, familiar alternative.
                  </p>
                </div>
              ) : (
                <>
                  {/* Subtle Breach Banner with Human Language */}
                  {isBreached && (
                    <div className="flex items-center gap-2 text-[10px] text-rose-400 bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/10 animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">This common pattern was found in database leaks.</span>
                    </div>
                  )}

                  {/* Single Existing Password Display Mentioned ONCE At the Top */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 text-[10px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[9px] text-slate-500">existing password</span>
                    <span className="font-mono font-bold text-slate-300 select-all tracking-wide truncate max-w-[180px]">{passwordValue}</span>
                  </div>

                  {/* Suggestion Cards */}
                  {topSuggestions.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Suggested Evolutions</span>
                        {/* Interactive Password Feel Indicator */}
                        <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                          <span>✓ Familiar</span>
                          <span className="text-slate-700">•</span>
                          <span>✓ Secure</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {topSuggestions.map((s, i) => {
                          const isApplied = appliedIndex === i;
                          return (
                            <motion.div 
                              key={i} 
                              layout
                              className={`group flex flex-col gap-2 rounded-xl p-3 border transition-all ${
                                isApplied 
                                  ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <span className="text-xs font-mono font-bold text-slate-200 select-all tracking-wide truncate flex-1 text-left">{s.password}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleApply(s.password, i);
                                  }}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                                    isApplied 
                                      ? 'bg-emerald-500/20 text-emerald-300' 
                                      : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                                  }`}
                                >
                                  {isApplied ? (
                                    <><Check className="h-3 w-3 animate-bounce" /> Applied ✓</>
                                  ) : (
                                    <><Sparkles className="h-3 w-3" /> Apply</>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* More Insights Disclosure */}
                  <button
                    type="button"
                    onClick={() => setShowInsights(!showInsights)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-800 bg-slate-900/10 text-[10px] font-bold text-slate-400 hover:text-slate-200 hover:border-slate-700/80 transition-all"
                  >
                    {showInsights ? (
                      <>Hide analytics <ChevronUp className="h-3.5 w-3.5" /></>
                    ) : (
                      <>Show detailed insights <ChevronDown className="h-3.5 w-3.5" /></>
                    )}
                  </button>

                  {/* Progressive Disclosure Panel with Soft Spring Height */}
                  <AnimatePresence>
                    {showInsights && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="overflow-hidden pt-2 border-t border-slate-900/60 space-y-4"
                      >

                        {/* Confidence Metric Rows */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Metrics</p>
                          <div className="grid grid-cols-2 gap-2">
                            <InsightCard 
                              label="Memory Confidence" 
                              value={metrics.memoryConfidence} 
                              description="Natural recall ease" 
                              color={metrics.memorabilityScore > 60 ? 'text-cyan-400' : metrics.memorabilityScore > 40 ? 'text-amber-400' : 'text-rose-400'}
                              icon={Sparkles}
                            />
                            <InsightCard 
                              label="Guess Difficulty" 
                              value={metrics.guessDifficulty} 
                              description="Cracking resistance" 
                              color={metrics.securityScore > 60 ? 'text-emerald-400' : metrics.securityScore > 40 ? 'text-amber-400' : 'text-rose-400'}
                              icon={ShieldCheck}
                            />
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Local Privacy Layer */}
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 pt-3 border-t border-slate-900">
                <Lock className="h-3 w-3 text-slate-400" />
                <span>100% Local Analysis. Nothing leaves your browser.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InsightCard = ({ label, value, description, color, icon: Icon }: any) => (
  <div className="rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/60 flex flex-col gap-1 transition-all hover:bg-slate-900/50">
    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
      <Icon className={`h-3 w-3 ${color}`} />
      {label}
    </div>
    <div className={`font-mono text-xs font-bold tracking-tight ${color}`}>
      {value}
    </div>
    <p className="text-[8px] text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default FloatingAssistant;