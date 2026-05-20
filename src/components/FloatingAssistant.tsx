"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Lock, AlertTriangle, Check, X, ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import { PasswordMutationEngine, MutationCategory } from '../utils/PasswordMutationEngine';
import { MemorabilityEngine, MemorabilityMetrics } from '../utils/MemorabilityEngine';
import { ThreatSimulationEngine, ThreatGuess } from '../utils/ThreatSimulationEngine';
import { SimilarityDetectionEngine } from '../utils/SimilarityDetectionEngine';
import { BreachPatternEngine } from '../utils/BreachPatternEngine';
import { PasswordHeatmap } from './PasswordHeatmap';
import { EvolutionTimeline } from './EvolutionTimeline';
import { AttackerSimulation } from './AttackerSimulation';

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
    // Instantly update local analysis and suggestions to avoid any lag/desync
    const newMetrics = MemorabilityEngine.analyze(text);
    setMetrics(newMetrics);
    setSuggestions(PasswordMutationEngine.generate(text));
    setAppliedIndex(index);
    
    // Call parent apply handler to update the actual DOM input
    onApply(text);

    setTimeout(() => {
      setAppliedIndex(null);
    }, 1500);
  };

  // Determine color scheme based on strength
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
      case 'High Resistance':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500',
          glow: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]',
          border: 'border-emerald-500/20',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          pulse: 'bg-emerald-400/20'
        };
      case 'Strongly Balanced':
        return {
          color: 'text-cyan-400',
          bg: 'bg-cyan-500',
          glow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
          border: 'border-cyan-500/20',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          pulse: 'bg-cyan-400/20'
        };
      case 'Unsafe Structure':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-500',
          glow: 'shadow-[0_0_10px_rgba(251,191,36,0.4)]',
          border: 'border-amber-500/20',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          pulse: 'bg-amber-400/20'
        };
      default:
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500',
          glow: 'shadow-[0_0_10px_rgba(244,63,94,0.4)]',
          border: 'border-rose-500/20',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          pulse: 'bg-rose-500/20'
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
          className="relative flex h-5 w-5 items-center justify-center rounded-full focus:outline-none transition-transform duration-300 hover:scale-110"
          title="Vault-Shield Security Status"
        >
          {/* Outer Pulse Aura */}
          <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 duration-1000 ${config.pulse}`} />
          
          {/* Inner Glowing Core */}
          <span className={`relative inline-flex rounded-full h-3 w-3 transition-all duration-500 ${config.bg} ${config.glow}`} />
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
            <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-900/20">
              <div className="flex items-center gap-2">
                <Shield className={`h-4.5 w-4.5 ${config.color}`} />
                <span className="text-xs font-bold tracking-wider text-slate-300">Vault-Shield</span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassword && (
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${config.badge}`}>
                    {metrics.label}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1 hover:bg-slate-800/50 rounded-lg text-slate-500 hover:text-slate-300 transition-all"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto scrollbar-thin">
              {!hasPassword ? (
                <div className="py-6 text-center space-y-3">
                  <Lock className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-slate-300">Ready to Analyze</p>
                  <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                    Type at least 1 character to begin real-time security analysis.
                  </p>
                </div>
              ) : (
                <>
                  {/* Current Password Display */}
                  <div className="space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Password</p>
                    <p className="text-xs font-mono text-indigo-300 truncate select-all">{passwordValue}</p>
                  </div>

                  {/* Warnings */}
                  {isBreached && (
                    <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/10">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">This pattern appears frequently in breach datasets.</span>
                    </div>
                  )}

                  {similarityWarning && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{similarityWarning}</span>
                    </div>
                  )}

                  {/* Password Structure Heatmap */}
                  <PasswordHeatmap passwordValue={passwordValue} />

                  {/* Memorability Intelligence System */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-slate-400">Memorability Intelligence</p>
                    <div className="grid grid-cols-2 gap-2">
                      <MetricCard label="Security Score" value={metrics.securityScore} />
                      <MetricCard label="Memorability" value={metrics.memorabilityScore} />
                      <MetricCard label="Predictability Resistance" value={metrics.predictabilityResistance} />
                      <MetricCard label="Entropy Score" value={metrics.entropyScore} />
                    </div>
                  </div>

                  {/* Suggested Passwords */}
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium text-slate-400">Suggested passwords</p>
                      <div className="space-y-2">
                        {suggestions.map((s, i) => (
                          <div key={i} className="group flex flex-col gap-1.5 rounded-xl bg-slate-900/50 p-3 border border-slate-800/60 hover:border-slate-700 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-slate-200 truncate max-w-[160px]">{s.password}</span>
                              <button
                                onClick={() => handleApply(s.password, i)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  appliedIndex === i 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                                }`}
                              >
                                {appliedIndex === i ? (
                                  <><Check className="h-3 w-3" /> Applied ✓</>
                                ) : (
                                  <><Sparkles className="h-3 w-3" /> Apply</>
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{s.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evolution Timeline */}
                  <EvolutionTimeline original={passwordValue} mutations={suggestions.map(s => s.password)} />

                  {/* Attacker Simulation Panel */}
                  <AttackerSimulation guesses={guesses} />
                </>
              )}

              {/* Local Privacy Trust Layer */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-3 border-t border-slate-900">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>100% Local Analysis. Your passwords never leave your browser.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/60 space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
      <span className="text-[10px] font-mono font-bold text-slate-300">{value}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${
          value > 75 ? 'bg-emerald-500' : value > 45 ? 'bg-amber-500' : 'bg-rose-500'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default FloatingAssistant;