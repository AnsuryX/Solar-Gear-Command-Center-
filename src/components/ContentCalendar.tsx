import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Instagram, 
  Linkedin, 
  Globe, 
  Facebook,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Zap,
  Trash2,
  X
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateAndPopulateWeeklyCalendar, publishPostNow, runAutonomousCycle } from '../services/contentQueueService';

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [strategyContext, setStrategyContext] = useState('Sustainable energy ROI and high-impact commercial solar installations in Nairobi and Doha.');
  const [newPost, setNewPost] = useState({ content: '', platform: 'instagram', date: format(new Date(), 'yyyy-MM-dd') });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connections, setConnections] = useState({
    linkedin: !!localStorage.getItem('linkedin_token'),
    instagram: !!localStorage.getItem('instagram_token'),
    gmb: !!localStorage.getItem('gmb_token'),
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { platform, token } = event.data;
        if (platform === 'google') {
          localStorage.setItem('google_token', token);
          localStorage.setItem('gmb_token', token);
          setConnections(prev => ({ ...prev, gmb: true }));
          toast.success("Google Ecosystem (GA4 & GMB) linked!");
        } else {
          localStorage.setItem(`${platform}_token`, token);
          setConnections(prev => ({ ...prev, [platform]: true }));
          toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} linked successfully!`);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch posts
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(p);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'posts'));

    return () => unsubscribe();
  }, []);

  const pendingPosts = posts.filter(p => p.status === 'pending_approval');
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleConnect = async (platform: 'linkedin' | 'meta' | 'google') => {
    try {
      const scope = platform === 'google' 
        ? 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/analytics.readonly'
        : undefined;
        
      const res = await fetch(`/api/auth/${platform}/url` + (scope ? `?scope=${encodeURIComponent(scope)}` : ''));
      const { url } = await res.json();
      window.open(url, 'Connect Service', 'width=600,height=700');
    } catch (error) {
      toast.error(`Handshake failed. Interface signal degraded.`);
    }
  };

  const handleGenerateStrategy = async () => {
    setIsSubmitting(true);
    const id = toast.loading("AI Strategy Core is calculating...");
    try {
      await generateAndPopulateWeeklyCalendar(strategyContext);
      toast.success("Strategy deployed to calendar! Awaiting approval.", { id });
      setIsStrategyModalOpen(false);
    } catch (error) {
      toast.error("Strategy calculation failed", { id });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (post: any) => {
    const id = toast.loading(`Broadcasting to ${post.platform}...`);
    try {
      await publishPostNow(post);
      toast.success("Transmission successful!", { id });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Broadcast failed", { id });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      toast.success("Post removed from queue");
    } catch (error) {
      toast.error("Cleanup failed");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        status: 'pending_approval',
        scheduledAt: newPost.date,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Post queued for approval!");
      setIsModalOpen(false);
      setNewPost({ content: '', platform: 'instagram', date: format(new Date(), 'yyyy-MM-dd') });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber mb-2">
            <span className="w-8 h-[1px] bg-solar-amber" />
            Global Transmissions
          </div>
          <h1 className="text-5xl font-serif font-bold text-solar-forest tracking-tighter">Content Flow</h1>
          <p className="text-solar-sage mt-1 font-medium italic">Orchestrating multi-platform brand intelligence</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
             onClick={() => {
               const auto = localStorage.getItem('autonomous_mode') === 'true';
               if (auto) {
                  const id = toast.loading("Nexus is architecting an autonomous week...");
                  runAutonomousCycle(strategyContext)
                    .then(() => toast.success("Autonomous transmission staged!", { id }))
                    .catch(() => toast.error("Strategy sync failed.", { id }));
               } else {
                  setIsStrategyModalOpen(true);
               }
             }}
             className="bg-solar-amber text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:-translate-y-1 transition-all shadow-xl shadow-solar-amber/20"
          >
            <Zap className="w-4 h-4 fill-current" />
            {localStorage.getItem('autonomous_mode') === 'true' ? 'Auto-Pilot Run' : 'Strategic Blueprint'}
          </button>
          <button 
             onClick={() => setIsApprovalOpen(true)}
             className="relative bg-white border border-solar-border px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-solar-forest hover:bg-solar-paper transition-all flex items-center gap-3 shadow-sm"
          >
            <Clock className="w-4 h-4 text-solar-amber" />
            Review Queue
            {pendingPosts.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-solar-amber text-white flex items-center justify-center rounded-full text-[10px] border-2 border-white shadow-md">
                {pendingPosts.length}
              </span>
            )}
          </button>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-solar-paper border border-solar-border text-solar-forest px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-solar-border transition-all"
          >
            <Plus className="w-4 h-4" />
            Manual Post
          </button>
        </div>
      </header>

      {/* Connection Status */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
         <button 
           onClick={() => !connections.linkedin && handleConnect('linkedin')}
           className={cn(
             "flex-shrink-0 flex items-center gap-3 px-6 py-2.5 rounded-full border shadow-sm transition-all",
             connections.linkedin ? "bg-white border-solar-border" : "bg-sky-50 border-sky-100 hover:bg-sky-100"
           )}
         >
             <Linkedin size={14} className={connections.linkedin ? "text-sky-600" : "text-sky-400"} />
             <span className="text-[10px] font-black uppercase tracking-widest text-solar-sage">
               {connections.linkedin ? 'LinkedIn Linked' : 'Connect LinkedIn'}
             </span>
             <div className={cn("w-1.5 h-1.5 rounded-full", connections.linkedin ? 'bg-green-500' : 'bg-solar-amber animate-pulse')} />
         </button>

         <button 
           onClick={() => !connections.instagram && handleConnect('meta')}
           className={cn(
             "flex-shrink-0 flex items-center gap-3 px-6 py-2.5 rounded-full border shadow-sm transition-all",
             connections.instagram ? "bg-white border-solar-border" : "bg-rose-50 border-rose-100 hover:bg-rose-100"
           )}
         >
             <Instagram size={14} className={connections.instagram ? "text-rose-600" : "text-rose-400"} />
             <span className="text-[10px] font-black uppercase tracking-widest text-solar-sage">
               {connections.instagram ? 'Instagram Linked' : 'Connect Instagram'}
             </span>
             <div className={cn("w-1.5 h-1.5 rounded-full", connections.instagram ? 'bg-green-500' : 'bg-solar-amber animate-pulse')} />
         </button>

         <button 
           onClick={() => !connections.gmb && handleConnect('google')}
           className={cn(
             "flex-shrink-0 flex items-center gap-3 px-6 py-2.5 rounded-full border shadow-sm transition-all",
             connections.gmb ? "bg-white border-solar-border" : "bg-solar-paper border-solar-border hover:bg-solar-border"
           )}
         >
             <Globe size={14} className={connections.gmb ? "text-amber-600" : "text-solar-sage"} />
             <span className="text-[10px] font-black uppercase tracking-widest text-solar-sage">
               {connections.gmb ? 'GMB Linked' : 'Connect GMB'}
             </span>
             <div className={cn("w-1.5 h-1.5 rounded-full", connections.gmb ? 'bg-green-500' : 'bg-solar-amber animate-pulse')} />
         </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-[2.5rem] border border-[#E2E1D8] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-[#F9F8F3]">
           <h2 className="text-2xl font-serif font-bold text-[#2A2C24] flex items-center gap-6">
             {format(currentDate, 'MMMM yyyy')}
             <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2.5 bg-[#F9F8F3] hover:bg-[#E2E1D8] rounded-xl transition-colors border border-[#E2E1D8]/50">
                  <ChevronLeft className="w-5 h-5 text-[#5A5A40]" />
                </button>
                <button onClick={nextMonth} className="p-2.5 bg-[#F9F8F3] hover:bg-[#E2E1D8] rounded-xl transition-colors border border-[#E2E1D8]/50">
                  <ChevronRight className="w-5 h-5 text-[#5A5A40]" />
                </button>
             </div>
           </h2>
           <div className="flex gap-10">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="text-[10px] font-black uppercase text-[#8B8D7F] tracking-[0.2em]">{day}</span>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-7 border-t border-[#F9F8F3]">
          {calendarDays.map((day, i) => {
            const dayPosts = posts.filter(p => {
               const pDate = p.scheduledAt?.toDate() || new Date(p.scheduledAt);
               return isSameDay(pDate, day);
            });

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[160px] p-6 border-r border-b border-solar-border transition-all relative overflow-hidden",
                  !isSameMonth(day, monthStart) && "bg-solar-paper/40",
                  isSameDay(day, new Date()) && "bg-solar-amber/5 ring-1 ring-inset ring-solar-amber/20"
                )}
              >
                <span className={cn(
                  "text-[10px] font-black mb-4 block tracking-widest",
                  isSameDay(day, new Date()) ? "text-solar-amber" : "text-solar-sage",
                  !isSameMonth(day, monthStart) && "opacity-20"
                )}>
                  {format(day, 'd')}
                </span>

                <div className="space-y-2">
                   {dayPosts.map(post => {
                      const isPending = post.status === 'pending_approval';
                      const isPublished = post.status === 'published';
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={post.id} 
                          className={cn(
                            "p-3 rounded-2xl text-[10px] font-bold truncate flex items-center gap-3 shadow-sm border group cursor-pointer relative",
                            isPublished ? "bg-solar-forest text-white border-solar-forest" :
                            isPending ? "bg-white text-solar-sage border-solar-border border-dashed italic" :
                            post.platform === 'instagram' ? "bg-rose-50 text-rose-700 border-rose-100" :
                            post.platform === 'linkedin' ? "bg-sky-50 text-sky-700 border-sky-100" :
                            "bg-solar-paper text-solar-forest border-solar-border"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center",
                            isPublished ? "bg-white/10" : "bg-solar-paper"
                          )}>
                            {post.platform === 'instagram' && <Instagram size={12} />}
                            {post.platform === 'linkedin' && <Linkedin size={12} />}
                            {post.platform === 'gmb' && <Globe size={12} />}
                            {post.platform === 'facebook' && <Facebook size={12} />}
                          </div>
                          <span className="truncate flex-1">{post.content}</span>
                          {isPublished && <CheckCircle2 size={12} className="text-white/60" />}
                          {isPending && <Clock size={12} className="animate-pulse" />}
                        </motion.div>
                      );
                   })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy Generator Modal */}
      <AnimatePresence>
        {isStrategyModalOpen && (
          <div className="fixed inset-0 bg-solar-forest/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl border border-solar-border space-y-8 overflow-hidden relative"
             >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-solar-amber via-solar-forest to-solar-sage" />
                
                <div>
                   <h3 className="text-4xl font-serif font-bold text-solar-forest">Weekly Strategy Core</h3>
                   <p className="text-solar-sage mt-2 italic font-serif">Define your focus corridor and let the AI architect your week.</p>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-solar-sage">Market Context & Direction</label>
                   <textarea 
                     value={strategyContext}
                     onChange={(e) => setStrategyContext(e.target.value)}
                     className="w-full h-40 p-6 rounded-[2rem] bg-solar-paper border-solar-border focus:ring-2 focus:ring-solar-amber transition-all text-sm font-medium leading-relaxed resize-none shadow-inner"
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => setIsStrategyModalOpen(false)}
                     className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-solar-sage hover:text-solar-forest transition-colors"
                   >
                     Discard
                   </button>
                   <button 
                     onClick={handleGenerateStrategy}
                     disabled={isSubmitting}
                     className="flex-1 bg-solar-forest text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                     <Zap className="w-4 h-4 text-solar-amber" />
                     {isSubmitting ? 'Architecting...' : 'Deploy Blueprint'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approval Sidebar/Overlay */}
      <AnimatePresence>
        {isApprovalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsApprovalOpen(false)}
               className="fixed inset-0 bg-solar-forest/10 backdrop-blur-sm"
             />
             <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg bg-white h-screen shadow-2xl p-10 flex flex-col"
             >
                <div className="flex items-center justify-between mb-12">
                   <div>
                     <h3 className="text-3xl font-serif font-bold text-solar-forest">Transmissions Queue</h3>
                     <p className="text-solar-sage text-[10px] font-black uppercase tracking-[0.2em] mt-1">Pending approval for global broadcast</p>
                   </div>
                   <button onClick={() => setIsApprovalOpen(false)} className="h-12 w-12 rounded-2xl bg-solar-paper flex items-center justify-center text-solar-sage hover:text-solar-forest transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                 <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                   {pendingPosts.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center space-y-6 grayscale opacity-40">
                        <div className="w-24 h-24 bg-solar-paper rounded-[2rem] flex items-center justify-center border-2 border-dashed border-solar-border">
                           <Clock className="w-10 h-10" />
                        </div>
                        <p className="font-serif italic text-lg text-solar-sage">Your frequency is clear. No transmissions pending.</p>
                     </div>
                   ) : (
                     pendingPosts.map(post => (
                        <motion.div 
                          layoutId={post.id}
                          key={post.id} 
                          className="bg-solar-paper/50 rounded-[2.5rem] border border-solar-border p-8 space-y-6 group hover:bg-white hover:shadow-xl hover:shadow-solar-forest/5 transition-all"
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-solar-border">
                                    {post.platform === 'instagram' && <Instagram className="w-5 h-5 text-rose-500" />}
                                    {post.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-sky-500" />}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-solar-sage">{post.platform}</span>
                              </div>
                              <span className="text-[9px] font-black uppercase text-solar-amber">{post.scheduledAt}</span>
                           </div>

                           <div className="space-y-4">
                              <p className="font-serif italic text-lg leading-relaxed text-solar-forest">{post.content}</p>
                              
                              {post.imagePrompt && (
                                <div className="p-4 bg-solar-paper border border-solar-border border-dashed rounded-xl">
                                   <p className="text-[8px] font-black uppercase tracking-widest text-solar-sage mb-1 flex items-center gap-2">
                                     <Sparkles className="w-3 h-3" /> Image Strategy
                                   </p>
                                   <p className="text-[10px] text-solar-sage italic leading-relaxed">{post.imagePrompt}</p>
                                </div>
                              )}
                           </div>

                           <div className="flex gap-4 pt-4">
                              <button 
                                onClick={() => handleDelete(post.id)}
                                className="h-14 w-14 rounded-2xl bg-white border border-solar-border flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                              >
                                 <Trash2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleApprove(post)}
                                className="flex-1 bg-solar-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-solar-forest/10 hover:shadow-solar-forest/20 transition-all group-hover:-translate-y-1"
                              >
                                 <Send className="w-4 h-4 text-solar-amber" />
                                 Approve & Go Live
                              </button>
                           </div>
                        </motion.div>
                     ))
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-solar-forest/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgb(0,0,0,0.1)] border border-solar-border space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif font-bold text-solar-forest tracking-tight">Manual Signal</h3>
                <p className="text-solar-sage text-sm mt-2 italic font-serif">Compose and stage for approval</p>
              </div>
              
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage">Platform</label>
                    <select 
                      value={newPost.platform}
                      onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                      className="w-full p-4 rounded-xl bg-solar-paper border-solar-border font-bold text-sm focus:ring-2 focus:ring-solar-forest transition-all"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="gmb">GMB (Local)</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage">Schedule Date</label>
                    <input 
                      type="date"
                      value={newPost.date}
                      onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                      className="w-full p-4 rounded-xl bg-solar-paper border-solar-border font-bold text-sm focus:ring-2 focus:ring-solar-forest transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage">Post Core Content</label>
                  <textarea 
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Capture the brand essence..."
                    className="w-full h-40 p-5 rounded-2xl bg-solar-paper border-solar-border font-medium text-sm focus:ring-2 focus:ring-solar-forest transition-all resize-none shadow-inner"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-solar-sage hover:bg-solar-paper hover:text-solar-forest transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-solar-forest text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl shadow-solar-forest/10 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Syncing...' : 'Stage Transmission'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
