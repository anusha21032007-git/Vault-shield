import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, ChevronDown, ChevronUp, Sparkles, Lock, AlertTriangle, Activity, Cpu, Target } from 'lucide-react';
import { analyzePassword, generateMutations, AnalysisResult } from '../analysis/password-engine';

interface FloatingAssistantProps {
  passwordValue: string;
  onApply: (value: string) => void;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ passwordValue, onApply }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzePassword(passwordValue));
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  useEffect(() => {
    setAnalysis(analyzePassword(passwordValue));
    if (passwordValue.length > 0) {
      setSuggestions(generateMutations(passwordValue));
    } else {
      setSuggestions([]);
    }
  }, [passwordValue]);

  const handleApply = (text: string, index: number) => {
    onApply(text);
    setAppliedIndex(index);
    setTimeout(() => setAppliedIndex(null), 2000);
  };

  const getStrengthColor = () => {
    switch (analysis.strength) {
      case 'Fortified': return 'text-emerald-400';
      case 'Secure': return 'text-blue-400';
      case 'Risky': return 'text-amber-400';
      default: return 'text-rose-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-80 font-sans text-slate-200 pointer-events-auto"
    >
      <div className="overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(79,70,229,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-indigo-500/5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className="h-5 w-5 text-indigo-400" />
              <motion.div 
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-indigo-400 blur-md rounded-full" 
              />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase">VAULT-SHIELD</span>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-current ${getStrengthColor()}`}>
            {analysis.strength}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Brute Force Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-900/50 p-3 border border-slate-800">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                <Cpu className="h-3 w-3" /> Crack Attempts
              </p>
              <p className="text-sm font-mono font-bold text-white truncate">{analysis.crackAttempts}</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-3 border border-slate-800">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                <Activity className="h-3 w-3" /> Entropy
              </p>
              <p className="text-sm font-mono font-bold text-white">{analysis.entropy} bits</p>
            </div>
          </div>

          {/* Warnings */}
          <AnimatePresence>
            {analysis.warnings.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                {analysis.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="font-medium">{w}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest px-1">Personalized Mutations</p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="group flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 hover:border-indigo-500/40 transition-all">
                    <span className="text-xs font-mono text-slate-300 truncate max-w-[160px]">{s}</span>
                    <button 
                      onClick={() => handleApply(s, i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${appliedIndex === i ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'}`}
                    >
                      {appliedIndex === i ? 'APPLIED' : <><Sparkles className="h-3 w-3" /> APPLY</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expand Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-2 py-2 text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-colors border-t border-slate-800/50"
          >
            {isExpanded ? <><ChevronUp className="h-4 w-4" /> COMPACT VIEW</> : <><ChevronDown className="h-4 w-4" /> THREAT SIMULATION</>}
          </button>

          {/* Expanded Threat Simulation */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4 pt-2"
              >
                <div className="grid grid-cols-1 gap-2">
                  {analysis.threats.map((threat, i) => (
                    <ThreatCard key={i} threat={threat} />
                  ))}
                </div>
                
                <div className="rounded-xl bg-indigo-500/5 p-3 border border-indigo-500/10 flex items-start gap-3">
                  <Lock className="h-4 w-4 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Local Intelligence</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">
                      All simulations are performed locally. Your password data never leaves this session.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ThreatCard = ({ threat }: { threat: any }) => (
  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
        <Target className="h-3 w-3 text-indigo-500" /> {threat.label}
      </span>
      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
        threat.status === 'Highly Resistant' ? 'text-emerald-400 bg-emerald-500/10' :
        threat.status === 'Resistant' ? 'text-blue-400 bg-blue-500/10' :
        threat.status === 'Moderate' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
      }`}>
        {threat.status}
      </span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${threat.risk}%` }}
        className={`h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
          threat.risk > 80 ? 'bg-emerald-500' : 
          threat.risk > 60 ? 'bg-blue-500' : 
          threat.risk > 30 ? 'bg-amber-500' : 'bg-rose-500'
        }`}
      />
    </div>
  </div>
);

export default FloatingAssistant;