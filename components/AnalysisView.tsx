
import React, { useState, useEffect } from 'react';
import { VideoTrend, AnalysisResult } from '../types';
import { analyzeVideoTrend } from '../geminiService';
import { InfoBadge } from './Tooltip';

interface AnalysisViewProps {
  trend: VideoTrend | null;
  onGoToScripts?: (trend: VideoTrend, analysis: AnalysisResult) => void;
  onClose?: () => void;
  showTooltips?: boolean;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ trend, onGoToScripts, onClose, showTooltips = true }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcription' | 'hook' | 'structure' | 'funnel'>('transcription');
  const [loadingStep, setLoadingStep] = useState(0);
  const [isInstant, setIsInstant] = useState(false);

  const loadingMessages = [
    "Сканируем визуальный ряд...",
    "Извлекаем аудио-дорожку...",
    "Искусственный интеллект расшифровывает текст...",
    "Анализируем психологические триггеры...",
    "Распознаем структуру удержания внимания...",
    "Определяем потенциал виральности...",
    "Формируем финальный отчет..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (trend) {
      const fetchData = async () => {
        setLoading(true);
        setAnalysis(null);
        setIsInstant(false);
        try {
          const { result, fromCache } = await analyzeVideoTrend(trend);
          setAnalysis(result);
          setIsInstant(fromCache);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [trend]);

  if (!trend) return (
    <div className="glass-panel rounded-[3rem] p-20 flex flex-col items-center text-center">
       <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
       </div>
       <h3 className="text-xl font-bold mb-2">Выберите видео для анализа</h3>
       <p className="text-slate-400 max-w-sm text-sm">Мы подготовим детальную статистику и декомпозицию виральной стратегии.</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 relative">
      <div className="flex items-center justify-between mb-4 px-2">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-[#10141A]">Анализ видео</h2>
            {isInstant && (
              <span className="px-3 py-1 bg-green-50 text-[9px] font-black text-green-600 rounded-full border border-green-100 uppercase tracking-widest flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Instant Report (Global Cache)
              </span>
            )}
         </div>
         {onClose && (
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-panel rounded-[2.5rem] p-4 border border-white shadow-xl overflow-hidden group">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-slate-900">
                 <img src={trend.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center text-white">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                 </div>
                 {analysis && (
                    <div className="absolute bottom-4 left-4">
                       <div className="bg-[#83A2DB] px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-lg flex items-center gap-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          {analysis.stats.viralScore}
                       </div>
                    </div>
                 )}
                 <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-bold">0:32</div>
                 {loading && (
                    <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]">
                       <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                 )}
              </div>

              <div className="space-y-3 px-2 pb-2">
                 <h3 className="text-sm font-black text-[#10141A] leading-tight line-clamp-2">{trend.title}</h3>
                 <p className="text-xs font-bold text-[#83A2DB]">{trend.creator}</p>
                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    7 дней назад
                 </div>
                 <button className="w-full mt-4 py-4 bg-[#10141A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Смотреть видео
                    {showTooltips && <InfoBadge text="Перейти в Instagram для просмотра оригинального ролика." />}
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-9 flex flex-col gap-8">
          {loading ? (
             <div className="flex-1 glass-panel rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#83A2DB]/5 to-transparent"></div>
                
                <div className="relative z-10 space-y-8 max-w-md mx-auto">
                   <div className="w-24 h-24 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-[#83A2DB] rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-4 bg-slate-50 rounded-full flex items-center justify-center">
                         <svg className="w-8 h-8 text-[#83A2DB] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xl font-black text-[#10141A] tracking-tight">VibeTrend AI анализирует данные</h4>
                      <div className="h-6 overflow-hidden">
                         <p key={loadingStep} className="text-sm font-bold text-[#83A2DB] uppercase tracking-widest animate-in slide-in-from-bottom-2 duration-500">
                            {loadingMessages[loadingStep]}
                         </p>
                      </div>
                   </div>

                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                         className="h-full bg-gradient-to-r from-[#83A2DB] to-[#CE6969] transition-all duration-[20s] ease-linear" 
                         style={{ width: '95%' }}
                      ></div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Обычно это занимает 5-10 секунд</p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-10 opacity-20 pointer-events-none">
                   <div className="grid grid-cols-3 gap-6">
                      <div className="h-32 bg-slate-200 rounded-3xl"></div>
                      <div className="h-32 bg-slate-200 rounded-3xl"></div>
                      <div className="h-32 bg-slate-200 rounded-3xl"></div>
                   </div>
                </div>
             </div>
          ) : analysis && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <StatCard 
                    label="Viral Score" 
                    value={analysis.stats.viralScore} 
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
                    color="#83A2DB"
                    highlighted
                    tooltip="Коэффициент виральности: отношение просмотров ролика к медианным просмотрам канала."
                    showTooltips={showTooltips}
                 />
                 <StatCard 
                    label="Просмотры" 
                    value={analysis.stats.views} 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} 
                    color="#10B981"
                    tooltip="Общее количество просмотров данного видео на текущий момент."
                    showTooltips={showTooltips}
                 />
                 <StatCard 
                    label="Медиана канала" 
                    value={analysis.stats.median} 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                    color="#3B82F6"
                    tooltip="Среднее типичное количество просмотров на роликах этого автора."
                    showTooltips={showTooltips}
                 />
                 <StatCard 
                    label="Лайки" 
                    value={analysis.stats.likes} 
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} 
                    color="#EC4899"
                    tooltip="Количество отметок «Нравится» под видео."
                    showTooltips={showTooltips}
                 />
                 <StatCard 
                    label="Комментарии" 
                    value={analysis.stats.comments} 
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>} 
                    color="#8B5CF6"
                    tooltip="Общее количество комментариев, оставленных пользователями."
                    showTooltips={showTooltips}
                 />
                 <StatCard 
                    label="ER" 
                    value={analysis.stats.er} 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                    color="#6366F1"
                    tooltip="Engagement Rate: процент вовлеченности (отношение реакций к охвату)."
                    showTooltips={showTooltips}
                 />
              </div>

              <div className="glass-panel rounded-[2.5rem] border border-white shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                 <div className="flex border-b border-slate-100">
                    <TabButton 
                       active={activeTab === 'transcription'} 
                       onClick={() => setActiveTab('transcription')} 
                       label="Транскрипция" 
                       tooltip="Полный текстовый расшифровщик аудиодорожки видео."
                       showTooltips={showTooltips}
                    />
                    <TabButton 
                       active={activeTab === 'hook'} 
                       onClick={() => setActiveTab('hook')} 
                       label="Хук" 
                       tooltip="Анализ первых 3 секунд: что именно заставляет людей досмотреть."
                       showTooltips={showTooltips}
                    />
                    <TabButton 
                       active={activeTab === 'structure'} 
                       onClick={() => setActiveTab('structure')} 
                       label="Структура сценария" 
                       tooltip="Пошаговая схема ролика: от вступления до призыва к действию."
                       showTooltips={showTooltips}
                    />
                    <TabButton 
                       active={activeTab === 'funnel'} 
                       onClick={() => setActiveTab('funnel')} 
                       label="Анализ воронки" 
                       tooltip="Как этот ролик конвертирует зрителя в подписчика или клиента."
                       showTooltips={showTooltips}
                    />
                 </div>
                 
                 <div className="p-10 min-h-[300px] bg-slate-50/20">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed text-slate-700 animate-in fade-in duration-500">
                       {activeTab === 'transcription' && (
                          <p className="whitespace-pre-line text-sm md:text-base font-medium">{analysis.transcription}</p>
                       )}
                       {activeTab === 'hook' && (
                          <div className="space-y-4">
                             <h4 className="font-black text-[#10141A] uppercase text-[10px] tracking-widest">Анализ захвата внимания</h4>
                             <p className="font-medium">{analysis.hook}</p>
                          </div>
                       )}
                       {activeTab === 'structure' && (
                          <div className="space-y-6">
                             <div className="p-4 bg-blue-50/50 rounded-2xl">
                                <span className="text-[10px] font-black uppercase text-[#83A2DB] block mb-2">01 Hook</span>
                                <p className="text-sm font-medium">{analysis.structure.hook}</p>
                             </div>
                             <div className="p-4 bg-slate-50/50 rounded-2xl">
                                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">02 Body</span>
                                <p className="text-sm font-medium">{analysis.structure.body}</p>
                             </div>
                             <div className="p-4 bg-slate-50/50 rounded-2xl">
                                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">03 CTA</span>
                                <p className="text-sm font-medium">{analysis.structure.cta}</p>
                             </div>
                          </div>
                       )}
                       {activeTab === 'funnel' && (
                          <div className="space-y-4">
                             <h4 className="font-black text-[#10141A] uppercase text-[10px] tracking-widest">Путь пользователя</h4>
                             <p className="font-medium leading-relaxed">{analysis.funnel}</p>
                          </div>
                       )}
                    </div>

                    <div className="mt-8 flex justify-end">
                       <button 
                         onClick={() => onGoToScripts?.(trend, analysis)}
                         className="px-8 py-5 bg-[#10141A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                       >
                          Использовать в сценарии
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          {showTooltips && <InfoBadge text="Перейти в конструктор сценариев и адаптировать эту стратегию под ваш контент." />}
                       </button>
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, highlighted = false, tooltip, showTooltips }: any) => (
  <div className={`glass-panel p-6 rounded-[2rem] border transition-all ${highlighted ? 'border-[#83A2DB] ring-2 ring-[#83A2DB]/10' : 'border-white'} shadow-sm flex flex-col gap-4 group`}>
    <div className="flex items-center gap-3">
       <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors" style={{ color: color }}>
          {icon}
       </div>
       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
         {label}
         {showTooltips && tooltip && <InfoBadge text={tooltip} />}
       </span>
    </div>
    <div className="text-2xl md:text-3xl font-black text-[#10141A] tracking-tight">
       {value}
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, tooltip, showTooltips }: any) => (
  <button 
    onClick={onClick}
    className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
      active ? 'text-[#83A2DB]' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
    {showTooltips && tooltip && <InfoBadge text={tooltip} />}
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#83A2DB] rounded-t-full"></div>}
  </button>
);

export default AnalysisView;
