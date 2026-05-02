import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Zap, 
  Brain,
  MoreVertical,
  ChevronRight,
  Target
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  where, 
  orderBy,
  serverTimestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { generateAIResponse } from '../services/aiService';

export default function ProjectCenter() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid || 'nexus-commander-001';
    const q = query(collection(db, 'projects'), where('authorId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
        setTasks([]);
        return;
    }
    const q = query(collection(db, 'tasks'), where('projectId', '==', selectedProjectId), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [selectedProjectId]);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        title,
        description,
        status: 'active',
        authorId: auth.currentUser?.uid || 'nexus-commander-001',
        createdAt: serverTimestamp(),
      });
      setIsNewProjectModalOpen(false);
      setSelectedProjectId(docRef.id);
      toast.success("Project blueprint initialized.");
      
      // Auto-generate tasks
      generateTasksForProject(docRef.id, title, description);
    } catch (e) {
      toast.error("Deployment failed.");
    }
  };

  const generateTasksForProject = async (projectId: string, title: string, description: string) => {
    setIsGeneratingTasks(true);
    const id = toast.loading("Nexus AI is architecting the action deck...");
    
    const prompt = `
      Project: ${title}
      Goal: ${description}
      
      Create 5-7 specific, actionable marketing and operational tasks for a solar energy firm.
      Return ONLY a JSON array: [{ "title": "...", "priority": "high" | "medium" | "low" }]
    `;

    try {
      const response = await generateAIResponse(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         const generatedTasks = JSON.parse(jsonMatch[0]);
         const promises = generatedTasks.map((task: any) => 
           addDoc(collection(db, 'tasks'), {
             ...task,
             projectId,
             status: 'backlog',
             authorId: auth.currentUser?.uid || 'nexus-commander-001',
             createdAt: serverTimestamp(),
           })
         );
         await Promise.all(promises);
         toast.success("AI Action Deck deployed.", { id });
      }
    } catch (e) {
      toast.error("Intelligence failure.", { id });
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'backlog' : 'completed';
    await updateDoc(doc(db, 'tasks', taskId), { status: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-solar-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-solar-forest/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <header className="flex justify-between items-end relative z-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-solar-amber mb-2">
             <span className="w-8 h-[1px] bg-solar-amber" />
             Strategic Orchestration
           </div>
           <h1 className="text-6xl font-serif font-bold text-solar-forest tracking-tighter">Command CRM</h1>
           <p className="text-solar-sage mt-2 italic font-serif text-lg">Architect tactical actions from global market signals.</p>
        </div>
        <button 
          onClick={() => setIsNewProjectModalOpen(true)}
          className="bg-solar-amber text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-solar-amber/30 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Initialize Project
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Project List */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-solar-border p-8 shadow-sm h-full flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-solar-sage mb-8 ml-2">Active Blueprints</h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar-thin">
                 {projects.map(project => (
                   <button 
                     key={project.id}
                     onClick={() => setSelectedProjectId(project.id)}
                     className={cn(
                       "w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group relative overflow-hidden",
                       selectedProjectId === project.id 
                         ? "bg-solar-forest text-white border-solar-forest shadow-2xl shadow-solar-forest/20" 
                         : "bg-solar-paper border-solar-border hover:bg-white hover:border-solar-amber/30"
                     )}
                   >
                      <div className="relative z-10">
                        <h4 className="font-serif font-bold text-lg">{project.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", project.status === 'active' ? "bg-green-500 animate-pulse" : "bg-solar-sage")} />
                          <p className={cn("text-[9px] font-black uppercase tracking-widest", selectedProjectId === project.id ? "text-white/60" : "text-solar-sage")}>
                            {project.status}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn("w-5 h-5 transition-transform relative z-10", selectedProjectId === project.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-solar-amber")} />
                   </button>
                 ))}
                 {projects.length === 0 && (
                   <div className="py-20 text-center opacity-40 grayscale space-y-4">
                      <Briefcase className="w-12 h-12 mx-auto text-solar-forest" />
                      <p className="font-serif italic text-lg text-solar-sage">No active objectives.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Task Deck */}
        <div className="lg:col-span-8 flex flex-col h-full">
           {selectedProjectId ? (
             <div className="bg-white rounded-[3rem] border border-solar-border p-10 shadow-xl shadow-solar-forest/5 flex-1 flex flex-col relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <Target className="w-64 h-64" />
                </div>
                
                <div className="mb-10 relative z-10">
                   <div className="flex items-center justify-between mb-4">
                       <div>
                          <h2 className="text-4xl font-serif font-bold text-solar-forest tracking-tight">
                            {projects.find(p => p.id === selectedProjectId)?.title}
                          </h2>
                          <p className="text-solar-sage italic text-sm mt-1 max-w-lg">{projects.find(p => p.id === selectedProjectId)?.description}</p>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <div className="px-4 py-2 bg-solar-paper rounded-xl border border-solar-border flex items-center gap-2 shadow-sm">
                             <CheckCircle2 className="w-4 h-4 text-green-500" />
                             <span className="text-[10px] font-black text-solar-forest uppercase tracking-widest">
                               {tasks.filter(t => t.status === 'completed').length} / {tasks.length} Deployed
                             </span>
                          </div>
                       </div>
                   </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar relative z-10 min-h-[400px]">
                   {tasks.map((task, i) => (
                     <motion.div 
                       key={task.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className={cn(
                        "p-6 rounded-2xl border flex items-center justify-between group transition-all",
                        task.status === 'completed' 
                          ? "bg-solar-paper/40 border-solar-border/50 opacity-60" 
                          : "bg-white border-solar-border hover:border-solar-amber/50 hover:shadow-lg hover:shadow-solar-amber/5"
                       )}
                     >
                        <div className="flex items-center gap-6">
                           <button 
                             onClick={() => toggleTaskStatus(task.id, task.status)}
                             className={cn(
                               "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all",
                               task.status === 'completed' 
                                 ? "bg-solar-amber border-solar-amber text-white shadow-lg shadow-solar-amber/30" 
                                 : "border-solar-border hover:border-solar-amber hover:bg-solar-amber/5 text-transparent hover:text-solar-amber/30"
                             )}
                           >
                              <CheckCircle2 size={16} />
                           </button>
                           <div>
                             <p className={cn("text-lg font-serif font-bold", task.status === 'completed' ? "line-through text-solar-sage" : "text-solar-forest")}>
                               {task.title}
                             </p>
                             <div className="flex items-center gap-3 mt-1.5">
                               <span className={cn(
                                 "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full",
                                 task.priority === 'high' ? "bg-rose-100 text-rose-600" : "bg-solar-paper text-solar-sage"
                               )}>
                                 {task.priority} Priority
                               </span>
                               {task.status === 'backlog' && (
                                 <span className="text-[8px] font-bold text-solar-amber italic">Staged for execution</span>
                               )}
                             </div>
                           </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-solar-paper rounded-xl">
                           <MoreVertical size={18} className="text-solar-sage" />
                        </button>
                     </motion.div>
                   ))}
                   
                   {isGeneratingTasks && (
                     <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 text-solar-sage animate-pulse">
                        <Brain size={40} className="text-solar-amber" />
                        <p className="font-serif italic text-lg">AI is synthesizing secondary tactical signals...</p>
                     </div>
                   )}
                </div>

                <div className="mt-8 pt-8 border-t border-solar-border flex justify-between">
                   <button 
                     onClick={() => generateTasksForProject(selectedProjectId, projects.find(p => p.id === selectedProjectId)?.title, projects.find(p => p.id === selectedProjectId)?.description)}
                     className="text-[10px] font-black uppercase tracking-widest text-solar-amber flex items-center gap-2 hover:underline"
                   >
                     <Zap size={14} /> Re-generate Action Deck
                   </button>
                   <button className="text-[10px] font-black uppercase tracking-widest text-solar-sage hover:text-solar-forest transition-colors">
                     Archive Project
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-solar-paper rounded-[3rem] border-2 border-dashed border-solar-border p-20 flex flex-col items-center justify-center text-center opacity-40 grayscale">
                <Target size={64} className="mb-6" />
                <h3 className="text-2xl font-serif font-bold text-solar-forest mb-2">Select a Command Objective</h3>
                <p className="text-sm max-w-sm">Choose an active blueprint on the left or initialize a new strategic target to begin orchestration.</p>
             </div>
           )}
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-solar-forest/20 backdrop-blur-md p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-[3rem] border border-solar-border p-12 max-w-xl w-full shadow-2xl"
             >
                <div className="mb-10">
                   <h2 className="text-4xl font-serif font-bold text-solar-forest tracking-tighter">Initialize Signal</h2>
                   <p className="text-solar-sage italic mt-1 font-serif">Define the strategic objective for Nexus to orchestrate.</p>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                   <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar-thin">
                      {[
                        { t: 'Market Entry', d: 'Architect a 30-day strategy to capture commercial solar leads in a new territory using local GMB and target LinkedIn ads.' },
                        { t: 'Retention Loop', d: 'Analyze existing client base to automate review collection and secondary upsell transmissions.' },
                        { t: 'Supply Optimization', d: 'Sync logistics inventory signals with ad spend to ensure zero-waste growth engine performance.' }
                      ].map(template => (
                        <button 
                          key={template.t}
                          type="button"
                          onClick={() => {
                            const titleInput = document.getElementsByName('title')[0] as HTMLInputElement;
                            const descInput = document.getElementsByName('description')[0] as HTMLTextAreaElement;
                            if (titleInput) titleInput.value = template.t;
                            if (descInput) descInput.value = template.d;
                            toast.success(`Signal template: ${template.t} applied.`);
                          }}
                          className="flex-shrink-0 px-4 py-2 bg-solar-paper border border-solar-border rounded-xl text-[8px] font-black uppercase text-solar-sage hover:bg-solar-amber hover:text-white transition-all"
                        >
                          {template.t}
                        </button>
                      ))}
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">Project Title</label>
                      <input 
                        name="title"
                        required
                        placeholder="e.g., Q3 Nairobi Expansion"
                        className="w-full p-6 rounded-[1.5rem] bg-solar-paper border-solar-border text-lg font-serif font-bold focus:shadow-xl transition-all outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-solar-sage ml-1">Executive Goal</label>
                      <textarea 
                        name="description"
                        required
                        rows={4}
                        placeholder="Detail the target outcomes and constraints..."
                        className="w-full p-6 rounded-[1.5rem] bg-solar-paper border-solar-border text-xs font-medium focus:shadow-xl transition-all outline-none resize-none"
                      />
                   </div>
                   
                   <div className="pt-6 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsNewProjectModalOpen(false)}
                        className="flex-1 bg-white border border-solar-border text-solar-sage py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-solar-paper transition-all"
                      >
                         Abort
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] bg-solar-forest text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-solar-forest/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                      >
                         <Zap size={18} className="text-solar-amber" />
                         Deploy Blueprint
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
