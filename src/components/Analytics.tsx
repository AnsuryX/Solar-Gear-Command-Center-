import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  ArrowUpRight, 
  RefreshCw,
  Globe,
  PieChart
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Cell
} from 'recharts';
import { generateAIResponse } from '../services/aiService';

export default function Analytics() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGoals, setAiGoals] = useState<any[]>([]);
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);

  const token = localStorage.getItem('google_token');
  const propertyId = localStorage.getItem('ga4_property_id') || '445217997'; // Placeholder or user provided

  const fetchAnalytics = async () => {
    if (!token) {
        toast.error("Please connect your Google Account in the Config tab.");
        return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/analytics/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, propertyId })
      });
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message);
      
      // Transform for Recharts
      const chartData = data.rows?.map((row: any) => ({
        name: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
        conversions: parseInt(row.metricValues[2].value),
      })) || [];

      setReportData(chartData);
      toast.success("Analytics stream synchronized.");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch GA4 data.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIGoals = async () => {
    if (!reportData) return;
    setIsGeneratingGoals(true);
    const id = toast.loading("Nexus Intelligence is processing traffic signals...");
    
    const context = JSON.stringify(reportData);
    const prompt = `
        Based on this GA4 weekly report data: ${context}
        1. Identify 3 critical growth goals.
        2. Assign a "Target Magnitude" (0-100).
        3. Suggest a specific AI-driven tactical reversal (e.g., "Shift 20% budget to Display").
        
        Return ONLY a JSON array: [{ "goal": "...", "magnitude": 85, "tactic": "...", "status": "active" }]
    `;

    try {
        const response = await generateAIResponse(prompt);
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            setAiGoals(JSON.parse(jsonMatch[0]));
            toast.success("Autonomous Growth Stratey Updated.", { id });
        }
    } catch (e) {
        toast.error("Strategy synthesis failed.", { id });
    } finally {
        setIsGeneratingGoals(false);
    }
  };

  useEffect(() => {
    if (token) fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12">
      <header className="flex justify-between items-end">
        <div>
           <h1 className="text-6xl font-serif font-bold text-solar-forest tracking-tighter">Growth Analytics</h1>
           <p className="text-solar-sage mt-2 italic font-serif text-lg">Direct GA4 ingestion & AI tactical response.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="bg-white border border-solar-border px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-solar-paper transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          Sync Stream
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-solar-border p-10 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-2xl font-serif font-bold text-solar-forest">Traffic Velocity</h3>
                   <p className="text-[10px] font-black uppercase text-solar-sage tracking-widest mt-1">7-Day Rolling Insight</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[9px] font-bold text-solar-sage">
                      <div className="w-2 h-2 rounded-full bg-solar-amber" /> Active Users
                   </div>
                   <div className="flex items-center gap-2 text-[9px] font-bold text-solar-sage">
                      <div className="w-2 h-2 rounded-full bg-solar-forest" /> Sessions
                   </div>
                </div>
            </div>

            <div className="flex-1">
                {reportData ? (
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E6AA3E" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#E6AA3E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E1D8" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#8B8D7F'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#8B8D7F'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="#E6AA3E" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="sessions" stroke="#2A2C24" strokeWidth={3} fillOpacity={0} />
                      </AreaChart>
                   </ResponsiveContainer>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale">
                      <Globe className="w-16 h-16 animate-pulse" />
                      <p className="font-serif italic text-lg">Awaiting data hook...</p>
                   </div>
                )}
            </div>
        </div>

        {/* AI Goals Card */}
        <div className="bg-solar-forest rounded-[3rem] p-10 text-white flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex-1 space-y-8">
                <div>
                   <h3 className="text-3xl font-serif font-bold tracking-tight">Nexus Strategist</h3>
                   <p className="text-solar-sage text-[10px] uppercase font-black tracking-widest mt-1">Autonomous Tactical Correction</p>
                </div>

                <div className="space-y-6">
                    {aiGoals.length === 0 ? (
                        <div className="py-12 px-6 border border-white/10 rounded-[2rem] bg-white/5 flex flex-col items-center text-center gap-4">
                           <Target className="w-8 h-8 text-solar-amber opacity-40" />
                           <p className="text-xs text-white/60 italic font-serif">Sync data to enable AI goal synthesis.</p>
                        </div>
                    ) : (
                        aiGoals.map((goal: any, i: number) => (
                           <motion.div 
                             key={i}
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-default group"
                           >
                              <div className="flex justify-between items-start mb-3">
                                 <h4 className="text-sm font-bold truncate pr-4">{goal.goal}</h4>
                                 <span className="text-[10px] font-black text-solar-amber uppercase">{goal.magnitude}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/10 rounded-full mb-3">
                                 <div className="h-full bg-solar-amber rounded-full" style={{ width: `${goal.magnitude}%` }} />
                              </div>
                              <p className="text-[10px] text-white/60 italic group-hover:text-white transition-colors">{goal.tactic}</p>
                           </motion.div>
                        ))
                    )}
                </div>

                <button 
                  onClick={generateAIGoals}
                  disabled={!reportData || isGeneratingGoals}
                  className="w-full bg-solar-amber text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Synthesize Growth Reversals
                </button>
            </div>
        </div>
      </div>

      {/* Conversion Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-solar-border p-8 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-solar-sage mb-2">Conv. Yield</p>
               <h4 className="text-4xl font-serif font-black text-solar-forest tracking-tighter">14.2%</h4>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 mt-4">
               <ArrowUpRight size={14} /> +2.4% vs L.W
            </div>
         </div>

         <div className="md:col-span-3 bg-white rounded-[2.5rem] border border-solar-border p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-serif font-bold text-solar-forest">Network Contribution</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-solar-sage italic">Attribution Split</p>
            </div>
            <div className="grid grid-cols-4 gap-8">
               {[
                 { platform: 'LinkedIn', yield: 42, color: 'bg-solar-forest' },
                 { platform: 'Instagram', yield: 28, color: 'bg-solar-amber' },
                 { platform: 'GMB / Local', yield: 18, color: 'bg-solar-sage' },
                 { platform: 'Direct/Ads', yield: 12, color: 'bg-solar-border' },
               ].map(item => (
                 <div key={item.platform} className="space-y-4">
                    <div className="h-2 w-full bg-solar-paper rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.yield}%` }} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-solar-sage uppercase tracking-widest mb-1">{item.platform}</p>
                       <p className="text-xl font-serif font-bold text-solar-forest">{item.yield}%</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
