
import React, { useState, useEffect } from 'react';
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
import Tooltip, { InfoBadge } from './components/Tooltip';
import { fetchTrendsFromWeb, DbService } from './geminiService';
import { ScrapeCreators } from './scrapeCreatorsService';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('trends');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [selectedTrend, setSelectedTrend] = useState<VideoTrend | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [watchlist, setWatchlist] = useState<VideoTrend[]>([]);
  const [followedAccounts, setFollowedAccounts] = useState<InstagramAccount[]>([]);
  const [trends, setTrends] = useState<VideoTrend[]>(MOCK_TRENDS);
  const [sources, setSources] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  
  // Global App State
  const [showTooltips, setShowTooltips] = useState(() => {
    const saved = localStorage.getItem('vibetrend_show_tooltips');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('vibetrend_show_tooltips', JSON.stringify(showTooltips));
  }, [showTooltips]);

  // SaaS Subscription State
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    isPro: false,
    usageCount: 0,
    usageLimit: 5,
    timeSaved: '12h'
  });

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const initApp = async () => {
      try {
        const check = await DbService.testConnection();
        setDbStatus(check.success ? 'online' : 'offline');
        
        const metadata = session.user.user_metadata;
        setSubscription({
          plan: metadata.plan || 'free',
          isPro: metadata.plan === 'pro' || metadata.plan === 'agency',
          usageCount: metadata.usage_count || 0,
          usageLimit: metadata.plan === 'pro' ? 50 : 5,
          timeSaved: '12h'
        });

        const dbKey = await DbService.getScKey();
        const localKey = localStorage.getItem('vibe_trend_sc_key');
        const finalKey = dbKey || localKey;

        if (finalKey) {
          ScrapeCreators.setKey(finalKey);
          if (!dbKey) await DbService.saveScKey(finalKey);
          if (!localKey) localStorage.setItem('vibe_trend_sc_key', finalKey);
        }

        const accounts = await DbService.getTrackedAccounts();
        setFollowedAccounts(accounts);

        if (finalKey) {
          handleLiveFetch('reels', accounts);
        }
      } catch (e) {
        console.error("Initialization Error:", e);
        setDbStatus('offline');
      }
    };
    initApp();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAuth(false);
    showToast("Вы вышли из системы");
  };

  const handleUpgrade = async (plan: 'pro' | 'agency') => {
    showToast(`Переходим к оплате плана ${plan}...`);
    setTimeout(() => {
      setSubscription(prev => ({ ...prev, plan, isPro: true, usageLimit: 50 }));
      showToast("Подписка успешно активирована!", "success");
      setActiveTab('trends');
    }, 1500);
  };

  const handleLiveFetch = async (query: string = 'Все', accountsContext = followedAccounts) => {
    const key = ScrapeCreators.getKey();
    if (!key) {
      showToast("Установите API ключ в настройках", "error");
      return;
    }

    setIsFetching(true);
    setIsFromCache(false);
    try {
      const { trends: newTrends, sources: newSources, fromCache } = await fetchTrendsFromWeb(query, accountsContext);
      if (newTrends.length > 0) {
        setTrends(newTrends);
        setSources(newSources);
        setIsFromCache(fromCache);
        if (!fromCache) showToast("Лента обновлена");
      } else {
        showToast("Новых видео не найдено", "error");
      }
    } catch (error) {
      showToast("Ошибка обновления", "error");
    } finally {
      setIsFetching(false);
    }
  };

  const toggleWatchlist = (trend: VideoTrend) => {
    const exists = watchlist.find(t => t.id === trend.id);
    if (exists) {
      setWatchlist(prev => prev.filter(t => t.id !== trend.id));
      showToast("Удалено из избранного");
    } else {
      setWatchlist(prev => [...prev, trend]);
      showToast("Сохранено в избранное");
    }
  };

  if (!session) {
    if (showAuth) {
      return (
        <>
          <AuthView onSuccess={() => setShowAuth(false)} />
          <button onClick={() => setShowAuth(false)} className="fixed top-10 left-10 z-[300] p-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest text-[#10141A]">← Назад</button>
        </>
      );
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />;
  }

  return (
    <div className="flex min-h-screen p-4 gap-4 relative selection:bg-[#83A2DB]/30">
      <nav className="w-20 lg:w-72 glass-panel rounded-[2.5rem] flex flex-col items-center py-8 shadow-2xl shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="mb-12 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#10141A] rounded-2xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 19h18L12 2z"/></svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 px-3 w-full overflow-y-auto no-scrollbar custom-scrollbar">
          <SidebarItem icon={<ICONS.AllVideos />} label="Главная" tooltip="Просмотр глобальной ленты трендов." isActive={activeTab === 'trends'} onClick={() => setActiveTab('trends')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.SearchWord />} label="Поиск по слову" tooltip="Поиск видео по ключевым словам и темам." isActive={activeTab === 'keyword_search'} onClick={() => setActiveTab('keyword_search')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.Radar />} label="Контент-радар" tooltip="Поиск аномалий: маленькие аккаунты с огромными охватами." isActive={activeTab === 'radar'} onClick={() => setActiveTab('radar')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.AudioLab />} label="Audio Lab" tooltip="Отслеживание трендовых аудиодорожек." isActive={activeTab === 'audio_lab'} onClick={() => setActiveTab('audio_lab')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.HookFactory />} label="Hook Factory" tooltip="Генератор виральных хуков." isActive={activeTab === 'hook_factory'} onClick={() => setActiveTab('hook_factory')} showTooltips={showTooltips} />
          
          <div className="h-px bg-slate-200/50 my-4 mx-4" />
          
          <SidebarItem icon={<ICONS.Channels />} label="Подписки" tooltip="Управление вашим списком авторов." isActive={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.Saved />} label="Шпионаж" tooltip="Ваши сохраненные видео." isActive={activeTab === 'watchlist'} onClick={() => setActiveTab('watchlist')} showTooltips={showTooltips} />
          <SidebarItem icon={<ICONS.Scripts />} label="Сценарии" tooltip="Генерация AI-сценариев." isActive={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} showTooltips={showTooltips} />
          
          <div className="h-px bg-slate-200/50 my-4 mx-4" />
          <SidebarItem icon={<ICONS.Settings />} label="Настройки" tooltip="Настройки профиля и API." isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} showTooltips={showTooltips} />
          
          <div className="mt-auto p-4 bg-[#10141A] rounded-[1.5rem] border border-white hidden lg:block mb-4 shadow-xl">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time Saved</span>
                <span className="text-[10px] font-black text-[#83A2DB]">{subscription.timeSaved}</span>
             </div>
             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#83A2DB] transition-all duration-1000" 
                  style={{ width: '65%' }}
                ></div>
             </div>
          </div>
        </div>
        <div className="px-3 w-full">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-4 rounded-3xl transition-all text-slate-400 hover:text-red-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Выйти</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-4 overflow-hidden">
        <header className="glass-panel rounded-[2.5rem] px-8 py-6 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-sm text-[#83A2DB]">
               {activeTab === 'trends' && <ICONS.AllVideos />}
               {activeTab === 'keyword_search' && <ICONS.SearchWord />}
               {activeTab === 'radar' && <ICONS.Radar />}
               {activeTab === 'audio_lab' && <ICONS.AudioLab />}
               {activeTab === 'hook_factory' && <ICONS.HookFactory />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#10141A]">
                   {activeTab === 'trends' && 'Главная'}
                   {activeTab === 'keyword_search' && 'Поиск по слову'}
                   {activeTab === 'radar' && 'Контент-радар'}
                   {activeTab === 'audio_lab' && 'Audio Lab'}
                   {activeTab === 'hook_factory' && 'Hook Factory'}
                   {activeTab === 'accounts' && 'Мои подписки'}
                   {activeTab === 'watchlist' && 'Шпионаж'}
                   {activeTab === 'scripts' && 'Сценарии'}
                   {activeTab === 'settings' && 'Настройки'}
                   {activeTab === 'analysis' && 'Анализ видео'}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${subscription.isPro ? 'bg-[#10141A] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {subscription.plan} Plan
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Пользователь</span>
               <span className="text-xs font-bold text-[#10141A]">{session.user.email}</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
           {activeTab === 'trends' && (
              <TrendsView 
                trends={trends} onAnalyze={(t) => { setSelectedTrend(t); setActiveTab('analysis'); }} 
                onSave={toggleWatchlist} watchlist={watchlist} 
                followedAccounts={followedAccounts} onAddAccount={(acc) => {
                  setFollowedAccounts(prev => [...prev, acc]);
                  showToast(`@${acc.username} добавлен`);
                }} 
                onToggleVisibility={(id) => {
                  setFollowedAccounts(prev => prev.map(a => a.id === id ? { ...a, isVisible: !a.isVisible } : a));
                }}
                isFetching={isFetching} sources={sources} fromCache={isFromCache}
                onRefresh={(q) => handleLiveFetch(q)}
                showTooltips={showTooltips}
              />
           )}
           {activeTab === 'keyword_search' && (
              <KeywordSearchView 
                onAnalyze={(t) => { setSelectedTrend(t); setActiveTab('analysis'); }}
                onSave={toggleWatchlist}
                watchlist={watchlist}
                showTooltips={showTooltips}
              />
           )}
           {activeTab === 'radar' && (
              <RadarView 
                trends={trends}
                onAnalyze={(t) => { setSelectedTrend(t); setActiveTab('analysis'); }}
                onSave={toggleWatchlist}
                watchlist={watchlist}
              />
           )}
           {activeTab === 'audio_lab' && <AudioLabView />}
           {activeTab === 'hook_factory' && <HookFactoryView />}
           
           {activeTab === 'accounts' && <AccountsView followedAccounts={followedAccounts} onToggleFollow={(acc) => {
             setFollowedAccounts(prev => prev.filter(a => a.id !== acc.id));
             showToast("Аккаунт удален");
           }} showTooltips={showTooltips} />}
           {activeTab === 'analysis' && (
              <AnalysisView 
                trend={selectedTrend} 
                onGoToScripts={(t, a) => {
                  setSelectedTrend(t);
                  setSelectedAnalysis(a);
                  setActiveTab('scripts');
                }} 
                onClose={() => setActiveTab('trends')}
                showTooltips={showTooltips}
              />
           )}
           {activeTab === 'scripts' && (
             <ScriptsView 
               initialTrend={selectedTrend} 
               initialAnalysis={selectedAnalysis} 
               onShowToast={showToast}
               onUsageUpdate={() => setSubscription(prev => ({ ...prev, usageCount: prev.usageCount + 1 }))}
               showTooltips={showTooltips}
             />
           )}
           {activeTab === 'watchlist' && <WatchlistView trends={watchlist} onAnalyze={(t) => { setSelectedTrend(t); setActiveTab('analysis'); }} onRemove={toggleWatchlist} />}
           {activeTab === 'settings' && (
              <SettingsView 
                user={session.user} 
                dbStatus={dbStatus} 
                onShowToast={showToast} 
                onKeySaved={() => handleLiveFetch()} 
                showTooltips={showTooltips}
                onToggleTooltips={() => setShowTooltips(!showTooltips)}
              />
           )}
           {activeTab === 'pricing' && <PricingView currentPlan={subscription.plan} onUpgrade={handleUpgrade} />}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-[#10141A] text-white border-white/10' : 'bg-red-600 text-white'}`}>
             <span className="text-xs font-bold">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem: React.FC<{icon: any, label: string, tooltip?: string, isActive: boolean, onClick: () => void, showTooltips: boolean}> = ({ icon, label, tooltip, isActive, onClick, showTooltips }) => {
  const content = (
    <button onClick={onClick} className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-4 rounded-3xl transition-all ${isActive ? 'bg-white/90 text-[#10141A] shadow-lg border border-white' : 'text-slate-500 hover:text-slate-900'}`}>
      <span className={isActive ? 'text-[#83A2DB]' : 'text-slate-500'}>{icon}</span>
      <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return showTooltips ? <Tooltip text={tooltip || label}>{content}</Tooltip> : content;
};

export default App;
