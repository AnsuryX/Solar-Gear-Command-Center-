import React, { useState, useEffect } from 'react';
import { Settings, Cpu, ShieldCheck, Zap, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<'ai' | 'security'>('ai');
  const [config, setConfig] = useState({
    provider: localStorage.getItem('ai_provider') || 'gemini',
    modelId: localStorage.getItem('ai_model_id') || 'gemini-1.5-flash',
    openrouterKey: localStorage.getItem('openrouter_key') || '',
    autonomousMode: localStorage.getItem('autonomous_mode') === 'true',
    brandVoice: localStorage.getItem('brand_voice') || 'Professional, Technical, Visionary',
    brandTone: localStorage.getItem('brand_tone') || 'Confident but humble, ROI-focused'
  });

  const saveConfig = () => {
    localStorage.setItem('ai_provider', config.provider);
    localStorage.setItem('ai_model_id', config.modelId);
    localStorage.setItem('openrouter_key', config.openrouterKey);
    localStorage.setItem('autonomous_mode', String(config.autonomousMode));
    localStorage.setItem('brand_voice', config.brandVoice);
    localStorage.setItem('brand_tone', config.brandTone);
    toast.success("System parameters synchronized");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <header>
        <h1 className="text-5xl font-serif font-bold text-solar-forest tracking-tighter">System Configuration</h1>
        <p className="text-solar-sage mt-2 italic font-serif text-lg">Calibrate the Nexus intelligence core and security protocols.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
           <button 
             id="tab-intelligence"
             onClick={() => setActiveTab('ai')}
             className={cn(
               "w-full flex items-center justify-between px-6 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all group",
               activeTab === 'ai' ? "bg-solar-amber text-white shadow-xl shadow-solar-amber/20" : "bg-white text-solar-sage border border-solar-border hover:bg-solar-paper"
             )}
           >
             <div className="flex items-center gap-3">
               <Cpu className={cn("w-4 h-4", activeTab === 'ai' ? "text-white" : "text-solar-amber")} />
               Intelligence Core
             </div>
             {activeTab === 'ai' && <Zap size={12} className="fill-current animate-pulse" />}
           </button>
           <button 
             id="tab-security"
             onClick={() => setActiveTab('security')}
             className={cn(
               "w-full flex items-center justify-between px-6 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all group",
               activeTab === 'security' ? "bg-solar-forest text-white shadow-xl shadow-solar-forest/20" : "bg-white text-solar-sage border border-solar-border hover:bg-solar-paper"
             )}
           >
             <div className="flex items-center gap-3">
               <ShieldCheck className={cn("w-4 h-4", activeTab === 'security' ? "text-white" : "text-solar-forest")} />
               Security & API
             </div>
             {activeTab === 'security' && <Zap size={12} className="fill-current animate-pulse text-solar-amber" />}
           </button>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-solar-border p-12 shadow-sm space-y-10">
            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div>
                     <h3 className="text-xl font-serif font-bold text-solar-forest">Autonomous Pilot</h3>
                     <p className="text-xs text-solar-sage mt-1 italic">When enabled, AI will automatically schedule content without approval.</p>
                   </div>
                   <button 
                     onClick={() => setConfig({...config, autonomousMode: !config.autonomousMode})}
                     className={cn(
                       "w-16 h-8 rounded-full transition-all relative",
                       config.autonomousMode ? "bg-solar-amber" : "bg-solar-border"
                     )}
                   >
                     <motion.div 
                       animate={{ x: config.autonomousMode ? 32 : 4 }}
                       className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                     />
                   </button>
                </div>

                <div className="space-y-6 pt-6 border-t border-solar-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">AI Provider</label>
                       <select 
                         value={config.provider}
                         onChange={(e) => setConfig({...config, provider: e.target.value})}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-bold"
                       >
                         <option value="gemini">Gemini (Free tier)</option>
                         <option value="openrouter">OpenRouter (Multi-model)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Model ID</label>
                       <input 
                         value={config.modelId}
                         onChange={(e) => setConfig({...config, modelId: e.target.value})}
                         placeholder={config.provider === 'gemini' ? 'gemini-1.5-flash' : 'google/gemini-2.0-flash-lite-001'}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-bold"
                       />
                    </div>
                  </div>

                  {config.provider === 'openrouter' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">OpenRouter API Key</label>
                       <div className="flex gap-2">
                         <div className="relative flex-1">
                           <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-solar-sage" />
                           <input 
                             type="password"
                             value={config.openrouterKey}
                             onChange={(e) => setConfig({...config, openrouterKey: e.target.value})}
                             className="w-full pl-12 pr-4 py-4 rounded-xl bg-solar-paper border-solar-border text-xs font-mono"
                           />
                         </div>
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-solar-border">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Brand Voice</label>
                       <textarea 
                         value={config.brandVoice}
                         onChange={(e) => setConfig({...config, brandVoice: e.target.value})}
                         rows={2}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-medium resize-none"
                         placeholder="e.g. Technical, Elite, Disruptive"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Brand Tone</label>
                       <textarea 
                         value={config.brandTone}
                         onChange={(e) => setConfig({...config, brandTone: e.target.value})}
                         rows={2}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-medium resize-none"
                         placeholder="e.g. ROI-focused, educational"
                       />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                 <div className="p-6 bg-solar-paper rounded-2xl border border-solar-border italic text-sm text-solar-sage leading-relaxed">
                   Nexus uses a <strong>Zero-Server-Storage</strong> protocol for social tokens. However, for external automation (n8n, Zapier), you can use the <strong>Nexus Bridge</strong> API key to trigger cycles from external agents.
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Bridge Endpoint (Webhook Target)</label>
                       <div className="w-full p-4 rounded-xl bg-solar-paper border border-solar-border text-xs font-mono text-solar-forest break-all">
                          {window.location.origin}/api/external/trigger-strategy
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Nexus Bridge Key (X-Nexus-Key)</label>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-4 flex items-center text-solar-sage">
                           <Key size={14} />
                         </div>
                         <input 
                           readOnly
                           value="nexus_dev_secret_2026"
                           className="w-full pl-10 pr-4 py-4 rounded-xl bg-solar-paper border border-solar-border text-xs font-mono text-solar-forest"
                         />
                         <p className="text-[9px] text-solar-sage mt-2 italic px-1">Define `NEXUS_API_SECRET` in your environment to override this development key.</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-4 bg-solar-paper border border-solar-border rounded-xl">
                          <p className="text-[8px] font-black uppercase text-solar-sage mb-1">Status</p>
                          <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Bridge Active
                          </p>
                       </div>
                       <div className="p-4 bg-solar-paper border border-solar-border rounded-xl">
                          <p className="text-[8px] font-black uppercase text-solar-sage mb-1">Protocol</p>
                          <p className="text-xs font-bold text-solar-forest">JSON REST</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="pt-8 flex justify-end">
               <button 
                 onClick={saveConfig}
                 className="bg-solar-forest text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
               >
                 <Zap className="w-4 h-4 text-solar-amber" />
                 Apply Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
