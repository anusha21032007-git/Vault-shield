import React from 'react';
import { Shield, Settings, History, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Popup = () => {
  return (
    <div className="w-[350px] bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-b from-indigo-500/10 to-transparent border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 rounded-xl p-2 shadow-lg shadow-indigo-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Vault-Shield</h1>
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-1">Active Protection</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Security Status</p>
            <p className="text-sm font-bold text-white">System Fully Guarded</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={<History className="h-4 w-4" />} label="Recent Scans" />
            <ActionButton icon={<Lock className="h-4 w-4" />} label="Vault Access" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Overview</h2>
          <div className="space-y-2">
            <OverviewItem label="Real-time Detection" status="Active" />
            <OverviewItem label="Smart Suggestions" status="Enabled" />
            <OverviewItem label="Privacy Mode" status="Local Only" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/50">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Version 1.0.0</span>
            <a href="#" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
              Documentation <ExternalLink className="h-2 w-2" />
            </a>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group">
    <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">{icon}</div>
    <span className="text-[10px] font-bold text-slate-300">{label}</span>
  </button>
);

const OverviewItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/30">
    <span className="text-xs text-slate-400">{label}</span>
    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{status}</span>
  </div>
);

export default Popup;