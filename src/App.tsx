import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  LayoutDashboard, 
  PlusSquare, 
  Settings, 
  TrendingUp, 
  LogOut, 
  Megaphone,
  User,
  Zap
} from 'lucide-react';
import { auth } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Components (will be created)
import Dashboard from './components/Dashboard';
import ContentCalendar from './components/ContentCalendar';
import AIStudio from './components/AIStudio';
import AdsManager from './components/AdsManager';
import SystemSettings from './components/SystemSettings';

type View = 'dashboard' | 'calendar' | 'ai' | 'ads' | 'settings';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Welcome, " + auth.currentUser?.displayName);
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Signed out");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f5f5f5] font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F8F3] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E1D8] text-center"
        >
          <div className="w-16 h-16 bg-[#E6AA3E] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#2A2C24] mb-2">Solar Gear</h1>
          <p className="text-[#8B8D7F] mb-8 font-serif italic text-lg tracking-tight">Marketing Command Hub</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-[#5A5A40] text-[#F9F8F3] py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-md"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'calendar', label: 'Live Pipeline', icon: CalendarIcon },
    { id: 'ai', label: 'Intelligence Studio', icon: PlusSquare },
    { id: 'ads', label: 'Growth Engine', icon: Megaphone },
  ];

  return (
    <div className="flex h-screen bg-solar-paper font-sans text-solar-forest overflow-hidden selection:bg-solar-amber/20 selection:text-solar-forest">
      <Toaster position="top-right" />
      
      {/* Sidebar - Floating Aesthetic */}
      <aside className="w-72 p-6 flex-shrink-0">
        <div className="h-full bg-white rounded-[2.5rem] border border-solar-border shadow-[0_8px_40px_rgba(0,0,0,0.02)] flex flex-col items-stretch overflow-hidden relative group">
          {/* Decorative grain/texture (simulated) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]" />

          <div className="p-8 pb-4 flex items-center gap-4 relative">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-12 h-12 bg-solar-amber rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-solar-amber/20"
            >
              <Zap className="text-white w-6 h-6 fill-white" />
            </motion.div>
            <div>
              <span className="font-serif font-bold text-2xl text-solar-forest block tracking-tight">SolaGear</span>
              <span className="text-[9px] uppercase font-black text-solar-sage tracking-[0.3em] block mt-0.5">Commander</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-1 relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group/nav",
                  activeView === item.id 
                    ? "text-solar-forest font-bold" 
                    : "text-solar-sage hover:text-solar-forest font-medium"
                )}
              >
                {activeView === item.id && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-solar-paper rounded-2xl border border-solar-border/50"
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 relative z-10",
                  activeView === item.id ? "text-solar-amber" : "group-hover/nav:scale-110 transition-transform"
                )} />
                <span className="text-sm relative z-10">{item.label}</span>
                {activeView === item.id && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute right-4 w-1.5 h-1.5 bg-solar-amber rounded-full" 
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-6 mt-auto relative">
            <div className="bg-solar-paper/50 rounded-3xl p-4 border border-solar-border/40 backdrop-blur-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-solar-border">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt={user.displayName || ''} referrerPolicy="no-referrer" />
                   ) : (
                     <User className="w-5 h-5 text-solar-sage" />
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-solar-forest truncate">{user.displayName}</p>
                  <p className="text-[8px] text-solar-sage font-black uppercase tracking-[0.2em] mt-0.5">Master Admin</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-rose-600 hover:bg-rose-50 transition-colors font-bold text-xs uppercase tracking-widest border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 px-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-solar-sage">Command Hub</span>
             <span className="w-1 h-1 bg-solar-border rounded-full" />
             <span className="text-xs font-bold text-solar-forest capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={() => setActiveView('settings')}
              className={cn(
                "h-12 px-5 flex items-center gap-3 rounded-2xl border transition-all shadow-sm font-bold text-[10px] uppercase tracking-widest",
                activeView === 'settings' 
                  ? "bg-solar-forest text-white border-solar-forest" 
                  : "bg-white text-solar-forest border-solar-border hover:shadow-md"
              )}
            >
              <Settings className="w-4 h-4" />
              System Config
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeView === 'dashboard' && <Dashboard />}
              {activeView === 'calendar' && <ContentCalendar />}
              {activeView === 'ai' && <AIStudio />}
              {activeView === 'ads' && <AdsManager />}
              {activeView === 'settings' && <SystemSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
