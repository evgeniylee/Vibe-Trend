
import React, { useState, useEffect } from 'react';
import { VideoTrend, AnalysisResult } from '../types';
import { generateScript, DbService } from '../geminiService';
import { InfoBadge } from './Tooltip';

interface ScriptsViewProps {
  initialTrend: VideoTrend | null;
  initialAnalysis: AnalysisResult | null;
  onShowToast?: (msg: string, type?: 'success' | 'error') => void;
  onUsageUpdate?: () => void;
  // Add showTooltips prop to fix TypeScript error in App.tsx
  showTooltips?: boolean;
}

const ScriptsView: React.FC<ScriptsViewProps> = ({ initialTrend, initialAnalysis, onShowToast, onUsageUpdate, showTooltips = true }) => {
  const [niche, setNiche] = useState('Лайфстайл');
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedScripts, setSavedScripts] = useState<any[]>([]);

  useEffect(() => {
    loadSaved();
    if (initialTrend) {
      setNiche(initialTrend.niche);
      setTopic(initialTrend.title);
      if (initialTrend.title) handleGenerate(initialTrend.niche, initialTrend.title, initialAnalysis);
    }
  }, [initialTrend, initialAnalysis]);

  const loadSaved = async () => {
    const data = await DbService.getSavedScripts();
    setSavedScripts(data);
  };

  const handleGenerate = async (tNiche = niche, tTopic = topic, analysis = initialAnalysis) => {
    if (!tTopic) return;
    setLoading(true);
    try {
      const result = await generateScript(tNiche, tTopic, analysis || undefined);
      setScript(result);
      if (onUsageUpdate) onUsageUpdate();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSaveToLibrary = async () => {
    if (!script || isSaving) return;
    setIsSaving(true);
    try {
      const title = topic.length > 30 ? topic.substring(0, 30) + '...' : topic;
      await DbService.saveScript(title || "Без названия", niche, script);
      await loadSaved();
      if (onShowToast) onShowToast("Сохранено в библиотеку");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await DbService.deleteScript(id);
    loadSaved();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in slide-in-from-bottom-6 duration-700 pb-10">
      
      <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
        <div className="glass-panel rounded-[2.5rem] p-6 border border-white shadow-sm overflow-hidden flex flex-col h-[400px] xl:h-[600px]">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#10141A] mb-6 flex items-center justify-between">
            Библиотека
            <span className="bg-[#83A2DB]/10 text-[#83A2DB] px-2 py-0.5 rounded-lg text-[10px]">{savedScripts.length}</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {savedScripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-[10px] font-bold text-slate-300 uppercase leading-tight">Ваша библиотека пока пуста</p>
              </div>
            ) : (
              savedScripts.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { setScript(s.content); setTopic(s.title); setNiche(s.niche); }}
                  className="group p-4 bg-white/50 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#83A2DB] hover:bg-white transition-all relative"
                >
                  <p className="text-xs font-bold text-[#10141A] line-clamp-1 mb-1">{s.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{s.niche}</span>
                    <button 
                      onClick={(e) => handleDelete(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-300 hover:text-red-500 transition-all"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
            <h3 className="text-xl font-bold text-[#10141A] mb-8">Создать сценарий</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Ниша</label>
                <select 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 appearance-none"
                >
                  {['Лайфстайл', 'Путешествия', 'IT', 'Мода', 'Фитнес', 'Бизнес'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Тема</label>
                <textarea 
                  rows={4}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="О чем будет видео?"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 resize-none transition-all"
                />
              </div>

              <button 
                onClick={() => handleGenerate()}
                disabled={loading || !topic}
                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                  loading ? 'bg-slate-100 text-slate-400' : 'bg-[#10141A] text-white hover:scale-[1.02] shadow-xl'
                }`}
              >
                {loading ? 'Генерация...' : 'Создать сценарий'}
                {showTooltips && <InfoBadge text="Использовать AI для написания готового сценария с учетом выбранной ниши и темы." />}
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[3rem] border border-white shadow-2xl shadow-black/[0.02] overflow-hidden flex flex-col h-[600px]">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-[#10141A]">Результат</h3>
            <div className="flex gap-2">
              {script && (
                <>
                  <button 
                    onClick={handleSaveToLibrary}
                    disabled={isSaving}
                    className="p-3 text-slate-400 hover:text-[#83A2DB] hover:bg-blue-50 rounded-xl transition-all flex items-center gap-1" 
                    title="Сохранить в библиотеку"
                  >
                    <svg className={`h-5 w-5 ${isSaving ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    {showTooltips && <InfoBadge text="Сохранить этот черновик в вашу личную библиотеку сценариев." />}
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(script)}
                    className="p-3 text-slate-400 hover:text-[#10141A] hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    {showTooltips && <InfoBadge text="Скопировать текст сценария в буфер обмена." />}
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-slate-50/30">
            {!script && !loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-widest">Здесь появится магия</p>
              </div>
            ) : loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                <div className="h-32 bg-slate-200 rounded-[2rem] w-full"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-mono text-sm bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                {script}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptsView;
