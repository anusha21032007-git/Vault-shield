import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, Copy, Check, Lock } from 'lucide-react';
import { analyzePassword, generateMutations, AnalysisResult } from '../analysis/password-engine';

interface FloatingShieldProps {
  passwordValue: string;
  onApply: (value: string) => void;
}

const FloatingShield: React.FC<FloatingShieldProps> = ({ passwordValue, onApply }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzePassword(passwordValue));
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  useEffect(() => {
    setAnalysis(analyzePassword(passwordValue));
    if (passwordValue.length > 0) {
      setSuggestions(generateMutations(passwordValue));
    }
  }, [passwordValue]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (text: string, index: number) => {
    onApply(text);
    setAppliedIndex(index);
    setTimeout(() => setAppliedIndex(null), 2000);
  };

  const getStrengthColor = () => {
    switch (analysis.strength) {
      case 'Very Secure': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      case 'Strong': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      case 'Moderate': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      default: return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed z-[999999] w-80 font-sans text-slate-200"
      style={{ 
        filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))',
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-500/20 p-1.5">
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">VAULT-SHIELD</span>
          </div>
          <div className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStrengthColor()}`}>
            {analysis.strength}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-700/30">
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Crack Attempts</p>
              <p className="text-sm font-mono font-bold text-white">{analysis.crackAttempts}</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-700/30">
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Randomness</p>
              <p className="text-sm font-mono font-bold text-white">{analysis.entropy} bits</p>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-semibold px-1">Smart Suggestions</p>
              <div className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <div key={i} className="group flex items-center justify-between rounded-lg bg-slate-800/30 p-2 border border-slate-700/20 hover:border-indigo-500/30 transition-colors">
                    <span className="text-xs font-mono text-slate-300 truncate max-w-[140px]">{s}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleCopy(s, i)}
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                        title="Copy"
                      >
                        {copiedIndex === i ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                      </button>
                      <button 
                        onClick={() => handleApply(s, i)}
                        className="flex items-center gap-1 px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-bold transition-colors"
                      >
                        {appliedIndex === i ? 'APPLIED' : 'APPLY'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Info Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-1 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors"
          >
            {isExpanded ? <><ChevronUp className="h-3 w-3" /> LESS INFO</> : <><ChevronDown className="h-3 w-3" /> MORE INFO</>}
          </button>

          {/* Expanded Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4 pt-2"
              >
                <div className="space-y-3">
                  <MetricRow label="Password Randomness" value={analysis.metrics.randomness} desc="Complexity of character distribution" />
                  <MetricRow label="Easy Guess Protection" value={analysis.metrics.guessProtection} desc="Resistance to dictionary attacks" />
                  <MetricRow label="Pattern Safety" value={analysis.metrics.patternSafety} desc="Absence of predictable sequences" />
                  <MetricRow label="Fast Attack Protection" value={analysis.metrics.attackResistance} desc="Resistance to GPU-based cracking" />
                </div>
                
                <div className="rounded-xl bg-indigo-500/5 p-3 border border-indigo-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-3 w-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase">Privacy First</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Passwords never leave your device. All analysis is performed locally within your browser.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const MetricRow = ({ label, value, desc }: { label: string, value: number, desc: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-bold text-slate-300">{label}</span>
      <span className="text-[10px] font-mono text-slate-500">{Math.round(value)}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full rounded-full ${value > 70 ? 'bg-emerald-500' : value > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
      />
    </div>
    <p className="text-[9px] text-slate-500 italic">{desc}</p>
  </div>
);

export default FloatingShield;