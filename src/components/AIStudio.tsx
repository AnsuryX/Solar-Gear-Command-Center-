import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  Wand2, 
  Download, 
  Share2, 
  Loader2,
  Trash2,
  RefreshCw,
  Camera,
  Upload,
  Linkedin,
  Instagram,
  Globe,
  Zap,
  Bot
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { executeN8nWorkflow } from '../services/n8nService';

export default function AIStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: 'image' | 'text' | 'multi_post' | 'workflow', content: any } | null>(null);
  const [style, setStyle] = useState('photorealistic');
  const [mode, setMode] = useState<'create' | 'analyze' | 'automate'>('create');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const automateWorkflow = async () => {
    if (!prompt) return toast.error("Define the automation goal first");
    setIsGenerating(true);
    const toastId = toast.loading("Nexus is architecting the n8n logic...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create an n8n workflow JSON structure for: ${prompt}. Focus on solar industry automation (e.g. lead management, review scraping). Return ONLY valid JSON for an n8n workflow.`,
      });
      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const workflowData = jsonMatch ? JSON.parse(jsonMatch[0]) : { nodes: [], connections: {} };
      
      setResult({ type: 'workflow', content: workflowData });
      toast.success("Workflow architecture synthesized!", { id: toastId });
    } catch (error) {
      toast.error("Architecture failed", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const pushToN8n = async () => {
    if (!result || result.type !== 'workflow') return;
    setIsGenerating(true);
    const toastId = toast.loading("Transmitting blueprint to n8n server...");
    try {
      await executeN8nWorkflow('nexus-automation-ingest', { 
        blueprint: result.content,
        timestamp: new Date().toISOString(),
        author: auth.currentUser?.email
      });
      toast.success("Nexus Bridge synced with live n8n node!", { id: toastId });
    } catch (error) {
      toast.error("Bridge transmission failed. Check n8n config.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeInstallation = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop' })
      });
      const data = await res.json();
      setResult({ type: 'multi_post', content: data });
      toast.success("Organic loop completed! Posts ready for distribution.");
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCaption = async () => {
    if (!prompt) return toast.error("Enter a topic first");
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 engaging social media captions for a solar company in Kenya about: ${prompt}. The style should be ${style}. Include 2 relevant hashtags including #SolarGearKenya.`,
      });
      const text = response.text || '';
      setResult({ type: 'text', content: text });
      
      // Log to Firestore
      await saveGeneration('caption', prompt, text);
      toast.success("Captions generated!");
    } catch (error) {
      toast.error("Failed to generate captions");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!prompt) return toast.error("Enter a visual prompt first");
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${prompt}, ${style}, high quality, commercial photography` })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setResult({ type: 'image', content: data.imageUrl });
        await saveGeneration('image', prompt, data.imageUrl);
        toast.success("Image generated via Flux!");
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (error) {
      toast.error("Generation error. Make sure REPLICATE_API_TOKEN is set.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneration = async (type: string, prompt: string, resultVal: string) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'ai_generations'), {
        type,
        prompt,
        result: resultVal,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'ai_generations');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber mb-2"
           >
             <span className="w-8 h-[1px] bg-solar-amber" />
             AI Synthesis
           </motion.div>
          <h1 className="text-6xl font-serif font-bold text-solar-forest tracking-tighter">Creative Lab</h1>
          <p className="text-solar-sage font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Multi-Modal Content Generation & Vision Pipeline</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-solar-border shadow-sm">
           <button 
            onClick={() => { setMode('create'); setResult(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'create' ? 'bg-solar-forest text-white shadow-lg' : 'text-solar-sage hover:text-solar-forest'}`}
           >
             Synthesizer
           </button>
           <button 
            onClick={() => { setMode('analyze'); setResult(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'analyze' ? 'bg-solar-forest text-white shadow-lg' : 'text-solar-sage hover:text-solar-forest'}`}
           >
             Vision Scan
           </button>
           <button 
            onClick={() => { setMode('automate'); setResult(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'automate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-solar-sage hover:text-solar-forest'}`}
           >
             n8n Bridge
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white p-12 rounded-[3.5rem] border border-solar-border shadow-[0_8px_40px_rgba(0,0,0,0.02)] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-solar-amber to-solar-forest opacity-20" />
          
          {mode === 'create' ? (
            <>
              {/* ... existing prompt for create ... */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-solar-sage flex justify-between">
                  Conceptual Prompt
                  <span className="opacity-40 italic">Creative Engine</span>
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Solar panels on a sustainable villa during a golden hour in Nairobi..."
                  className="w-full h-48 p-7 rounded-[2rem] bg-solar-paper border border-solar-border/50 focus:border-solar-amber focus:ring-0 focus:outline-none transition-all text-sm font-medium leading-relaxed resize-none placeholder:text-solar-sage/40 shadow-inner"
                />
              </div>
              {/* ... existing style + buttons ... */}
            </>
          ) : mode === 'analyze' ? (
             <div className="space-y-10">
               {/* ... existing vision content ... */}
               <div className="p-12 border-2 border-dashed border-solar-border rounded-[3rem] flex flex-col items-center justify-center gap-6 hover:border-solar-amber hover:bg-solar-paper transition-all cursor-pointer group relative overflow-hidden bg-solar-paper/30">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-solar-border">
                     <Camera className="w-10 h-10 text-solar-sage group-hover:text-solar-amber transition-colors" />
                   </div>
                   <div className="text-center">
                     <p className="font-serif text-xl font-bold text-solar-forest">Upload Installation Photo</p>
                     <p className="text-xs text-solar-sage mt-2 font-medium">Extract system technicals & market narratives</p>
                   </div>
               </div>
             </div>
          ) : (
             <div className="space-y-10">
               <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-900 flex justify-between">
                  Automation Objective
                  <span className="opacity-40 italic">n8n Orchestrator</span>
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Create a workflow that scrapes Google Maps reviews for solar competitors and alerts me via Slack if sentiment drops..."
                  className="w-full h-48 p-7 rounded-[2rem] bg-indigo-50 border border-indigo-100 focus:border-indigo-400 focus:ring-0 focus:outline-none transition-all text-sm font-medium leading-relaxed resize-none placeholder:text-indigo-400/40 shadow-inner"
                />
              </div>

               <div className="bg-indigo-50 rounded-[2rem] p-8 space-y-6 border border-indigo-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-900 flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Protocol Parameters
                </h4>
                <div className="space-y-3">
                   {['Agentic Nodes', 'Webhook Integration', 'Error Handling Core', 'Autonomous Triggers'].map((p, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest">{p}</span>
                     </div>
                   ))}
                </div>
              </div>

              <button 
                onClick={automateWorkflow}
                disabled={isGenerating}
                className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:shadow-[0_15px_40px_rgba(79,70,229,0.2)] transition-all disabled:opacity-50"
              >
                <Bot className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
                Architect Autonomous Workflow
              </button>
             </div>
          )}
        </div>

        {/* Output Matrix */}
        <div className={cn(
          "lg:col-span-12 xl:col-span-7 p-12 rounded-[3.5rem] shadow-2xl min-h-[650px] flex flex-col relative overflow-hidden group transition-colors duration-500",
          mode === 'automate' ? "bg-indigo-950" : "bg-solar-forest"
        )}>
          {/* Decorative radial gradient */}
          <div className="absolute top-0 right-0 w-full h-full bg-radial from-white/5 to-transparent pointer-events-none" />
          
          <div className="absolute top-8 left-10 flex items-center gap-3 opacity-40">
             <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", mode === 'automate' ? "bg-indigo-400" : "bg-solar-amber")} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Quantum Output Matrix</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full mt-8">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                /* ... existing loader ... */
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-8"
                  >
                    <div className="relative">
                      <div className={cn("w-24 h-24 border-[6px] border-white/5 rounded-full animate-spin", mode === 'automate' ? "border-t-indigo-400" : "border-t-solar-amber")} />
                      <Wand2 className={cn("absolute inset-0 m-auto w-8 h-8 animate-pulse", mode === 'automate' ? "text-indigo-400" : "text-solar-amber")} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-serif italic text-white/80 tracking-wide">Synthesizing Neural Layers</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Phase 4 / Latent Space Reconstruction</p>
                    </div>
                  </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col"
                >
                  {result.type === 'image' ? (
                     /* ... existing image result ... */
                    <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-solar-deep border border-white/10 group/img relative">
                      <img 
                        src={result.content} 
                        alt="Generated content" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : result.type === 'text' ? (
                     /* ... existing text result ... */
                    <div className="bg-solar-deep/50 p-12 rounded-[2.5rem] border border-white/5 h-[450px] overflow-y-auto shadow-inner custom-scrollbar-white">
                       <pre className="whitespace-pre-wrap font-serif italic text-2xl leading-relaxed text-white/90">
                         {result.content}
                       </pre>
                    </div>
                  ) : result.type === 'workflow' ? (
                    <div className="bg-indigo-900/30 p-10 rounded-[2.5rem] border border-white/5 h-[450px] overflow-hidden flex flex-col relative">
                       <div className="flex-1 overflow-y-auto custom-scrollbar-white mb-8">
                         <div className="p-8 bg-black/30 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                               <Bot className="text-indigo-400" />
                               <h4 className="text-xl font-serif font-bold text-white">n8n Blueprint Orchestrated</h4>
                            </div>
                            <div className="space-y-4">
                               {result.content.nodes?.slice(0, 5).map((node: any, i: number) => (
                                 <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                                    <div>
                                       <p className="text-sm font-bold text-white">{node.name || 'Anonymous Node'}</p>
                                       <p className="text-[10px] text-white/40 uppercase tracking-widest">{node.type}</p>
                                    </div>
                                 </div>
                               ))}
                               {result.content.nodes?.length > 5 && (
                                 <p className="text-[10px] text-white/20 italic text-center text-indigo-400"> + {result.content.nodes.length - 5} additional logic nodes synthesized</p>
                               )}
                            </div>
                         </div>
                       </div>
                       
                       <button 
                         onClick={pushToN8n}
                         className="w-full bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
                       >
                         <Zap className="w-5 h-5 fill-current" />
                         Push to live n8n server
                       </button>
                    </div>
                  ) : (
                    /* ... existing multi post result ... */
                    <div className="space-y-6 overflow-y-auto h-[450px] pr-4 custom-scrollbar-white">
                       {[
                         { platform: 'LinkedIn', icon: Linkedin, color: 'sky', content: result.content.copy?.linkedin || '' },
                         { platform: 'Instagram', icon: Instagram, color: 'rose', content: result.content.copy?.instagram || '' },
                         { platform: 'Google Business', icon: Globe, color: 'amber', content: result.content.copy?.gmb || '' }
                       ].map((item) => (
                         <div key={item.platform} className="bg-solar-deep/40 p-8 rounded-[2rem] border border-white/5 group hover:bg-solar-deep/60 transition-all">
                            <div className="flex items-center justify-between mb-5">
                               <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <item.icon className="w-6 h-6 text-white/70" />
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">{item.platform}</span>
                               </div>
                            </div>
                            <p className="text-lg font-serif italic text-white/80 leading-relaxed font-medium">{item.content}</p>
                         </div>
                       ))}
                    </div>
                  )}
                  
                  {/* ... footer ... */}
                  <div className="mt-10 flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", mode === 'automate' ? "bg-indigo-400" : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]")} />
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          {mode === 'automate' ? "Nexus Automation System Enabled" : "SolaGear Global Identity System v4.0"}
                        </p>
                     </div>
                     <button 
                        onClick={() => setResult(null)}
                        className="text-[10px] font-black uppercase text-white/60 hover:text-white transition-colors flex items-center gap-3 group"
                      >
                       <Trash2 className="w-4 h-4 group-hover:scale-120 transition-transform" /> Reset Matrix
                     </button>
                  </div>
                </motion.div>
              ) : (
                /* ... existing idle state ... */
                <div className="flex flex-col items-center gap-8">
                  <div className={cn("w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all duration-500 relative", mode === 'automate' && "border-indigo-500/20")}>
                     <div className="absolute inset-4 border border-white/5 rounded-2xl animate-pulse" />
                     {mode === 'automate' ? <Bot className="w-12 h-12 text-indigo-400/40" /> : <Wand2 className="w-12 h-12 text-white/10" />}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white/20 text-lg font-serif italic font-medium tracking-wide">Atmospheric Pulse Detected</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">Synchronize creative impulse to begin</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
