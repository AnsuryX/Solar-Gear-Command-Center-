import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer2, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Instagram,
  Linkedin,
  Globe,
  Facebook,
  Zap,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { runAutonomousCycle } from '../services/contentQueueService';
import { generateVisionNarrative } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', organic: 400, paid: 240 },
  { name: 'Tue', organic: 300, paid: 139 },
  { name: 'Wed', organic: 200, paid: 980 },
  { name: 'Thu', organic: 278, paid: 390 },
  { name: 'Fri', organic: 189, paid: 480 },
  { name: 'Sat', organic: 239, paid: 380 },
  { name: 'Sun', organic: 349, paid: 430 },
];

export default function Dashboard() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid || 'nexus-commander-001';

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentPosts(posts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber"
           >
             <span className="w-8 h-[1px] bg-solar-amber" />
             Live Intelligence
           </motion.div>
          <h1 className="text-6xl font-serif font-bold text-solar-forest tracking-tighter">Marketing Pulse</h1>
          <p className="text-solar-sage font-medium flex items-center gap-2 text-lg">
            Solar Gear Kenya <span className="w-1.5 h-1.5 bg-solar-border rounded-full" /> 
            <span className="italic font-serif text-solar-forest/70">Global Performance Audit</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => {
              const id = toast.loading("Nexus is initializing autonomous intelligence...");
              runAutonomousCycle("Expand commercial solar footprint in East Africa while highlighting sustainable engineering excellence.")
                .then(() => toast.success("Autonomous cycle deployed successully!", { id }))
                .catch(() => toast.error("Intelligence failure. Check system logs.", { id }));
            }}
            className="bg-solar-amber text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-solar-amber/20 hover:-translate-y-1 transition-all flex items-center gap-3 group"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            Autonomous Pilot
          </button>
          
          <button className="bg-solar-forest text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-solar-forest/20 hover:-translate-y-1 transition-all flex items-center gap-3">
            Strategy Hub
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 min-h-[700px]">
        
        {/* Main Performance Chart - Large Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] border border-solar-border p-10 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] -translate-y-10 translate-x-10 group-hover:translate-x-0 transition-transform duration-1000">
            <TrendingUp className="w-80 h-80" />
          </div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="font-serif text-3xl text-solar-forest tracking-tight">Campaign Velocity</h2>
              <p className="text-solar-sage text-[10px] font-black uppercase tracking-widest mt-1">Rolling 7-day conversion lift</p>
            </div>
            <div className="flex gap-6">
               <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-solar-sage text-amber-600">
                  <div className="w-2.5 h-2.5 bg-solar-amber rounded-full shadow-sm animate-pulse" /> AI Accelerated
               </span>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A2C24" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#2A2C24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E6AA3E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#E6AA3E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E1D8" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#8B8D7F', fontSize: 9, fontWeight: 900}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#8B8D7F', fontSize: 9, fontWeight: 900}} 
                />
                <Tooltip 
                   cursor={{ stroke: '#E6AA3E', strokeWidth: 1 }}
                   contentStyle={{ 
                     borderRadius: '24px', 
                     border: '1px solid #E2E1D8', 
                     boxShadow: '0 20px 40px rgba(0,0,0,0.08)', 
                     backgroundColor: '#fff',
                     padding: '20px'
                   }}
                />
                <Area type="monotone" dataKey="organic" stroke="#2A2C24" strokeWidth={4} fillOpacity={1} fill="url(#colorOrganic)" />
                <Area type="monotone" dataKey="paid" stroke="#E6AA3E" strokeWidth={4} fillOpacity={1} fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-solar-border/50 relative z-10">
             {[
               { label: 'Avg ROAS', val: '4.2x', trend: '+0.4' },
               { label: 'CPA Target', val: '$12.4', trend: '-2.1' },
               { label: 'Conv. Yield', val: '5.8%', trend: '+1.2' }
             ].map(i => (
               <div key={i.label}>
                 <p className="text-[10px] font-black uppercase tracking-widest text-solar-sage">{i.label}</p>
                 <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-serif font-bold text-solar-forest">{i.val}</span>
                   <span className="text-[10px] font-bold text-solar-amber">{i.trend}</span>
                 </div>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Small Stat Cards Integrated into Bento */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            className="flex-1 p-8 bg-solar-amber text-white rounded-[2.5rem] shadow-xl shadow-solar-amber/30 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
               <Zap className="w-32 h-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">System Efficiency</p>
              <h3 className="text-5xl font-serif font-bold mt-2 tracking-tighter">94.2%</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-xs font-bold mt-8">
              <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-md flex items-center gap-1 text-[10px] uppercase font-black tracking-widest">
                <ArrowUpRight className="w-3 h-3" /> 12% Lift
              </div>
              <span className="text-[10px] font-medium opacity-60">Manual override inhibited</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 p-8 bg-solar-forest text-white rounded-[2.5rem] shadow-xl shadow-solar-forest/30 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-solar-sage">Target Market</p>
               <h3 className="text-3xl font-serif font-bold mt-2 tracking-tight">Nairobi, KE</h3>
            </div>
            <div className="relative z-10 mt-8 flex justify-between items-end">
               <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-solar-sage">Avg CTR</p>
                 <p className="text-xl font-bold">12.4%</p>
               </div>
               <div className="h-12 w-12 bg-solar-amber rounded-2xl flex items-center justify-center shadow-lg shadow-solar-amber/30">
                 <ArrowUpRight className="w-6 h-6 font-bold" />
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Nexus Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-solar-border p-10 shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-solar-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all group-hover:bg-solar-amber/10" />
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-serif font-bold text-solar-forest">Signal Reception</h3>
                  <div className="flex gap-2">
                     <div className="px-3 py-1 bg-solar-paper rounded-lg text-[8px] font-black uppercase tracking-widest text-solar-sage flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" /> Live Market Mix
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                    { title: 'Growth Signal: Commercial ROI', content: 'Market analysis indicates a 14% surge in local search for "Solar Lease Kenya". AI recommending shift towards zero-initial-cost financing narratives.', icon: Sparkles, color: 'text-solar-amber' },
                    { title: 'Atmospheric Intelligence', content: 'Nairobi Heatwave Index rising. Engine Room host automatically prepared 3 cooling solution campaigns for the next 48hr window.', icon: TrendingUp, color: 'text-solar-forest' },
                    { title: 'Logistics Alert: Doha Delay', content: 'Subspace logistics detection identified a 4.2h delay in regional forwarding. Ad budgets rerouted to localized stock locations.', icon: AlertCircle, color: 'text-rose-500' }
                  ].map((signal, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 bg-solar-paper/50 rounded-2xl border border-solar-border flex items-start gap-4 hover:bg-white hover:shadow-md transition-all group/signal cursor-pointer"
                    >
                       <div className={cn("w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0", signal.color)}>
                          <signal.icon className="w-5 h-5 group-hover/signal:scale-110 transition-transform" />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-solar-forest mb-1">{signal.title}</h4>
                          <p className="text-xs text-solar-sage leading-relaxed italic">{signal.content}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>

               <div className="mt-10 pt-8 border-t border-solar-border flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-solar-sage">
                  <span>Synced 2 mins ago</span>
                  <button className="text-solar-amber hover:underline">Re-calibrate Signals</button>
               </div>
            </div>

            <div className="bg-solar-forest rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               <div className="flex-1 space-y-4 relative z-10">
                  <h3 className="text-4xl font-serif font-bold tracking-tight">Executive Summary Portfolio</h3>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-[0.2em]">Generate board-ready performance reports with a single pulse.</p>
                  <button 
                    onClick={async () => {
                      const id = toast.loading("Nexus is synthesizing global performance signals...");
                      try {
                        const report = await generateVisionNarrative("Current quarter focus on commercial solar ROI and community residential expansion.");
                        toast.success("Executive Portfolio Compiled and Staged.", { id });
                        // In a real app, this could open a PDF or a detailed modal
                        console.log("Board Report:", report);
                      } catch (e) {
                        toast.error("Synthesis failed.", { id });
                      }
                    }}
                    className="bg-solar-amber text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-solar-amber/40 transition-all flex items-center gap-3"
                  >
                     <FileText className="w-4 h-4" />
                     Compile Board Report
                  </button>
               </div>
               <div className="w-48 h-48 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-md relative z-10 text-solar-amber">
                  <TrendingUp className="w-16 h-16 opacity-50" />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-solar-border p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage">Asset Health Dashboard</h4>
                 <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-solar-amber rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                 </div>
               </div>
               <div className="space-y-6">
                  {[
                    { name: 'Inverters - Nairobi', yield: 92, color: 'bg-solar-amber' },
                    { name: 'Battery Modules - Doha', yield: 7, color: 'bg-rose-500' },
                    { name: 'Solar Pumps - Kisumu', yield: 78, color: 'bg-solar-forest' }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.name} 
                      className="space-y-2 group/asset cursor-help"
                      whileHover={{ x: 5 }}
                    >
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-solar-forest group-hover/asset:text-solar-amber transition-colors">{item.name}</span>
                          <span className={cn(item.yield < 20 ? "text-rose-500" : "text-solar-amber")}>{item.yield}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-solar-paper rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${item.yield}%` }}
                             transition={{ duration: 1, delay: i * 0.2 }}
                             className={cn("h-full transition-all", item.color)} 
                          />
                       </div>
                    </motion.div>
                  ))}
               </div>
               <AnimatePresence>
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-8 p-4 bg-solar-amber/10 border border-solar-amber/20 rounded-xl"
                 >
                    <p className="text-[9px] text-solar-forest font-bold leading-relaxed flex items-start gap-2">
                       <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-rose-500 animate-bounce" />
                       Nexus System Alert: Doha logistics below threshold. AI has paused 2 high-spend target campaigns.
                    </p>
                 </motion.div>
               </AnimatePresence>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-solar-border p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                  <Globe className="w-32 h-32" />
               </div>
               <div className="w-16 h-16 bg-solar-paper rounded-2xl flex items-center justify-center text-solar-forest relative z-10">
                  <Globe className="w-8 h-8" />
               </div>
               <div className="relative z-10">
                  <h4 className="font-serif font-bold text-lg text-solar-forest">System Integrity</h4>
                  <p className="text-[10px] text-solar-sage font-medium uppercase mt-1">Autonomous Uptime: 99.9%</p>
               </div>
               <div className="w-full h-[1px] bg-solar-border relative z-10" />
               <div className="grid grid-cols-2 w-full gap-4 relative z-10">
                  <div className="p-4 bg-solar-paper rounded-2xl border border-solar-border/30">
                     <p className="text-[8px] font-black text-solar-sage uppercase mb-1">Signals</p>
                     <p className="text-lg font-serif font-black text-solar-forest">1.2k</p>
                  </div>
                  <div className="p-4 bg-solar-paper rounded-2xl border border-solar-border/30">
                     <p className="text-[8px] font-black text-solar-sage uppercase mb-1">Growth</p>
                     <p className="text-lg font-serif font-black text-solar-amber">+18%</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-solar-border p-8 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-forest">Reputation Center</h4>
                  <span className="text-[8px] font-black italic text-solar-sage bg-solar-paper px-2 py-1 rounded">GMB LIVE</span>
               </div>
               
               <div className="space-y-4">
                  {[
                    { author: 'Ahmed K.', rating: 5, comment: 'Exceptional solar installation team in Nairobi.', time: '2h ago' },
                    { author: 'Jane M.', rating: 4, comment: 'Product is great, delivery was slightly delayed but team was responsive.', time: '1d ago' }
                  ].map((review, i) => (
                    <div key={i} className="p-4 bg-solar-paper rounded-2xl border border-solar-border space-y-2">
                       <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-solar-forest">{review.author}</p>
                          <div className="flex text-solar-amber">
                            {[...Array(review.rating)].map((_, i) => <Sparkles key={i} size={8} className="fill-current" />)}
                          </div>
                       </div>
                       <p className="text-[10px] text-solar-sage italic leading-relaxed">"{review.comment}"</p>
                       <div className="pt-2 flex justify-between items-center">
                          <span className="text-[8px] font-medium text-solar-sage">{review.time}</span>
                          <button 
                             onClick={() => toast.success("Nexus is drafting an AI-aligned executive reply...")}
                             className="text-[8px] font-black uppercase text-solar-forest hover:text-solar-amber"
                          >
                             Draft AI Reply
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Global Transmissions */}
      <div className="bg-white rounded-[2.5rem] border border-solar-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-solar-border flex items-center justify-between">
          <h3 className="text-3xl font-serif font-bold text-solar-forest tracking-tight">Global Transmissions</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-solar-sage hover:text-solar-forest transition-colors">Archive View</button>
        </div>
        <div className="divide-y divide-solar-border">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-8 flex items-center justify-between hover:bg-solar-paper/30 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-solar-paper rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 text-solar-sage">
                  {post.platform === 'instagram' && <Instagram size={24} />}
                  {post.platform === 'linkedin' && <Linkedin size={24} />}
                  {post.platform === 'gmb' && <Globe size={24} />}
                </div>
                <div>
                  <p className="font-serif italic text-lg text-solar-forest leading-tight mb-1">{post.content}</p>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-solar-sage uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-solar-amber" />{post.scheduledAt || post.date}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-solar-forest" />{post.status}</span>
                  </div>
                </div>
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-solar-paper text-solar-sage opacity-0 group-hover:opacity-100 transition-all hover:bg-solar-border">
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
          {recentPosts.length === 0 && (
            <div className="p-20 text-center text-solar-sage italic font-serif opacity-40">
              Reception clear. No recent transmissions detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
