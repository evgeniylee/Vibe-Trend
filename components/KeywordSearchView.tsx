
import React, { useState } from 'react';
import { VideoTrend } from '../types';
import TrendCard from './TrendCard';
import { ScrapeCreators } from '../scrapeCreatorsService';
import { InfoBadge } from './Tooltip';

interface KeywordSearchViewProps {
  onAnalyze: (trend: VideoTrend) => void;
  onSave: (trend: VideoTrend) => void;
  watchlist: VideoTrend[];
  showTooltips?: boolean;
}

const KeywordSearchView: React.FC<KeywordSearchViewProps> = ({ 
  onAnalyze, 
  onSave, 
  watchlist, 
  showTooltips = true 
}) => {
  const [query, setQuery] = useState('');
  const [videoType, setVideoType] = useState('Reels');
  const [results, setResults] = useState<VideoTrend[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const keywords = ['продажи', 'бизнес', 'контент', 'продавать', 'реклама', 'крем', 'патчи', 'точно', 'книги', 'кожа'];

  const handleSearch = async (searchTerm: string = query) => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const data = await ScrapeCreators.getHashtagFeed(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const onTagClick = (tag: string) => {
    setQuery(tag);
    handleSearch(tag);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search Hero Section - Reduced height and updated gradient */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#4f5bd5] via-[#962fbf] via-[#d62976] to-[#fa7e1e] p-8 md:p-10 shadow-2xl shadow-purple-500/20">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <button className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest self-start">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
             Назад
          </button>

          <h2 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight">Новый поиск</h2>

          <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-4">
             {/* Main Input */}
             <div className="flex-1 relative w-full group">
                <div className="absolute inset-y-0 left-6 flex items-center text-white/50 group-focus-within:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="маркетинг"
                   className="w-full pl-14 pr-8 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] text-base font-bold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all shadow-xl"
                />
                <div className="absolute -bottom-5 left-6 text-[9px] font-black text-white/50 uppercase tracking-widest">Введите запрос, а мы найдем для Вас видео</div>
             </div>

             {/* Type Dropdown */}
             <div className="relative w-full md:w-44 group">
                <select 
                   value={videoType}
                   onChange={(e) => setVideoType(e.target.value)}
                   className="w-full px-8 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] text-base font-bold text-white appearance-none focus:outline-none focus:ring-4 focus:ring-white/10 transition-all shadow-xl cursor-pointer"
                >
                   <option value="Reels" className="text-black">Reels</option>
                   <option value="TikTok" className="text-black">TikTok</option>
                </select>
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/50">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="absolute -bottom-5 left-6 text-[9px] font-black text-white/50 uppercase tracking-widest">Тип видео</div>
             </div>

             {/* Search Button */}
             <button 
                onClick={() => handleSearch()}
                disabled={isSearching || !query}
                className="w-full md:w-auto px-10 py-5 bg-white/90 backdrop-blur-md text-[#10141A] rounded-[1.5rem] text-base font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
             >
                {isSearching ? '...' : 'Поиск'}
                <span className="flex items-center gap-1.5 text-[#EF4444]">
                   <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
                   1
                </span>
             </button>
          </div>

          {/* Keyword Tags */}
          <div className="mt-12 flex flex-wrap justify-center gap-2.5 max-w-4xl">
             {keywords.map(kw => (
                <button 
                   key={kw}
                   onClick={() => onTagClick(kw)}
                   className="px-5 py-2.5 bg-white hover:bg-black hover:text-white transition-all rounded-xl text-[13px] font-bold text-[#10141A] shadow-lg shadow-black/5"
                >
                   {kw}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-4">
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/50 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map(trend => (
              <TrendCard 
                key={trend.id}
                trend={trend}
                isSaved={watchlist.some(t => t.id === trend.id)}
                onAnalyze={onAnalyze}
                onSave={onSave}
                showTooltips={showTooltips}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-300">Введите ключевое слово выше</h3>
             <p className="text-slate-400 text-sm mt-2">Мы найдем самые виральные видео по вашему запросу</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordSearchView;
