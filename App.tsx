
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationTab, VideoTrend, InstagramAccount, AnalysisResult, UserSubscription } from './types';
import { ICONS, MOCK_TRENDS } from './constants';
import TrendsView from './components/TrendsView';
import KeywordSearchView from './components/KeywordSearchView';
import RadarView from './components/RadarView';
import AudioLabView from './components/AudioLabView';
import HookFactoryView from './components/HookFactoryView';
import AnalysisView from './components/AnalysisView';
import ScriptsView from './components/ScriptsView';
import WatchlistView from './components/WatchlistView';
import AccountsView from './components/AccountsView';
import SettingsView from './components/SettingsView';
import PricingView from './components/PricingView';
import AuthView from './components/AuthView';
import LandingPage from './components/LandingPage';
import Tooltip from './components/Tooltip';
import { fetchTrendsFromWeb, DbService } from './geminiService';
import { ScrapeCreators } from './scrapeCreatorsService';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('trends');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  // Feature State
  const [selectedTrend, setSelectedTrend] = useState<VideoTrend | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [watchlist, setWatchlist] = useState<VideoTrend[]>([]);
  const [followedAccounts, setFollowedAccounts] = useState<InstagramAccount[]>([]);
  const [trends, setTrends] = useState<VideoTrend[]>(MOCK_TRENDS);
  
  // UI State
  const [isFetching, setIsFetching] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showTooltips, setShowTooltips] = useState(() => {
    return JSON.parse(localStorage.getItem('vibetrend_show_tooltips') ?? 'true');
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Sync session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => authSub.unsubscribe();
  }, []);

  // Init App Data
  useEffect(() => {
    if (!session) return;

    const initAppData = async () => {
      try {
        setDbStatus('connecting');
        const dbKey = await DbService.getScKey();
        const localKey = localStorage.getItem('vibe_trend_sc_key');
        const finalKey = dbKey || localKey;

        if (finalKey) {
          ScrapeCreators.setKey(finalKey);
          if (!dbKey) await DbService.saveScKey(finalKey);
        }

        const accounts = await DbService.getTrackedAccounts();
        setFollowedAccounts(accounts);
        setDbStatus('online');

        // Initial fetch
        if (finalKey) handleLiveFetch('reels', accounts);
      } catch (e) {
        setDbStatus('offline');
      }
    };
    initAppData();
  }, [session]);

  const handleLiveFetch = async (query: string = 'Все', accountsContext = followedAccounts) => {
    if (!ScrapeCreators.getKey()) {
      showToast("Установите API ключ в настройках", "error");
      return;
    }

    setIsFetching(true);
    try {
      const { trends: newTrends } = await fetchTrendsFromWeb(query, accountsContext);
      if (newTrends.length > 0) {
        setTrends(newTrends);
      }
    } catch (error) {
      showToast("Ошибка обновления ленты", "error");
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAuth(false);
  };

  if (!session) {
    if (showAuth) return <AuthView onSuccess={() => setShowAuth(false)} />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />;
  }

  return (
    <div className="flex min-h-screen p-4 gap-4 relative">
      <nav className="w-20 lg:w-72 glass-panel rounded-[2.5rem] flex flex-col py-8 shadow-2xl sticky top-4 h-[calc(100vh-2rem)] shrink-0">
        <div className="mb-10 px-6 flex justify-center lg:justify-start">
           <Logo />
        </div>
        
        <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto no-scrollbar">
          <SidebarItem icon={<ICONS.AllVideos />} label="Главная" isActive={activeTab === 'trends'} onClick={() => setActiveTab('trends')} />
          <SidebarItem icon={<ICONS.SearchWord />} label="Поиск" isActive={activeTab === 'keyword_search'} onClick={() => setActiveTab('keyword_search')} />
          <SidebarItem icon={<ICONS.Radar />} label="Радар" isActive={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
          <SidebarItem icon={<ICONS.AudioLab />} label="Audio Lab" isActive={activeTab === 'audio_lab'} onClick={() => setActiveTab('audio_lab')} />
          
          <div className="h-px bg-slate-200/50 my-4 mx-4" />
          
          <SidebarItem icon={<ICONS.Channels />} label="Авторы" isActive={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
          <SidebarItem icon={<ICONS.Saved />} label="Шпионаж" isActive={activeTab === 'watchlist'} onClick={() => setActiveTab('watchlist')} />
          <SidebarItem icon={<ICONS.Scripts />} label="Сценарии" isActive={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} />
          
          <div className="mt-auto pt-4 border-t border-slate-100">
             <SidebarItem icon={<ICONS.Settings />} label="Настройки" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
             <button onClick={handleLogout} className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-4 rounded-3xl text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Выйти</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-4">
        <header className="glass-panel rounded-[2rem] px-8 py-6 flex items-center justify-between shadow-sm">
           <h1 className="text-xl font-black text-[#10141A] tracking-tight">
             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')}
           </h1>
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Account</p>
              <p className="text-xs font-bold">{session.user.email}</p>
           </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
           {activeTab === 'trends' && (
              <TrendsView 
                trends={trends} 
                onAnalyze={(t) => { setSelectedTrend(t); setActiveTab('analysis'); }} 
                onSave={(t) => setWatchlist(prev => prev.some(x => x.id === t.id) ? prev.filter(x => x.id !== t.id) : [...prev, t])}
                watchlist={watchlist} 
                followedAccounts={followedAccounts}
                onAddAccount={(acc) => setFollowedAccounts(p => [...p, acc])}
                onToggleVisibility={(id) => setFollowedAccounts(p => p.map(a => a.id === id ? {...a, isVisible: !a.isVisible} : a))}
                isFetching={isFetching}
                onRefresh={handleLiveFetch}
              />
           )}
           {activeTab === 'keyword_search' && <KeywordSearchView onAnalyze={t => { setSelectedTrend(t); setActiveTab('analysis'); }} onSave={t => setWatchlist(p => [...p, t])} watchlist={watchlist} />}
           {activeTab === 'radar' && <RadarView trends={trends} onAnalyze={t => { setSelectedTrend(t); setActiveTab('analysis'); }} onSave={t => setWatchlist(p => [...p, t])} watchlist={watchlist} />}
           {activeTab === 'analysis' && <AnalysisView trend={selectedTrend} onGoToScripts={(t, a) => { setSelectedTrend(t); setSelectedAnalysis(a); setActiveTab('scripts'); }} onClose={() => setActiveTab('trends')} />}
           {activeTab === 'scripts' && <ScriptsView initialTrend={selectedTrend} initialAnalysis={selectedAnalysis} onShowToast={showToast} />}
           {activeTab === 'watchlist' && <WatchlistView trends={watchlist} onAnalyze={t => { setSelectedTrend(t); setActiveTab('analysis'); }} onRemove={t => setWatchlist(p => p.filter(x => x.id !== t.id))} />}
           {activeTab === 'settings' && <SettingsView user={session.user} dbStatus={dbStatus} onShowToast={showToast} onToggleTooltips={() => setShowTooltips(!showTooltips)} showTooltips={showTooltips} />}
           {activeTab === 'audio_lab' && <AudioLabView />}
           {activeTab === 'accounts' && <AccountsView followedAccounts={followedAccounts} onToggleFollow={acc => setFollowedAccounts(p => p.filter(x => x.id !== acc.id))} />}
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-[#10141A] text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4">
           <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-[#10141A] rounded-xl flex items-center justify-center text-white shadow-lg">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 19h18L12 2z"/></svg>
    </div>
    <span className="hidden lg:block text-lg font-black tracking-tighter">VibeTrend <span className="text-[#83A2DB]">AI</span></span>
  </div>
);

const SidebarItem = ({ icon, label, isActive, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] transition-all ${isActive ? 'bg-white shadow-md text-[#10141A] border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
    <span className={isActive ? 'text-[#83A2DB]' : ''}>{icon}</span>
    <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
