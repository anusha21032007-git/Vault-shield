"use client";

import React from 'react';

interface StructureComparisonProps {
  original: string;
  improved: string;
}

export const StructureComparison: React.FC<StructureComparisonProps> = ({ original, improved }) => {
  if (!original || !improved) return null;

  // Let's analyze and render characters with beautiful highlighted attributes
  const renderHighlightedChars = (str: string, orig: string) => {
    const origLower = orig.toLowerCase();
    
    return str.split('').map((char, index) => {
      // Find if character is changed, a newly inserted symbol, or newly capitalized
      const origChar = orig[index];
      const isSymbol = /[^a-zA-Z0-9]/.test(char);
      const isDigit = /\d/.test(char);
      
      let highlightClass = "text-slate-300";
      let tooltip = "Original pattern";

      if (!origChar) {
        // This is an added suffix/character
        highlightClass = "text-indigo-400 font-extrabold bg-indigo-500/10 px-0.5 rounded";
        tooltip = "Added protection";
      } else if (origChar !== char) {
        if (origChar.toLowerCase() === char.toLowerCase()) {
          // Capitalization shift
          highlightClass = "text-emerald-400 font-bold bg-emerald-500/10 px-0.5 rounded";
          tooltip = "Capitalization shift";
        } else {
          // Symbol substitution/relocation
          highlightClass = "text-cyan-400 font-bold bg-cyan-500/10 px-0.5 rounded";
          tooltip = "Entropy shield";
        }
      } else if (isSymbol) {
        highlightClass = "text-amber-400 font-semibold";
        tooltip = "Symbol partition";
      }

      return (
        <span
          key={index}
          className={`relative group inline-block font-mono text-xs tracking-wide transition-all ${highlightClass}`}
        >
          {char}
          {/* Subtle dot beneath modified elements */}
          {(!origChar || origChar !== char) && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-70" />
          )}
          
          {/* Miniature interactive character tooltip */}
          <span className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 border border-slate-800 text-[8px] text-slate-200 px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-50">
            {tooltip}
          </span>
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-slate-900/20 border border-slate-900 p-2 text-left">
      <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
        <span>Original Structure</span>
        <span className="font-mono text-[10px] truncate max-w-[140px] text-slate-400 line-through">{original}</span>
      </div>
      <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium border-t border-slate-900/40 pt-1.5">
        <span>Evolved Version</span>
        <span className="font-mono text-[10px] truncate max-w-[140px] select-all">
          {renderHighlightedChars(improved, original)}
        </span>
      </div>
    </div>
  );
};