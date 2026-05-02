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
  Zap
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
        
        <div className="flex gap-4">
          <button className="bg-solar-forest text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-solar-forest/20 hover:-translate-y-1 transition-all flex items-center gap-3">
            Strategy Hub
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 grid-rows-2 gap-6 min-h-[700px]">
        
        {/* Main Performance Chart - Large Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 row-span-2 bg-white rounded-[3rem] border border-solar-border p-10 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <TrendingUp className="w-40 h-40" />
          </div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="font-serif text-3xl text-solar-forest tracking-tight">Campaign Velocity</h2>
              <p className="text-solar-sage text-xs font-bold uppercase tracking-widest mt-1">Rolling 7-day conversion lift</p>
            </div>
            <div className="flex gap-6">
               <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-solar-sage">
                  <span className="w-2.5 h-2.5 bg-solar-forest rounded-full shadow-sm" /> Organic
               </span>
               <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-solar-sage">
                  <span className="w-2.5 h-2.5 bg-solar-amber rounded-full shadow-sm" /> Paid Performance
               </span>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
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

          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-solar-border/50">
             {[
               { label: 'Avg ROAS', val: '4.2x', trend: '+0.4' },
               { label: 'CPA', val: '$12.4', trend: '-2.1' },
               { label: 'Conv. Rate', val: '5.8%', trend: '+1.2' }
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
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -5 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 p-8 bg-solar-amber text-white rounded-[2.5rem] shadow-xl shadow-solar-amber/30 flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
             <Zap className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">System Efficiency</p>
            <h3 className="text-5xl font-serif font-bold mt-2 tracking-tighter">94.2%</h3>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs font-bold mt-8">
            <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-md flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12% Lift
            </div>
            <span>vs Last Period</span>
          </div>
        </motion.div>

        {/* Channels Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 p-8 bg-white border border-solar-border rounded-[2.5rem] shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-solar-forest">Channel Distribution</h3>
            <div className="p-2 bg-solar-paper rounded-xl">
               <Globe className="w-5 h-5 text-solar-sage" />
            </div>
          </div>
          <div className="space-y-5">
            {[
              { name: 'Instagram', val: 45, color: '#E6AA3E' },
              { name: 'LinkedIn', val: 30, color: '#2A2C24' },
              { name: 'GMB / Local', val: 25, color: '#8B8D7F' }
            ].map(ch => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-solar-sage">
                  <span>{ch.name}</span>
                  <span className="text-solar-forest">{ch.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-solar-paper rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ch.val}%` }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Second Row of Bento */}
      <div className="grid grid-cols-12 gap-6">
         {/* Recent Activity - Wide Tile */}
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-white border border-solar-border rounded-[3rem] p-10 overflow-hidden"
         >
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-serif text-3xl text-solar-forest tracking-tight">Recent Content Deployments</h3>
             <button className="text-xs font-black uppercase tracking-widest text-solar-sage hover:text-solar-amber transition-colors">View All</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.length === 0 ? (
                <div className="col-span-2 text-center py-20 bg-solar-paper/30 rounded-[2rem] border border-dashed border-solar-border">
                   <p className="font-serif italic text-solar-sage text-lg">No active broadcasts detected.</p>
                </div>
              ) : (
                recentPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-5 p-5 bg-solar-paper/40 rounded-3xl border border-solar-border/30 group hover:bg-white hover:shadow-xl hover:shadow-solar-forest/5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-solar-border flex items-center justify-center flex-shrink-0 group-hover:bg-solar-amber group-hover:border-solar-amber transition-colors">
                        {post.platform === 'instagram' && <Instagram className="w-6 h-6 text-solar-sage group-hover:text-white" />}
                        {post.platform === 'linkedin' && <Linkedin className="w-6 h-6 text-solar-sage group-hover:text-white" />}
                        {post.platform === 'gmb' && <Globe className="w-6 h-6 text-solar-sage group-hover:text-white" />}
                        {post.platform === 'facebook' && <Facebook className="w-6 h-6 text-solar-sage group-hover:text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-solar-forest truncate mb-1">{post.content}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-solar-sage">{post.platform}</span>
                        <span className="w-1 h-1 bg-solar-border rounded-full" />
                        <div className="px-2 py-0.5 bg-solar-forest text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                          {post.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
           </div>
         </motion.div>

         {/* Mini Map or Location Stat */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="col-span-12 lg:col-span-4 bg-solar-forest text-white rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden"
         >
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-solar-sage">Target Market</p>
              <h3 className="text-3xl font-serif font-bold mt-2 tracking-tight">Nairobi, Kenya</h3>
              <div className="h-40 w-full bg-white/5 rounded-[2rem] mt-6 border border-white/10 flex items-center justify-center">
                 <Globe className="w-20 h-20 text-white/10 animate-pulse" />
              </div>
           </div>
           <div className="relative z-10 mt-8 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-solar-sage">Avg CTR</p>
                <p className="text-xl font-bold">12.4%</p>
              </div>
              <div className="h-12 w-12 bg-solar-amber rounded-2xl flex items-center justify-center shadow-lg shadow-solar-amber/20">
                <ArrowUpRight className="w-6 h-6 font-bold" />
              </div>
           </div>
         </motion.div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
