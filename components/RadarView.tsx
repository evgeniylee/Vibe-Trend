
import React, { useState, useMemo } from 'react';
import { VideoTrend } from '../types';
import TrendCard from './TrendCard';
import { InfoBadge } from './Tooltip';

interface RadarViewProps {
  trends: VideoTrend[];
  onAnalyze: (trend: VideoTrend) => void;
  onSave: (trend: VideoTrend) => void;
  watchlist: VideoTrend[];
}

type AnomalyFilter = 'All' | 'Underdog' | 'Rocket' | 'Silent Viral';

const RadarView: React.FC<RadarViewProps> = ({ trends, onAnalyze, onSave, watchlist }) => {
  const [activeFilter, setActiveFilter] = useState<AnomalyFilter>('All');
  
  const anomalies = useMemo(() => {
    return trends.filter(t => {
      const isOutlier = t.isAnomaly || (t.viewsNumber && t.creatorFollowers && t.viewsNumber > t.creatorFollowers * 10);
      if (!isOutlier) return false;
      if (activeFilter === 'All') return true;
      return t.anomalyType === activeFilter;
    });
  }, [trends, activeFilter]);

  const stats = useMemo(() => ({
    underdogs: trends.filter(t => t.anomalyType === 'Underdog').length,
    totalAnomalies: trends.filter(t => t.isAnomaly).length,
    avgMultiplier: Math.round(trends.reduce((acc, t) => acc + (t.anomalyMultiplier || 0), 0) / (trends.filter(t => t.anomalyMultiplier).length || 1))
  }), [trends]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Dashboard Header */}
      <div className="glass-panel rounded-[3.5rem] p-10 md:p-14 border border-white shadow-2xl shadow-black/[0.03] relative overflow-hidden">
        {/* Radar Pulse Animation Overlay */}
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <div className="relative w-40 h-40">
              <div className="absolute inset-0 border-4 border-[#83A2DB] rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 border-2 border-[#CE6969] rounded-full animate-ping opacity-10" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-10 border border-slate-300 rounded-full"></div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
           <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#CE6969] rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                 </span>
                 Live Anomaly Detection
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#10141A] tracking-tight mb-6">Контент-радар</h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Мы сканируем миллионы видео, чтобы найти идеи, которые «взорвали» охваты на маленьких аккаунтах. Это самые чистые тренды, работающие за счет идеи, а не медийности.
              </p>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
              <MetricBox label="Найдено аномалий" value={stats.totalAnomalies.toString()} color="#10141A" />
              <MetricBox label="Под прицелом" value={stats.underdogs.toString()} color="#CE6969" sub="Underdogs" />
              <MetricBox label="Ср. Множитель" value={`${stats.avgMultiplier}x`} color="#83A2DB" tooltip="Во сколько раз больше просмотров, чем подписчиков" />
           </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex bg-white/50 p-1.5 rounded-[2rem] border border-white shadow-sm overflow-x-auto no-scrollbar max-w-full">
            {(['All', 'Underdog', 'Rocket', 'Silent Viral'] as AnomalyFilter[]).map(f => (
               <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f ? 'bg-[#10141A] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {f === 'All' ? 'Все аномалии' : f}
               </button>
            ))}
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Отображается: <span className="text-[#10141A]">{anomalies.length} объектов</span>
         </p>
      </div>

      {/* Results Grid */}
      {anomalies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {anomalies.map(trend => (
            <div key={trend.id} className="relative group">
               {/* Anomaly Badge Overlay */}
               {trend.anomalyMultiplier && (
                  <div className="absolute -top-3 -right-3 z-30 bg-[#10141A] text-white px-4 py-2 rounded-2xl text-[11px] font-black shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                     {trend.anomalyMultiplier}x MULTIPLIER
                  </div>
               )}
               <TrendCard 
                  trend={trend}
                  isSaved={watchlist.some(t => t.id === trend.id)}
                  onAnalyze={onAnalyze}
                  onSave={onSave}
               />
               {/* Anomaly Type Label */}
               <div className="mt-3 flex items-center justify-between px-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                    trend.anomalyType === 'Underdog' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                    trend.anomalyType === 'Rocket' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    Type: {trend.anomalyType || 'Outlier'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                     {trend.momentum} Growth
                  </span>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center glass-panel rounded-[3rem] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <h3 className="text-xl font-black text-slate-900">Аномалий по фильтру "{activeFilter}" не найдено</h3>
           <p className="text-slate-400 text-sm max-w-xs mt-2">Попробуйте расширить критерии поиска или сменить категорию.</p>
        </div>
      )}
    </div>
  );
};

const MetricBox = ({ label, value, color, sub, tooltip }: any) => (
  <div className="bg-white/40 p-5 rounded-[2rem] border border-white shadow-sm min-w-[120px] flex flex-col items-center justify-center text-center">
     <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter mb-1 flex items-center gap-1">
        {label}
        {tooltip && <InfoBadge text={tooltip} />}
     </p>
     <p className="text-2xl font-black" style={{ color }}>{value}</p>
     {sub && <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{sub}</p>}
  </div>
);

export default RadarView;
