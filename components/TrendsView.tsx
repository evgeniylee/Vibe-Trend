
import React, { useState } from 'react';
import { VideoTrend, InstagramAccount } from '../types';
import FilterBar from './FilterBar';
import TrendCard from './TrendCard';
import { searchInstagramAccount } from '../geminiService';

interface TrendsViewProps {
  trends: VideoTrend[];
  onAnalyze: (trend: VideoTrend) => void;
  onSave: (trend: VideoTrend) => void;
  watchlist: VideoTrend[];
  followedAccounts: InstagramAccount[];
  onAddAccount: (account: InstagramAccount) => void;
  onToggleVisibility: (id: string) => void;
  isFetching?: boolean;
  sources?: any[];
  fromCache?: boolean;
  onRefresh?: (query: string) => void;
  // Add showTooltips prop to fix TypeScript error in App.tsx
  showTooltips?: boolean;
}

const TrendsView: React.FC<TrendsViewProps> = ({ 
  trends, 
  onAnalyze, 
  onSave, 
  watchlist, 
  followedAccounts,
  onAddAccount,
  onToggleVisibility,
  isFetching, 
  sources,
  fromCache,
  onRefresh,
  // Destructure showTooltips with a default value
  showTooltips = true
}) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<InstagramAccount | null>(null);

  const categories = ['Все', 'Лайфстайл', 'Путешествия', 'IT', 'Мода', 'Обучение', 'Фитнес'];
  const hasFollows = followedAccounts.length > 0;

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (onRefresh) onRefresh(cat);
  };

  // Фильтруем тренды только если пользователь явно скрыл автора из Радара
  const filteredTrends = (trends || []).filter(t => {
    if (!t?.creator) return true;
    const creatorUsername = t.creator.replace('@', '').toLowerCase();
    const followedAcc = followedAccounts.find(a => a.username?.toLowerCase() === creatorUsername);
    // Если аккаунт в подписках и он выключен - скрываем. В остальных случаях показываем.
    return followedAcc ? followedAcc.isVisible !== false : true;
  });

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const data = await searchInstagramAccount(searchQuery);
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-center w-full -mb-4">
        {hasFollows && (
          <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 shadow-xl shadow-black/[0.03] border border-white/80 animate-in zoom-in-95 duration-500">
            <div className="flex -space-x-3 items-center px-2">
              {followedAccounts.map((account, idx) => (
                <div 
                  key={account.id} 
                  onClick={() => onToggleVisibility(account.id)}
                  className="relative group cursor-pointer"
                  style={{ zIndex: followedAccounts.length - idx }}
                >
                  <div className={`w-11 h-11 rounded-full border-4 border-white overflow-hidden transition-all duration-300 bg-slate-50 ${account.isVisible !== false ? 'scale-110 shadow-lg' : 'grayscale opacity-40 scale-90'}`}>
                    <img 
                      src={account.avatar} 
                      className="w-full h-full object-cover" 
                      alt={account.username} 
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${account.username}`; }}
                    />
                  </div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transition-colors ${account.isVisible !== false ? 'bg-[#83A2DB]' : 'bg-slate-300'}`}>
                    <span className="text-[7px] text-white font-black">{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => { document.querySelector('input')?.focus(); }}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#10141A] hover:text-white transition-all shadow-inner border border-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        )}
      </div>

      <section className="glass-panel rounded-[3rem] p-8 shadow-sm border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-[#10141A] tracking-tight">
                {hasFollows ? 'Контент-поток' : 'Глобальные тренды'}
              </h2>
              {fromCache && (
                <span className="px-3 py-1 bg-green-50 text-[9px] font-black text-green-600 rounded-full border border-green-100 uppercase tracking-tighter">
                  Shared Cache
                </span>
              )}
              {!fromCache && !isFetching && <span className="px-3 py-1 bg-[#83A2DB]/10 text-[9px] font-black text-[#83A2DB] rounded-full border border-[#83A2DB]/20 uppercase tracking-tighter">Live API</span>}
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Популярное в Instagram & TikTok прямо сейчас
            </p>
          </div>
          <form onSubmit={handleQuickSearch} className="relative group min-w-[320px]">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти автора: @username"
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/10 focus:border-[#83A2DB] transition-all group-hover:border-slate-300 shadow-sm"
            />
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
               {isSearching ? (
                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               )}
            </div>
          </form>
        </div>

        {searchResult && (
          <div className="mb-8 p-6 bg-[#10141A] rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-300 shadow-2xl shadow-black/20">
             <img 
              src={searchResult.avatar} 
              className="w-16 h-16 rounded-full border-2 border-white/20" 
              onError={(e) => { (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${searchResult.username}`; }}
             />
             <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg">@{searchResult.username}</h4>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{searchResult.description}</p>
             </div>
             <div className="flex gap-4 items-center">
                <button 
                  onClick={() => { onAddAccount(searchResult); setSearchResult(null); setSearchQuery(''); }}
                  className="px-8 py-3 bg-[#83A2DB] rounded-2xl text-xs font-black uppercase hover:bg-white hover:text-[#10141A] transition-all"
                >
                  Добавить в радар
                </button>
             </div>
          </div>
        )}

        <FilterBar 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={handleCategorySelect} 
          // Pass showTooltips to FilterBar
          showTooltips={showTooltips}
        />
      </section>

      {!isFetching && filteredTrends.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center glass-panel rounded-[3rem] border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <h3 className="text-lg font-bold text-slate-900">Ничего не найдено</h3>
           <p className="text-slate-400 text-sm max-w-xs mt-2">Попробуйте сменить категорию или обновить ленту.</p>
        </div>
      ) : isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse">
              <div className="aspect-[4/5] bg-slate-100"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTrends.map(trend => (
            <TrendCard 
              key={trend.id}
              trend={trend}
              isSaved={watchlist.some(t => t.id === trend.id)}
              onAnalyze={onAnalyze}
              onSave={onSave}
              // Pass showTooltips to TrendCard
              showTooltips={showTooltips}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendsView;
