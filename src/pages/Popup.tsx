import React from 'react';
import { Shield, Settings, Zap, ShieldCheck, ExternalLink } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Popup = () => {
  return (
    <div className="w-[320px] bg-slate-950 text-slate-200 font-sans border border-slate-900 shadow-2xl">
      <div className="p-5 bg-gradient-to-b from-indigo-500/10 to-transparent border-b border-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-500 rounded-xl p-2 shadow-lg shadow-indigo-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">Vault-Shield</h1>
              <p className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase mt-1">Intelligence Active</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-900 rounded-lg transition-colors">
            <Settings className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-950/40">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Status</p>
            <p className="text-xs font-semibold text-white">Guarding Active Tab</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-2">
          <h2 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Protections</h2>
          <div className="space-y-1.5">
            <StatusItem label="Real-time Analysis" status="Active" />
            <StatusItem label="Mutation Engine" status="Ready" />
            <StatusItem label="Privacy Mode" status="Local Only" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[9px] text-slate-500">
          <span>v1.0.0</span>
          <a href="#" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
            Docs <ExternalLink className="h-2 w-2" />
          </a>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

const StatusItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-900">
    <span className="text-xs text-slate-400">{label}</span>
    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{status}</span>
  </div>
);

export default Popup;