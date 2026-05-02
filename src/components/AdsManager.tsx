import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Search, 
  ArrowUpRight,
  MoreVertical,
  Pause,
  Play,
  Settings2,
  Plus,
  CloudSun,
  ThermometerSun,
  Package,
  Zap,
  ChevronRight,
  Split,
  Trash2
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  serverTimestamp,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { generateAdCampaigns } from '../services/geminiService';

const chartData = [
  { name: 'On-grid', conversions: 45, roas: 4.8 },
  { name: 'Hybrid', conversions: 52, roas: 5.2 },
  { name: 'Off-grid', conversions: 38, roas: 3.9 },
  { name: 'Pumps', conversions: 25, roas: 4.1 },
];

export default function AdsManager() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'campaigns'),
      where('authorId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'campaigns'));

    return () => unsubscribe();
  }, []);

  const handleLaunchCampaign = async () => {
    setIsGenerating(true);
    const id = toast.loading("AI Market Analyst is designing your presence...");
    
    try {
      const concepts = await generateAdCampaigns("High-efficiency solar solutions for commercial hubs in Nairobi and Doha. Focus: High ROAS, clean energy aesthetics.");
      
      const promises = concepts.map((concept: any) => 
        addDoc(collection(db, 'campaigns'), {
          ...concept,
          platform: 'google_ads',
          performance: { spend: 0, clicks: 0, conversions: 0 },
          authorId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(promises);
      toast.success("New strategic campaigns deployed to Engine Room", { id });
    } catch (error) {
      toast.error("Strategy generation failed", { id });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
           <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber"
           >
             <span className="w-8 h-[1px] bg-solar-amber" />
             Capital Optimization
           </motion.div>
          <h1 className="text-6xl font-serif font-bold text-solar-forest tracking-tighter">Engine Room</h1>
          <p className="text-solar-sage font-medium uppercase tracking-[0.2em] text-[10px] mt-1 italic">Doha & Kenya Strategic Growth Hub</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white border border-solar-border px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-solar-paper transition-all flex items-center gap-3">
             <Settings2 className="w-4 h-4 text-solar-sage" />
             Parameters
           </button>
           <button 
             onClick={handleLaunchCampaign}
             disabled={isGenerating}
             className="bg-solar-forest text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-solar-forest/20 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             <Plus className="w-5 h-5" />
             {isGenerating ? 'Analyzing Market...' : 'Launch Campaign'}
           </button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Weekly Investment', value: '$3,482', icon: DollarSign, trend: '+12%' },
           { label: 'Avg Unit Cost', value: '$0.82', icon: Search, trend: '-2%' },
           { label: 'Efficiency Ratio', value: '4.2x', icon: Zap, trend: '+0.5' },
         ].map((stat, i) => (
           <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-solar-border shadow-[0_8px_40px_rgba(0,0,0,0.02)] flex items-center gap-8 group hover:bg-solar-paper/50 transition-all"
           >
              <div className="w-20 h-20 bg-solar-paper rounded-[2rem] group-hover:bg-solar-amber group-hover:text-white transition-all flex items-center justify-center shadow-inner">
                 <stat.icon className="w-8 h-8 text-solar-forest group-hover:text-white transition-colors" />
              </div>
              <div>
                 <div className="flex items-center gap-2">
                   <p className="text-[10px] font-black uppercase text-solar-sage tracking-[0.4em]">{stat.label}</p>
                   <span className="text-[9px] font-bold text-solar-amber">{stat.trend}</span>
                 </div>
                 <h3 className="text-4xl font-serif font-bold mt-1 text-solar-forest tracking-tighter">{stat.value}</h3>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Campaign List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-10">
          <div className="bg-white rounded-[3.5rem] border border-solar-border shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Target className="w-40 h-40" />
            </div>
            
            <div className="p-10 border-b border-solar-paper flex items-center justify-between relative z-10">
               <div>
                  <h2 className="text-3xl font-serif font-bold text-solar-forest tracking-tight">Active Deployments</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-solar-sage mt-2">Real-time Node Status</p>
               </div>
               <div className="flex gap-3">
                 <div className="h-10 w-10 bg-solar-paper rounded-xl flex items-center justify-center hover:bg-solar-border transition-colors cursor-pointer">
                    <Search className="w-4 h-4 text-solar-sage" />
                 </div>
                 <div className="h-10 w-10 bg-solar-paper rounded-xl flex items-center justify-center hover:bg-solar-border transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 text-solar-sage" />
                 </div>
               </div>
            </div>
            
            <div className="flex-1 min-h-[500px] relative z-10">
               {campaigns.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                    <div className="w-20 h-20 bg-solar-paper rounded-full flex items-center justify-center border border-solar-border">
                       <CloudSun className="w-8 h-8 text-solar-sage" />
                    </div>
                    <p className="text-xl font-serif italic text-solar-sage font-medium">Awaiting the first signal...</p>
                 </div>
               ) : (
                 <div className="divide-y divide-solar-border/30">
                    {campaigns.map((camp) => (
                      <motion.div 
                        key={camp.id} 
                        layoutId={camp.id}
                        onClick={() => setSelectedCampaign(camp)}
                        className={cn(
                          "p-10 hover:bg-solar-paper transition-all flex items-center justify-between group cursor-pointer border-l-4",
                          selectedCampaign?.id === camp.id ? "bg-solar-paper border-solar-amber" : "border-transparent"
                        )}
                      >
                         <div className="flex items-center gap-8">
                            <div className={cn(
                              "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500",
                              camp.status === 'active' ? "bg-solar-forest text-white shadow-2xl shadow-solar-forest/20 group-hover:rotate-12" : "bg-solar-border text-solar-sage"
                            )}>
                               {camp.status === 'active' ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                            </div>
                            <div>
                               <h4 className="font-serif text-2xl font-bold text-solar-forest tracking-tight">{camp.name}</h4>
                               <div className="flex items-center gap-3 mt-1.5">
                                  <span className="text-[10px] font-black uppercase text-solar-sage tracking-[0.2em]">Google Search Cluster</span>
                                  <span className="w-1.5 h-1.5 bg-solar-border rounded-full" />
                                  <div className="px-3 py-1 bg-solar-paper rounded-full text-[9px] font-black text-solar-forest tracking-widest uppercase border border-solar-border">${camp.budget} / day</div>
                               </div>
                            </div>
                         </div>
                         <div className="text-right flex items-center gap-14">
                            <div>
                               <p className="text-2xl font-serif font-bold text-solar-forest">{(camp.performance?.clicks || 0).toLocaleString()}</p>
                               <p className="text-[10px] font-black text-solar-sage uppercase tracking-[0.2em] mt-1">Interactions</p>
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-solar-paper flex items-center justify-center group-hover:bg-solar-amber group-hover:text-white transition-all transform group-hover:translate-x-2 shadow-sm border border-solar-border/50">
                               <ChevronRight className="w-6 h-6" />
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
               )}
            </div>
            
            <div className="p-8 bg-solar-paper/50 border-t border-solar-border font-serif italic text-solar-sage text-sm text-center">
                Solar Gear Global Marketing Node v2.4 <span className="mx-4 text-solar-border">|</span> All systems operational
            </div>
          </div>

          {/* Automation Triggers Section */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-solar-border shadow-[0_8px_40px_rgba(0,0,0,0.02)] space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-solar-amber to-solar-forest opacity-30" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-serif font-bold text-solar-forest tracking-tight">Bid Intelligence</h3>
                <p className="text-solar-sage text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Neural Trigger Matrix</p>
              </div>
              <div className="h-14 w-14 bg-solar-paper rounded-2xl flex items-center justify-center">
                 <Zap className="w-6 h-6 text-solar-amber animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weather Trigger */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-solar-paper border border-solar-border space-y-6 relative group overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ThermometerSun className="w-32 h-32" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-solar-border">
                    <CloudSun className="w-7 h-7 text-solar-forest" />
                  </div>
                  <span className="px-4 py-1.5 bg-green-500/10 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-500/20">Operational</span>
                </div>
                <div className="relative z-10">
                  <h4 className="font-serif text-xl font-bold text-solar-forest tracking-tight">Atmospheric Pulse</h4>
                  <p className="text-sm text-solar-sage mt-2 font-medium leading-relaxed">If 3-day forecast &gt; 35°C in Doha, increase budget by 25% for Cooling Packages.</p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] relative z-10">
                  <span className="text-solar-sage opacity-60">Current Signal</span>
                  <span className="text-solar-forest">Sunny / 38°C Peak</span>
                </div>
              </motion.div>

              {/* Inventory Trigger */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-solar-paper border border-solar-border space-y-6 relative group overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Package className="w-32 h-32" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-solar-border">
                    <Package className="w-7 h-7 text-solar-forest" />
                  </div>
                  <span className="px-4 py-1.5 bg-solar-sage/10 text-solar-sage text-[10px] font-black rounded-full uppercase tracking-widest border border-solar-border">Hibernating</span>
                </div>
                <div className="relative z-10">
                  <h4 className="font-serif text-xl font-bold text-solar-forest tracking-tight">Logistics Guard</h4>
                  <p className="text-sm text-solar-sage mt-2 font-medium leading-relaxed">If 5kW Inverter Stock &lt; 10 units in Nairobi, pause related search strings.</p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] relative z-10">
                  <span className="text-solar-sage opacity-60">Current Signal</span>
                  <span className="text-solar-forest">High / 24 Units</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Detail Panel / Analytics */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-10">
           <AnimatePresence mode="wait">
             {selectedCampaign ? (
               <motion.div 
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-solar-deep p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-full h-full bg-radial from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-white tracking-tight">{selectedCampaign.name}</h3>
                      <p className="text-solar-sage text-[10px] font-black uppercase tracking-[0.4em] mt-2">Deployment DNA</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                      <p className="text-[10px] font-black uppercase text-solar-sage tracking-widest">Match Strategy</p>
                      <p className="text-2xl font-serif font-bold text-white mt-1.5">Phrase Node</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                      <p className="text-[10px] font-black uppercase text-solar-sage tracking-widest">Efficiency ceiling</p>
                      <p className="text-2xl font-serif font-bold text-white mt-1.5">$1.40 <span className="text-xs text-solar-amber">MAX</span></p>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h4 className="text-[10px] font-black uppercase text-solar-sage tracking-[0.3em] flex items-center gap-3">
                        <Target className="w-4 h-4" /> Cluster Keywords
                     </h4>
                     <div className="flex flex-wrap gap-3">
                        {['solar panels kenya', 'off-grid doha', 'hybrid inverter', 'energy audit'].map(kw => (
                          <span key={kw} className="px-5 py-2.5 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:border-solar-amber transition-colors cursor-default">
                            {kw}
                          </span>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 relative z-10">
                     <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black uppercase text-solar-sage tracking-[0.3em] flex items-center gap-3">
                           <Split className="w-4 h-4" /> A/B Narrative Vector
                        </h4>
                        <span className="text-[9px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full uppercase">Iterating</span>
                     </div>
                     <div className="space-y-4">
                        {[
                          { label: 'Creative A (Technical)', val: '4.2% CTR', color: 'solar-sage' },
                          { label: 'Creative B (Emotive)', val: '6.8% CTR', color: 'solar-amber' }
                        ].map(c => (
                          <div key={c.label} className="p-6 bg-solar-paper rounded-[1.5rem] flex items-center justify-between group cursor-default">
                             <span className="text-xs font-bold text-solar-forest opacity-80">{c.label}</span>
                             <span className={`text-sm font-black text-${c.color}`}>{c.val}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                key="analytics"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-solar-deep p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-full h-full bg-radial from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-12 relative z-10">
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Yield Matrix</h2>
                      <p className="text-solar-sage text-[10px] font-black uppercase tracking-[0.3em] mt-2">Cross-Cluster Efficiency</p>
                    </div>
                    <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                       <BarChart className="w-6 h-6 text-solar-amber" />
                    </div>
                  </div>

                  <div className="h-[350px] relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#8B8D7F', fontWeight: 900, fontSize: 10}} 
                              width={100}
                            />
                            <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                              contentStyle={{ 
                                borderRadius: '24px', 
                                border: '1px solid #3D4035', 
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
                                backgroundColor: '#141414', 
                                color: '#fff' 
                              }}
                            />
                            <Bar dataKey="roas" radius={[0, 16, 16, 0]} barSize={24}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E6AA3E' : '#2A2C24'} stroke={index % 2 !== 0 ? '#8B8D7F' : 'none'} />
                              ))}
                            </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 p-10 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-5 relative z-10"
                   >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-solar-amber/20 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-solar-amber" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Strategic Compass</span>
                      </div>
                      <p className="text-lg text-solar-sage leading-relaxed italic font-serif opacity-80">
                        Off-grid systems in <strong className="text-white underline decoration-solar-amber decoration-2">Nairobi</strong> are yielding 4.8x ROAS. Recommend immediate capital reallocation to exploit this corridor.
                      </p>
                  </motion.div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
