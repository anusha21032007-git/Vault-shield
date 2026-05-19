import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, ChevronDown, ChevronUp, Copy, Check, Sparkles, Lock, Info } from 'lucide-react';
import { analyzePassword, mutatePassword, AnalysisResult } from '../analysis/password-engine';

interface FloatingAssistantProps {
  passwordValue: string;
  onApply: (value: string) => void;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ passwordValue, onApply }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzePassword(passwordValue));
  const [mutations, setMutations] = useState(mutatePassword(passwordValue));
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<string | null>(null);

  useEffect(() => {
    setAnalysis(analyzePassword(passwordValue));
    setMutations(mutatePassword(passwordValue));
  }, [passwordValue]);

  const handleApply = (text: string, key: string) => {
    onApply(text);
    setAppliedIndex(key);
    setTimeout(() => setAppliedIndex(null), 2000);
  };

  const getStrengthColor = () => {
    switch (analysis.strength) {
      case 'Fortified': return 'bg-emerald-500';
      case 'Secure': return 'bg-blue-500';
      case 'Risky': return 'bg-amber-500';
      default: return 'bg-rose-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-72 font-sans text-slate-200 pointer-events-auto"
    >
      <div className="overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950/90 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.2)]">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className="h-4 w-4 text-indigo-400" />
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-indigo-400 blur-sm rounded-full" 
              />
            </div>
            <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">Vault-Shield</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(analysis.score + 1) * 20}%` }}
                className={`h-full ${getStrengthColor()}`} 
              />
            </div>
            <span className="text-[9px] font-bold uppercase text-slate-400">{analysis.strength}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 space-y-3">
          <div className="flex items-start gap-2">
            <Zap className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {analysis.score < 3 ? "Intelligence detected vulnerabilities. Evolve your password below." : "Fortress secured. Your password meets elite standards."}
            </p>
          </div>

          {/* Mutation Suggestions */}
          {passwordValue.length > 0 && (
            <div className="space-y-1.5">
              <SuggestionRow 
                label="Balanced" 
                value={mutations.balanced} 
                isApplied={appliedIndex === 'balanced'}
                onApply={() => handleApply(mutations.balanced, 'balanced')} 
              />
              <SuggestionRow 
                label="Cyber" 
                value={mutations.cyber} 
                isApplied={appliedIndex === 'cyber'}
                onApply={() => handleApply(mutations.cyber, 'cyber')} 
              />
            </div>
          )}

          {/* Expand Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-1 py-1 text-[9px] font-bold text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {isExpanded ? <><ChevronUp className="h-3 w-3" /> COMPACT VIEW</> : <><ChevronDown className="h-3 w-3" /> ANALYZE MORE</>}
          </button>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3 pt-2 border-t border-slate-800/50"
              >
                <MetricBar label="Randomness" value={analysis.metrics.randomness} />
                <MetricBar label="Guess Protection" value={analysis.metrics.guessProtection} />
                <MetricBar label="Pattern Safety" value={analysis.metrics.patternSafety} />
                
                <div className="rounded-lg bg-indigo-500/5 p-2 border border-indigo-500/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lock className="h-2.5 w-2.5 text-indigo-400" />
                    <span className="text-[8px] font-bold text-indigo-300 uppercase">Local Intelligence</span>
                  </div>
                  <p className="text-[8px] text-slate-500">Passwords never leave your device. Analysis is 100% offline.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const SuggestionRow = ({ label, value, onApply, isApplied }: { label: string, value: string, onApply: () => void, isApplied: boolean }) => (
  <div className="group flex items-center justify-between rounded-lg bg-slate-900/50 p-2 border border-slate-800 hover:border-indigo-500/30 transition-all">
    <div className="flex flex-col">
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
      <span className="text-[10px] font-mono text-slate-300 truncate max-w-[140px]">{value}</span>
    </div>
    <button 
      onClick={onApply}
      className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-all ${isApplied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'}`}
    >
      {isApplied ? <Check className="h-2.5 w-2.5" /> : <Sparkles className="h-2.5 w-2.5" />}
      {isApplied ? 'APPLIED' : 'APPLY'}
    </button>
  </div>
);

const MetricBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-bold uppercase tracking-tighter">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-500">{Math.round(value)}%</span>
    </div>
    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${value > 70 ? 'bg-emerald-500' : value > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
      />
    </div>
  </div>
);

export default FloatingAssistant;