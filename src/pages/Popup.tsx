"use client";

import React, { useEffect, useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, ExternalLink, Lock, Eye, Sparkles } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { motion } from 'framer-motion';

const Popup = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Load state from storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['vaultShieldActive'], (result) => {
        if (result.vaultShieldActive !== undefined) {
          setIsActive(result.vaultShieldActive);
        }
      });
    }
  }, []);

  const toggleProtection = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ vaultShieldActive: newState });
    }
  };

  return (
    <div className="w-[320px] bg-slate-950 text-slate-200 font-sans border border-slate-900 shadow-2xl overflow-hidden">
      <div className="p-5 bg-gradient-to-b from-indigo-500/5 to-transparent border-b border-slate-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className={`rounded-xl p-2 transition-all duration-500 ${isActive ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-slate-900 border border-slate-800'}`}>
              <Shield className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-none">Vault-Shield</h1>
              <p className={`text-[10px] font-medium mt-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                {isActive ? 'Intelligence active' : 'System standby'}
              </p>
            </div>
          </div>
          
          {/* Futuristic Toggle */}
          <button 
            onClick={toggleProtection}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 border ${isActive ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-slate-900 border-slate-800'}`}
          >
            <motion.div 
              animate={{ x: isActive ? 22 : 4 }}
              className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-colors ${isActive ? 'bg-indigo-400' : 'bg-slate-600'}`}
            />
          </button>
        </div>

        <div className={`rounded-2xl border transition-all duration-500 p-3.5 flex items-center gap-3 ${isActive ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-slate-900 bg-slate-900/50'}`}>
          <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-slate-950/40' : 'bg-slate-950/20'}`}>
            {isActive ? (
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-slate-600" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System status</p>
            <p className={`text-xs font-semibold transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>
              {isActive ? 'Protection active' : 'Protection paused'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-2.5">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active protections</h2>
          <div className={`space-y-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
            <StatusItem label="Real-time analysis" status={isActive ? "Active" : "Paused"} active={isActive} />
            <StatusItem label="Mutation engine" status={isActive ? "Ready" : "Offline"} active={isActive} />
            <StatusItem label="Privacy mode" status="Local only" active={true} />
          </div>
        </div>

        {/* Local Privacy Trust Layer */}
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex gap-2">
          <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            100% Local Analysis. Your passwords never leave your browser.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
          <span>v1.0.0</span>
          <a href="#" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
            Docs <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

const StatusItem = ({ label, status, active }: { label: string, status: string, active: boolean }) => (
  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-900">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${active ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-600 bg-slate-800'}`}>
      {status}
    </span>
  </div>
);

export default Popup;