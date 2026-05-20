"use client";

import React from 'react';
import { ShieldAlert, HelpCircle } from 'lucide-react';
import { ThreatGuess } from '../utils/ThreatSimulationEngine';

interface AttackerSimulationProps {
  guesses: ThreatGuess[];
}

export const AttackerSimulation: React.FC<AttackerSimulationProps> = ({ guesses }) => {
  if (guesses.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
        <p className="text-[11px] font-medium text-slate-400">How attackers may guess this password</p>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-800/60">
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-bold text-slate-300">{g.guess}</p>
                <p className="text-[9px] text-slate-500">{g.type}</p>
              </div>
              <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-full">
                {g.timeToCrack}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Suggested passwords avoid common mutation attack paths by injecting entropy in middle positions and removing predictable suffixes.
          </p>
        </div>
      </div>
    </div>
  );
};