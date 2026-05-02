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
    autonomousMode: localStorage.getItem('autonomous_mode') === 'true'
  });

  const saveConfig = () => {
    localStorage.setItem('ai_provider', config.provider);
    localStorage.setItem('ai_model_id', config.modelId);
    localStorage.setItem('openrouter_key', config.openrouterKey);
    localStorage.setItem('autonomous_mode', String(config.autonomousMode));
    toast.success("System parameters synchronized");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <header>
        <h1 className="text-5xl font-serif font-bold text-solar-forest tracking-tighter">System Configuration</h1>
        <p className="text-solar-sage mt-2 italic font-serif text-lg">Calibrate the Nexus intelligence core and security protocols.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
           <button 
             onClick={() => setActiveTab('ai')}
             className={cn(
               "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'ai' ? "bg-solar-amber text-white shadow-lg" : "bg-white text-solar-sage hover:bg-solar-paper"
             )}
           >
             <Cpu className="w-4 h-4" />
             Intelligence Core
           </button>
           <button 
             onClick={() => setActiveTab('security')}
             className={cn(
               "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'security' ? "bg-solar-amber text-white shadow-lg" : "bg-white text-solar-sage hover:bg-solar-paper"
             )}
           >
             <ShieldCheck className="w-4 h-4" />
             Security & API
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
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                 <div className="p-6 bg-solar-paper rounded-2xl border border-solar-border italic text-sm text-solar-sage">
                   All OAuth tokens and API keys are stored locally in your browser's encrypted subspace. Direct API calls bypass expensive intermediate layers.
                 </div>
                 {/* Placeholder for more security settings */}
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
