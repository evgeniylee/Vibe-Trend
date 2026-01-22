
import React, { useState, useMemo } from 'react';
import { AudioTrend } from '../types';
import { MOCK_AUDIO } from '../constants';
import { InfoBadge } from './Tooltip';

type TimeRange = 'day' | 'week' | 'month';

const AudioLabView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeNiche, setActiveNiche] = useState('All');

  const filteredAudio = useMemo(() => {
    return MOCK_AUDIO.filter(audio => {
      const matchesSearch = audio.name.toLowerCase().includes(search.toLowerCase()) || 
                          audio.creator.toLowerCase().includes(search.toLowerCase());
      const matchesNiche = activeNiche === 'All' || audio.topNiches.includes(activeNiche);
      return matchesSearch && matchesNiche;
    });
  }, [search, activeNiche]);

  const allNiches = useMemo(() => {
    const niches = new Set<string>(['All']);
    MOCK_AUDIO.forEach(a => a.topNiches.forEach(n => niches.add(n)));
    return Array.from(niches);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header & Controls */}
      <div className="glass-panel rounded-[3rem] p-8 md:p-12 border border-white shadow-2xl shadow-black/[0.02] flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-4xl font-black text-[#10141A] tracking-tight mb-4">Audio Lab</h2>
          <p className="text-slate-400 font-medium">
            Музыка — это 50% охвата. Мы анализируем не просто популярность, а темп роста и уровень "заезженности" звука.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col gap-4">
           {/* Search Bar */}
           <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или автору..."
                className="w-full lg:w-[400px] pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-inner transition-all"
              />
           </div>

           {/* Time Filters */}
           <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] self-center lg:self-end">
              {(['day', 'week', 'month'] as TimeRange[]).map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === t ? 'bg-white text-[#10141A] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t === 'day' ? 'День' : t === 'week' ? 'Неделя' : 'Месяц'}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Niches Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
         {allNiches.map(niche => (
           <button 
            key={niche}
            onClick={() => setActiveNiche(niche)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeNiche === niche ? 'bg-[#10141A] text-white border-[#10141A] shadow-lg' : 'bg-white text-slate-400 border-white hover:border-slate-200'}`}
           >
             {niche}
           </button>
         ))}
      </div>

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAudio.map(audio => (
          <AudioCard key={audio.id} audio={audio} />
        ))}
      </div>
    </div>
  );
};

const AudioCard: React.FC<{ audio: AudioTrend }> = ({ audio }) => {
  const getPredictionColor = () => {
    switch (audio.prediction) {
      case 'Rising Star': return 'text-green-500 bg-green-50 border-green-100';
      case 'Saturated': return 'text-red-500 bg-red-50 border-red-100';
      case 'Hidden Gem': return 'text-purple-500 bg-purple-50 border-purple-100';
      default: return 'text-blue-500 bg-blue-50 border-blue-100';
    }
  };

  const getVelocityIcon = () => {
    switch (audio.velocity) {
      case 'Sprinting': return '⚡⚡⚡';
      case 'Running': return '⚡⚡';
      default: return '⚡';
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[3rem] border border-white hover:scale-[1.02] transition-all group shadow-xl shadow-black/[0.01] flex flex-col gap-6 relative overflow-hidden">
      {/* Saturation Progress Background */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full overflow-hidden">
         <div 
           className={`h-full transition-all duration-1000 ${audio.saturation > 70 ? 'bg-red-400' : 'bg-[#83A2DB]'}`} 
           style={{ width: `${audio.saturation}%` }}
         ></div>
      </div>

      <div className="flex items-start justify-between">
         <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
               <img src={audio.thumbnail} className="w-full h-full object-cover rounded-[1.5rem] shadow-lg group-hover:rotate-6 transition-transform" />
               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
               </div>
            </div>
            <div>
               <h4 className="font-black text-[#10141A] tracking-tight group-hover:text-[#83A2DB] transition-colors line-clamp-1">{audio.name}</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{audio.creator}</p>
            </div>
         </div>
         <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getPredictionColor()}`}>
            {audio.prediction}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Использований</p>
            <div className="flex items-center justify-between">
               <span className="text-lg font-black text-[#10141A]">{audio.usageCount}</span>
               <span className="text-[10px] font-black text-green-500">{audio.growth}</span>
            </div>
         </div>
         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Velocity</p>
            <div className="flex items-center justify-between">
               <span className="text-sm font-black text-[#10141A] uppercase">{audio.velocity}</span>
               <span className="text-xs">{getVelocityIcon()}</span>
            </div>
         </div>
      </div>

      <div className="space-y-3">
         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Насыщенность ленты</span>
            <span className={audio.saturation > 70 ? 'text-red-500' : 'text-[#10141A]'}>{audio.saturation}%</span>
         </div>
         <div className="flex flex-wrap gap-2">
            {audio.topNiches.map(n => (
              <span key={n} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500">#{n}</span>
            ))}
         </div>
      </div>

      <button className="w-full py-4 bg-[#10141A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#83A2DB] transition-all shadow-xl shadow-black/5 mt-auto">
         Снять под этот звук
      </button>
    </div>
  );
};

export default AudioLabView;
