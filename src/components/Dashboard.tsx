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
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { runAutonomousCycle } from '../services/contentQueueService';
import { generateVisionNarrative } from '../services/geminiService';
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
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', auth.currentUser.uid),
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

      {/* Performance Tickers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Market Sentiment', val: 'Bullish', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Network Reach', val: '24.8k', icon: Users, color: 'text-solar-forest' },
          { label: 'Signals Captured', val: '142', icon: Zap, color: 'text-solar-amber' },
          { label: 'ROAS Index', val: '5.2x', icon: ArrowUpRight, color: 'text-solar-forest' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-solar-border shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
          >
            <div className={cn("w-12 h-12 rounded-2xl bg-solar-paper flex items-center justify-center", stat.color)}>
               <stat.icon size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-solar-sage">{stat.label}</p>
               <p className="text-xl font-serif font-black text-solar-forest">{stat.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nexus Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-solar-border p-10 shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-solar-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all group-hover:bg-solar-amber/10" />
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-serif font-bold text-solar-forest">Signal Reception</h3>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-solar-paper rounded-lg text-[8px] font-black uppercase tracking-widest text-solar-sage flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" /> Live Market Mix
                     </span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-6 bg-solar-paper/50 rounded-2xl border border-solar-border flex items-start gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-solar-amber">
                        <Sparkles className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-solar-forest mb-1">Growth Signal: Commercial ROI</h4>
                        <p className="text-xs text-solar-sage leading-relaxed italic">Market analysis indicates a 14% surge in local search for "Solar Lease Kenya". AI recommending shift towards zero-initial-cost financing narratives in LinkedIn transmissions.</p>
                     </div>
                  </div>
                  <div className="p-6 bg-solar-paper/50 rounded-2xl border border-solar-border flex items-start gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-solar-forest">
                        <TrendingUp className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-solar-forest mb-1">Atmospheric Intelligence</h4>
                        <p className="text-xs text-solar-sage leading-relaxed italic">Nairobi Heatwave Index rising. Engine Room host automatically prepared 3 cooling solution campaigns for the next 48hr window.</p>
                     </div>
                  </div>
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
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage mb-6">Asset Health Dashboard</h4>
               <div className="space-y-6">
                  {['Inverters - Nairobi Hub', 'Battery Modules - Doha', 'Solar Pumps - Kisumu'].map((item, i) => (
                    <div key={item} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-solar-forest">{item}</span>
                          <span className={i === 1 ? "text-rose-500" : "text-solar-amber"}>{i === 1 ? '7%' : (92 - i*15) + '%'}</span>
                       </div>
                       <div className="w-full h-1.5 bg-solar-paper rounded-full overflow-hidden">
                          <div 
                             className={cn("h-full transition-all duration-1000", i === 1 ? "bg-rose-500" : "bg-solar-amber")} 
                             style={{ width: i === 1 ? '7%' : (92 - i*15) + '%' }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 bg-solar-amber/10 border border-solar-amber/20 rounded-xl">
                  <p className="text-[9px] text-solar-forest font-bold leading-relaxed flex items-start gap-2">
                     <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                     Critical: Doha logistics below threshold. AI has paused 2 high-spend campaigns.
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-solar-border p-8 shadow-sm flex flex-col items-center text-center space-y-6">
               <div className="w-16 h-16 bg-solar-paper rounded-2xl flex items-center justify-center text-solar-forest">
                  <Globe className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-serif font-bold text-lg text-solar-forest">System Integrity</h4>
                  <p className="text-[10px] text-solar-sage font-medium uppercase mt-1">Autonomous Uptime: 99.9%</p>
               </div>
               <div className="w-full h-[1px] bg-solar-border" />
               <div className="grid grid-cols-2 w-full gap-4">
                  <div className="p-4 bg-solar-paper rounded-2xl">
                     <p className="text-[8px] font-black text-solar-sage uppercase mb-1">Signals</p>
                     <p className="text-lg font-serif font-black text-solar-forest">1.2k</p>
                  </div>
                  <div className="p-4 bg-solar-paper rounded-2xl">
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
