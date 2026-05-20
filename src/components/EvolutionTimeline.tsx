"use client";

import React from 'react';
import { ArrowDown, ShieldCheck } from 'lucide-react';

interface EvolutionTimelineProps {
  original: string;
  mutations: string[];
}

export const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({ original, mutations }) => {
  if (!original || mutations.length === 0) return null;

  const steps = [
    { label: 'Original Anchor', value: original, strength: 'Predictable' },
    { label: 'Familiar Evolution', value: mutations[0], strength: 'Balanced' },
    { label: 'Fortress Evolution', value: mutations[2] || mutations[1], strength: 'High Resistance' }
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-slate-400">Password Evolution Timeline</p>
      <div className="relative pl-4 border-l border-slate-800 space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="relative space-y-1">
            {/* Timeline Node */}
            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
              index === 0 ? 'bg-rose-500 border-rose-950' : index === 1 ? 'bg-amber-500 border-amber-950' : 'bg-emerald-500 border-emerald-950'
            }`} />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{step.label}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                index === 0 ? 'text-rose-400 bg-rose-500/5' : index === 1 ? 'text-amber-400 bg-amber-500/5' : 'text-emerald-400 bg-emerald-500/5'
              }`}>
                {step.strength}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 truncate">{step.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};