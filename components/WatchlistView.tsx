
import React from 'react';
import { VideoTrend } from '../types';

interface WatchlistViewProps {
  trends: VideoTrend[];
  onAnalyze: (trend: VideoTrend) => void;
  onRemove: (trend: VideoTrend) => void;
}

const WatchlistView: React.FC<WatchlistViewProps> = ({ trends, onAnalyze, onRemove }) => {
  if (trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-slate-900 font-semibold text-lg">Ваш список пуст</h3>
        <p className="text-slate-500 mt-1 max-w-xs text-center">Сохраняйте видео из вкладки «Тренды», чтобы следить за контентом для вдохновения.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {trends.map(trend => (
        <div key={trend.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img src={trend.thumbnail} alt={trend.title} className="w-full h-full object-cover" />
            <button 
              onClick={() => onRemove(trend)}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13H5v-2h14v2z" />
              </svg>
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
              <button 
                onClick={() => onAnalyze(trend)}
                className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-transform"
              >
                Посмотреть разбор
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display font-semibold text-slate-900 line-clamp-1 mb-1">{trend.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trend.niche}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WatchlistView;
