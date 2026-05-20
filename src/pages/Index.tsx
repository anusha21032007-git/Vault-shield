import React, { useState } from 'react';
import Popup from './Popup';
import FloatingAssistant from '../components/FloatingAssistant';
import { Shield, Lock, Zap, Eye, ShieldCheck, Sparkles } from 'lucide-react';

const Index = () => {
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Marketing/Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <Zap className="h-3 w-3" /> Next-Gen Security
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Your Digital <span className="text-indigo-500">Vault</span>, <br />
              Reinforced.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Vault-Shield is a real-time cybersecurity assistant that lives in your browser, ensuring every password you create is a fortress.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Feature icon={<Eye className="h-5 w-5" />} title="Minimal Indicator" desc="A tiny glowing circle that stays out of your way." />
            <Feature icon={<Lock className="h-5 w-5" />} title="Smart Mutations" desc="Human-friendly, secure alternatives." />
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Local Only" desc="Zero data collection. 100% private." />
            <Feature icon={<Zap className="h-5 w-5" />} title="One-Click Apply" desc="Seamless integration with any form." />
          </div>
        </div>

        {/* Right Side: Extension Preview */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full" />
            
            {/* Popup Preview */}
            <div className="relative rounded-3xl border border-slate-800 shadow-2xl shadow-black overflow-hidden">
              <Popup />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-medium italic">
            Preview of the Vault-Shield Extension Popup
          </p>
        </div>
      </div>

      {/* Demo Section */}
      <div className="mt-24 w-full max-w-2xl bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 text-center space-y-6 backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Try the Minimal Indicator
          </h3>
          <p className="text-slate-400 text-sm">
            Type a password below. Hover or click the glowing circle to open the interactive analyzer.
          </p>
        </div>
        
        <div className="relative max-w-md mx-auto space-y-4 text-left">
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password to test..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          
          {/* Live Floating Assistant Demo */}
          <div className="flex items-center gap-2 pl-1">
            <FloatingAssistant 
              passwordValue={password} 
              onApply={(val) => setPassword(val)} 
            />
            <span className="text-[10px] text-slate-500 font-medium italic">
              Interactive Security Indicator
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="space-y-2">
    <div className="text-indigo-400">{icon}</div>
    <h4 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Index;