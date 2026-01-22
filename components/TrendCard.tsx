
import React, { useState, useRef, useEffect } from 'react';
import { VideoTrend } from '../types';
import { InfoBadge } from './Tooltip';

interface TrendCardProps {
  trend: VideoTrend;
  isSaved: boolean;
  onAnalyze: (trend: VideoTrend) => void;
  onSave: (trend: VideoTrend) => void;
  showTooltips?: boolean;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, isSaved, onAnalyze, onSave, showTooltips = true }) => {
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isLive = trend.region === 'Live';

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!trend.videoUrl) return;
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsLoaded(true);
      }).catch((err) => {
        console.warn("Video play failed (possibly CORS or blocked):", err);
        setVideoError(true);
        setIsPlaying(false);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-black/[0.02] border border-white group flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
      <div 
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-900 shadow-inner cursor-pointer group/container"
        onClick={() => onAnalyze(trend)}
      >
        {isPlaying && trend.videoUrl && !videoError ? (
          <div className="relative w-full h-full">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                 <div className="w-8 h-8 border-2 border-[#83A2DB] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <video
              ref={videoRef}
              src={trend.videoUrl}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loop
              playsInline
              muted
              autoPlay
              crossOrigin="anonymous"
              onLoadedData={() => setIsLoaded(true)}
              onError={() => {
                setVideoError(true);
                setIsPlaying(false);
              }}
            />
            <button 
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              </div>
            </button>
          </div>
        ) : (
          <>
            {!imageError ? (
              <img 
                src={trend.thumbnail} 
                alt={trend.title} 
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-800 to-slate-900">
                 <div className="w-12 h-12 mb-4 rounded-full bg-white/10 flex items-center justify-center text-white/40 shadow-sm">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-tight">Media Loading Error</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={togglePlay}
                  className="w-14 h-14 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-2xl hover:bg-white/50"
                >
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
            </div>
          </>
        )}

        {videoError && isPlaying && (
           <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-white text-[10px] font-bold uppercase mb-4">Видео недоступно для превью</p>
              <a 
                href={trend.postUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-[#83A2DB] rounded-xl text-[9px] font-black text-white uppercase"
              >
                Смотреть в Instagram
              </a>
           </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
           <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#10141A] shadow-sm">
              {trend.niche}
           </div>
           {isLive && (
             <div className="bg-[#83A2DB] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg animate-pulse">
                Live Data
             </div>
           )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onSave(trend); }}
          className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all z-20 ${
            isSaved ? 'bg-[#CE6969] text-white shadow-xl scale-110' : 'bg-white/70 text-slate-400 hover:bg-white hover:text-red-500 hover:scale-105'
          }`}
        >
          <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </button>

        {!isPlaying && (
          <div className="absolute bottom-5 left-4 right-4 z-10">
             <div className="px-5 py-3 rounded-3xl backdrop-blur-xl bg-black/30 border border-white/20 shadow-2xl transition-transform group-hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                   {/* Views */}
                   <div className="flex flex-col items-center gap-1 min-w-[32px]">
                      <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span className="text-[11px] font-black text-white">{trend.views}</span>
                   </div>
                   {/* Likes */}
                   <div className="flex flex-col items-center gap-1 min-w-[32px]">
                      <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                      <span className="text-[11px] font-black text-white">{trend.likes || '-'}</span>
                   </div>
                   {/* Comments */}
                   <div className="flex flex-col items-center gap-1 min-w-[32px]">
                      <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                      <span className="text-[11px] font-black text-white">{trend.comments || '-'}</span>
                   </div>
                   {/* Shares */}
                   <div className="flex flex-col items-center gap-1 min-w-[32px]">
                      <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                      <span className="text-[11px] font-black text-white">{trend.shares || '-'}</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="px-1 pb-1 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#10141A] line-clamp-2 leading-tight mb-2 h-9">
            {trend.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
               <img 
                src={`https://i.pravatar.cc/100?u=${trend.creator}`} 
                className="w-full h-full object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/100?u=user'; }}
               />
            </div>
            <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#83A2DB] transition-colors">{trend.creator}</span>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onAnalyze(trend); }}
          className="w-full py-4 bg-[#10141A] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Анализ видео
          {showTooltips && <InfoBadge text="Провести глубокий AI анализ стратегии этого видео, разобрать транскрипцию и психологические триггеры." />}
        </button>
      </div>
    </div>
  );
};

export default TrendCard;
