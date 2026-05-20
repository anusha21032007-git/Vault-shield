"use client";

import React from 'react';

interface PasswordHeatmapProps {
  passwordValue: string;
}

export const PasswordHeatmap: React.FC<PasswordHeatmapProps> = ({ passwordValue }) => {
  if (!passwordValue) return null;

  const chars = passwordValue.split('');

  const getCharAnalysis = (char: string, index: number) => {
    // Simple heuristic for predictable zones
    if (/[a-zA-Z]/.test(char)) {
      // Check if part of a common sequence
      const isCommon = passwordValue.toLowerCase().includes('qwerty') || passwordValue.toLowerCase().includes('abc');
      return {
        isPredictable: isCommon || index < 3,
        label: isCommon ? 'Common sequence' : index < 3 ? 'Predictable anchor' : 'Standard character'
      };
    }
    if (/\d/.test(char)) {
      return {
        isPredictable: true,
        label: 'Predictable digit'
      };
    }
    return {
      isPredictable: false,
      label: 'Entropy symbol'
    };
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-slate-400">Password Structure Heatmap</p>
      <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
        {chars.map((char, index) => {
          const analysis = getCharAnalysis(char, index);
          return (
            <div
              key={index}
              className={`group relative flex flex-col items-center justify-center w-7 h-9 rounded-lg border text-sm font-mono font-bold transition-all ${
                analysis.isPredictable
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {char}
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-60" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950 text-slate-200 text-[9px] font-sans font-medium px-2 py-1 rounded-md border border-slate-800 shadow-xl whitespace-nowrap">
                  {analysis.label}
                </div>
                <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 transform rotate-45 -mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};