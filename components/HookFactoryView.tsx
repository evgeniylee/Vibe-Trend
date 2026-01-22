
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LogicService } from '../geminiService';
import { InfoBadge } from './Tooltip';

interface HookResult {
  text: string;
  style: string;
  visualAdvice: string;
  score: number;
}

const HookFactoryView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Массовая аудитория');
  const [tone, setTone] = useState('Провокационный');
  const [hooks, setHooks] = useState<HookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiRefined, setIsAiRefined] = useState(false);

  const audiences = ['Предприниматели', 'SMM/Блогеры', 'Мамы', 'Gen Z (зумеры)', 'Массовая аудитория', 'Эксперты'];
  const tones = ['Провокационный', 'Экспертный', 'Дружелюбный', 'Загадочный', 'Смешной'];

  const handleInstantGenerate = () => {
    if (!topic) return;
    setIsAiRefined(false);
    const results = LogicService.getInstantHooks(topic);
    setHooks(results);
  };

  const handleAiRefine = async () => {
    if (!topic || hooks.length === 0) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Refine these hooks for topic: "${topic}". Audience: ${audience}. Tone: ${tone}. Russian.
        Current hooks: ${hooks.map(h => h.text).join(', ')}. Make them 10x more viral.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                style: { type: Type.STRING },
                visualAdvice: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["text", "style", "visualAdvice", "score"]
            }
          }
        },
      });
      
      const results = JSON.parse(response.text.trim());
      setHooks(results);
      setIsAiRefined(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-[#10141A] tracking-tighter">Hook Factory 2.0</h2>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">Создавайте виральные начала мгновенно.</p>
      </div>

      <div className="glass-panel p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.02] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Целевая аудитория</label>
              <div className="flex flex-wrap gap-2">
                 {audiences.map(a => (
                   <button 
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${audience === a ? 'bg-[#10141A] text-white border-[#10141A]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                   >
                     {a}
                   </button>
                 ))}
              </div>
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Тональность</label>
              <div className="flex flex-wrap gap-2">
                 {tones.map(t => (
                   <button 
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${tone === t ? 'bg-[#83A2DB] text-white border-[#83A2DB]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="О чем ваше видео?"
            className="flex-1 px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-inner"
          />
          <button 
            onClick={handleInstantGenerate}
            className="px-10 py-5 bg-[#10141A] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Создать мгновенно
          </button>
        </div>
      </div>

      {hooks.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {isAiRefined ? "Результат AI оптимизации ✨" : "Локальные шаблоны (Instant)"}
             </h3>
             {!isAiRefined && (
               <button 
                onClick={handleAiRefine}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#83A2DB] to-[#CE6969] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/10"
               >
                 {loading ? "Анализирую..." : "Улучшить с помощью AI"}
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
               </button>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {hooks.map((hook, i) => (
              <div key={i} className="glass-panel p-8 rounded-[3rem] border border-white hover:border-[#83A2DB] transition-all group relative overflow-hidden flex flex-col gap-6">
                <div className="absolute top-6 right-6 flex flex-col items-end">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Impact Score</span>
                   <div className="text-xl font-black text-[#83A2DB]">{hook.score}%</div>
                </div>

                <div className="space-y-4">
                   <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 w-fit">
                      {hook.style}
                   </div>
                   <p className="text-lg font-black text-[#10141A] leading-tight group-hover:text-[#83A2DB] transition-colors">
                      "{hook.text}"
                   </p>
                </div>

                <div className="p-4 bg-[#83A2DB]/5 rounded-2xl border border-[#83A2DB]/10">
                   <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3 h-3 text-[#83A2DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#83A2DB]">Совет по съемке</span>
                   </div>
                   <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                      {hook.visualAdvice}
                   </p>
                </div>

                <div className="flex gap-2 mt-auto">
                   <button 
                    onClick={() => navigator.clipboard.writeText(hook.text)}
                    className="flex-1 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                   >
                      Копировать
                   </button>
                   <button className="p-3 bg-[#10141A] text-white rounded-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && hooks.length === 0 && (
         <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Введите тему и нажмите «Создать»</p>
         </div>
      )}
    </div>
  );
};

export default HookFactoryView;
