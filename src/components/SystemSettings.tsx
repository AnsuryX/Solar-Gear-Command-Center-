import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Key } from 'lucide-react';
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
    brandTone: localStorage.getItem('brand_tone') || 'Confident but humble, ROI-focused',
    n8nUrl: localStorage.getItem('n8n_url') || 'https://automate.solargear.co.ke/mcp-server/http',
    n8nKey: localStorage.getItem('n8n_key') || ''
  });

  const saveConfig = () => {
    localStorage.setItem('ai_provider', config.provider);
    localStorage.setItem('ai_model_id', config.modelId);
    localStorage.setItem('openrouter_key', config.openrouterKey);
    localStorage.setItem('autonomous_mode', String(config.autonomousMode));
    localStorage.setItem('brand_voice', config.brandVoice);
    localStorage.setItem('brand_tone', config.brandTone);
    localStorage.setItem('n8n_url', config.n8nUrl);
    localStorage.setItem('n8n_key', config.n8nKey);
    toast.success("System parameters synchronized");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <header>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber mb-2">
          <span className="w-8 h-[1px] bg-solar-amber" />
          System Parameters
        </div>
        <h1 className="text-5xl font-serif font-bold text-solar-forest tracking-tighter">Nexus Configuration</h1>
        <p className="text-solar-sage mt-2 italic font-serif text-lg">Calibrate the intelligence core and automation protocols.</p>
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
           <button 
             id="tab-automation"
             onClick={() => setActiveTab('automation' as any)}
             className={cn(
               "w-full flex items-center justify-between px-6 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all group",
               activeTab === ('automation' as any) ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "bg-white text-solar-sage border border-solar-border hover:bg-solar-paper"
             )}
           >
             <div className="flex items-center gap-3">
               <Zap className={cn("w-4 h-4", activeTab === ('automation' as any) ? "text-white" : "text-indigo-600")} />
               Automation Bridge
             </div>
             {activeTab === ('automation' as any) && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
           </button>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-solar-border p-12 shadow-sm space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-solar-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {activeTab === 'ai' && (
              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                   <div>
                     <h3 className="text-xl font-serif font-bold text-solar-forest">Autonomous Pilot</h3>
                     <p className="text-xs text-solar-sage mt-1 italic">When enabled, AI will automatically schedule transmissions without manual approval.</p>
                   </div>
                   <button 
                     onClick={() => setConfig({...config, autonomousMode: !config.autonomousMode})}
                     className={cn(
                       "w-16 h-8 rounded-full transition-all relative shadow-inner",
                       config.autonomousMode ? "bg-solar-amber" : "bg-solar-border"
                     )}
                   >
                     <motion.div 
                       animate={{ x: config.autonomousMode ? 32 : 4 }}
                       className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
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
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-bold focus:shadow-lg transition-all outline-none"
                       >
                         <option value="gemini">Gemini (Native)</option>
                         <option value="openrouter">OpenRouter (External)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Model ID</label>
                       <input 
                         value={config.modelId}
                         onChange={(e) => setConfig({...config, modelId: e.target.value})}
                         placeholder={config.provider === 'gemini' ? 'gemini-1.5-flash' : 'google/gemini-2.0-flash-lite-001'}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-bold focus:shadow-lg transition-all outline-none"
                       />
                    </div>
                  </div>

                  {config.provider === 'openrouter' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">OpenRouter API Key</label>
                       <div className="relative">
                         <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-solar-amber" />
                         <input 
                           type="password"
                           value={config.openrouterKey}
                           onChange={(e) => setConfig({...config, openrouterKey: e.target.value})}
                           className="w-full pl-12 pr-4 py-4 rounded-xl bg-solar-paper border-solar-border text-xs font-mono focus:shadow-lg transition-all outline-none"
                         />
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
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-medium resize-none focus:shadow-lg transition-all outline-none"
                         placeholder="e.g. Technical, Elite, Disruptive"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage">Brand Tone</label>
                       <textarea 
                         value={config.brandTone}
                         onChange={(e) => setConfig({...config, brandTone: e.target.value})}
                         rows={2}
                         className="w-full p-4 rounded-xl bg-solar-paper border-solar-border text-xs font-medium resize-none focus:shadow-lg transition-all outline-none"
                         placeholder="e.g. ROI-focused, educational"
                       />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 relative z-10">
                 <div className="p-6 bg-solar-paper/50 rounded-3xl border border-solar-amber/20 backdrop-blur-sm italic text-sm text-solar-sage leading-relaxed shadow-inner">
                   Nexus uses a <strong>Zero-Server-Storage</strong> protocol for social tokens. However, for external automation (n8n, Zapier), you can use the <strong>Nexus Bridge</strong> API key to trigger strategic cycles from external agents.
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">Bridge Endpoint (Webhook Target)</label>
                       <div className="w-full p-5 rounded-2xl bg-solar-paper border border-solar-border text-xs font-mono text-solar-forest break-all shadow-sm">
                          {window.location.origin}/api/external/trigger-strategy
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">Nexus Bridge Key (X-Nexus-Key)</label>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-5 flex items-center text-solar-amber">
                           <Key size={16} />
                         </div>
                         <input 
                           readOnly
                           value="nexus_dev_secret_2026"
                           className="w-full pl-12 pr-12 py-5 rounded-2xl bg-white border-2 border-solar-paper text-xs font-mono text-solar-forest shadow-sm group-hover:border-solar-amber/30 transition-all cursor-pointer"
                           onClick={() => {
                             navigator.clipboard.writeText("nexus_dev_secret_2026");
                             toast.success("Bridge key cloned to subspace.");
                           }}
                         />
                         <div className="absolute inset-y-0 right-5 flex items-center text-[7px] font-black uppercase text-solar-sage/50 group-hover:text-solar-amber transition-all pointer-events-none opacity-0 group-hover:opacity-100 uppercase tracking-widest">
                            Copy
                         </div>
                         <p className="text-[9px] text-solar-sage mt-2 italic px-2">Define `NEXUS_API_SECRET` in your environment to override this development key.</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                       <div className="p-5 bg-solar-paper/30 border border-solar-border rounded-2xl shadow-sm">
                          <h5 className="text-[8px] font-black uppercase text-solar-sage mb-2 tracking-[0.2em]">Bridge Status</h5>
                          <div className="text-xs font-bold text-green-600 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" /> 
                             Operational
                          </div>
                       </div>
                       <div className="p-5 bg-solar-paper/30 border border-solar-border rounded-2xl shadow-sm">
                          <h5 className="text-[8px] font-black uppercase text-solar-sage mb-2 tracking-[0.2em]">Protocol Architecture</h5>
                          <div className="text-xs font-bold text-solar-forest uppercase">Secure JSON REST</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === ('automation' as any) && (
              <div className="space-y-8 relative z-10">
                 <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 backdrop-blur-sm italic text-sm text-indigo-900 leading-relaxed shadow-inner">
                   The <strong>n8n MCP Bridge</strong> connects Nexus to your private automation server. This allows AI agents to directly create workflows, trigger webhooks, and orchestrate complex multi-step processes.
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">n8n MCP Server URL</label>
                       <input 
                         value={config.n8nUrl}
                         onChange={(e) => setConfig({...config, n8nUrl: e.target.value})}
                         className="w-full p-5 rounded-2xl bg-solar-paper border border-solar-border text-xs font-mono text-solar-forest shadow-sm focus:shadow-md transition-all outline-none"
                         placeholder="https://automate.solargear.co.ke/mcp-server/http"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">n8n API Key (Bearer Token)</label>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-5 flex items-center text-indigo-600">
                           <Key size={16} />
                         </div>
                         <input 
                           type="password"
                           value={config.n8nKey}
                           onChange={(e) => setConfig({...config, n8nKey: e.target.value})}
                           className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white border border-solar-border text-xs font-mono text-solar-forest shadow-sm group-hover:border-indigo-300 transition-all outline-none"
                           placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                         />
                       </div>
                       <p className="text-[9px] text-solar-sage mt-2 italic px-2">Ensure your n8n instance has the <strong>Integrations API</strong> enabled.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                       <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                          <h5 className="text-[8px] font-black uppercase text-indigo-900 mb-2 tracking-[0.2em]">n8n Status</h5>
                          <div className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/50" /> 
                             Connected (MCP Mode)
                          </div>
                       </div>
                       <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                          <h5 className="text-[8px] font-black uppercase text-indigo-900 mb-2 tracking-[0.2em]">Active Workflows</h5>
                          <div className="text-xs font-bold text-indigo-900 uppercase">12 Autonomous Nodes</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="pt-8 flex justify-end relative z-10">
               <button 
                 onClick={saveConfig}
                 className="bg-solar-forest text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-solar-forest/20 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
               >
                 <Zap className="w-4 h-4 text-solar-amber" />
                 Apply Configuration
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
