
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen selection:bg-[#83A2DB]/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-8 py-4 rounded-[2rem] border border-white/40 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10141A] rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 19h18L12 2z"/></svg>
            </div>
            <span className="text-lg font-black tracking-tighter text-[#10141A]">VibeTrend <span className="text-[#83A2DB]">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onLogin}
              className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#10141A] transition-colors"
            >
              Войти
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-[#10141A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#83A2DB]/10 border border-[#83A2DB]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#83A2DB] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#83A2DB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#83A2DB]"></span>
            </span>
            Будущее контент-маркетинга уже здесь
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-[#10141A] tracking-tight leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Твой следующий Reels <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#83A2DB] to-[#CE6969]">станет виральным.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            VibeTrend AI находит тренды раньше других, объясняет психологию их успеха и пишет сценарии под твою нишу. Перестань гадать — начни снимать.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-6 bg-[#10141A] text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:scale-105 hover:shadow-2xl hover:shadow-black/20 transition-all"
            >
              Попробовать бесплатно
            </button>
            <div className="flex items-center -space-x-3 px-4">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="User" />
               ))}
               <div className="pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                 Присоединились к 2,500+ <br /> авторам
               </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-64 h-64 bg-[#83A2DB]/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 translate-x-1/2 w-96 h-96 bg-[#CE6969]/10 blur-[150px] rounded-full pointer-events-none"></div>
      </section>

      {/* Value Proposition: 6 in 1 */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-[#10141A] tracking-tighter">6 сервисов в одном решении</h2>
            <p className="text-slate-500 font-medium text-lg max-w-3xl mx-auto">
              Вместо того, чтобы собирать по кусочкам десятки инструментов, <br className="hidden md:block" /> вы получаете всё в одном удобном интерфейсе.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard 
              title="Chat GPT" 
              desc="Генерация идей и сценариев на базе самых мощных нейросетей." 
              icon={<div className="w-16 h-16 bg-[#10A37F] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#10A37F]/30 rotate-3 group-hover:rotate-0 transition-transform"><svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9108 6.0462 6.0462 0 0 0-4.7412-3.1247 5.9847 5.9847 0 0 0-7.6927 1.0659 5.9847 5.9847 0 0 0-4.9108.5153 6.0462 6.0462 0 0 0-3.1247 4.7412 5.9847 5.9847 0 0 0 1.0659 7.6927 5.9847 5.9847 0 0 0 .5153 4.9108 6.0462 6.0462 0 0 0 4.7412 3.1247 5.9847 5.9847 0 0 0 7.6927-1.0659 5.9847 5.9847 0 0 0 4.9108-.5153 6.0462 6.0462 0 0 0 3.1247-4.7412 5.9847 5.9847 0 0 0-1.0659-7.6927zm-1.6166 6.307a3.8647 3.8647 0 0 1-1.9961 3.03l-.4013.2323v-1.9167c0-.985-.4362-1.8903-1.1969-2.5028l-3.3213-2.6713 1.8388-1.0614 4.5422 2.6225a3.8118 3.8118 0 0 1 .5346 2.2674zm-2.0303-9.5247l-4.5422 2.6225-1.8388-1.0614 3.3213-2.6713c.7607-.6125 1.1969-1.5178 1.1969-2.5028v-1.9167l.4013.2323a3.8647 3.8647 0 0 1 1.9961 3.03 3.8118 3.8118 0 0 1-.5346 2.2674zM10.87 2.0623V4.316c0 1.258-.6194 2.4344-1.6575 3.1491L5.8912 9.1364 4.0524 8.075l4.5422-2.6225a3.8647 3.8647 0 0 1 3.03-1.9961 3.8118 3.8118 0 0 1 2.2674.5346l-3.022 1.0713zm-8.8077 4.14a3.8647 3.8647 0 0 1 3.03-1.9961 3.8118 3.8118 0 0 1 2.2674.5346l-.4013.2323v1.9167c0 .985.4362 1.8903 1.1969 2.5028l3.3213 2.6713-1.8388 1.0614-4.5422-2.6225a3.8118 3.8118 0 0 1-.5346-2.2674l.5013-1.0325zm2.0303 9.5247l4.5422-2.6225 1.8388 1.0614-3.3213 2.6713c-.7607.6125-1.1969 1.5178-1.1969 2.5028v1.9167l-.4013-.2323a3.8647 3.8647 0 0 1-1.9961-3.03 3.8118 3.8118 0 0 1 .5346-2.2674zM13.13 21.9377V19.684c0-1.258.6194-2.4344 1.6575-3.1491l3.3213-1.6713 1.8388 1.0614-4.5422 2.6225a3.8647 3.8647 0 0 1-3.03 1.9961 3.8118 3.8118 0 0 1-2.2674-.5346l3.022-1.0713z"/></svg></div>}
            />
            <ValueCard 
              title="Транскрибатор" 
              desc="Превращайте аудио и видео из Reels в структурированный текст за секунды." 
              icon={<div className="w-20 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center shadow-xl -rotate-6 group-hover:rotate-0 transition-transform"><div className="flex gap-1 items-center px-4"><div className="w-1 h-4 bg-white/40 rounded-full animate-pulse"></div><div className="w-1 h-6 bg-white rounded-full"></div><div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div><div className="w-1 h-5 bg-white/80 rounded-full"></div><div className="ml-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#4F46E5]"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg></div></div></div>}
            />
            <ValueCard 
              title="Поиск TikTok" 
              desc="Находите самые виральные идеи в TikTok раньше, чем они попадут в Instagram." 
              icon={<div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/30 group-hover:scale-110 transition-transform"><svg className="w-10 h-10" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.417 6.417 0 0 1-1.87-1.54v8.59c.04 1.76-.55 3.52-1.68 4.88-1.52 1.83-3.9 2.84-6.27 2.67-2.12-.13-4.13-1.28-5.39-2.98-1.33-1.78-1.67-4.19-1-6.31 1.01-3.15 4.38-5.18 7.55-4.52V13.8c-1.42-.3-2.99.18-3.87 1.31-.91 1.15-1.02 2.82-.24 4.05.78 1.24 2.29 1.93 3.73 1.71 1.45-.2 2.63-1.4 2.87-2.84.05-4.63.03-9.26.04-13.89-.01-.06-.01-.12-.01-.18v.02z"/></svg></div>}
            />
            <ValueCard 
              title="Поиск Instagram" 
              desc="Анализируйте конкурентов, ищите по хештегам и находите аномалии роста." 
              icon={<div className="w-16 h-16 bg-gradient-to-tr from-[#FFD600] via-[#FF0100] to-[#D800FF] rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-12 group-hover:rotate-0 transition-transform"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>}
            />
            <ValueCard 
              title="Аналитика контента" 
              desc="Отслеживайте охваты, удержание и вовлеченность ваших видео в одном дашборде." 
              icon={<div className="w-16 h-16 bg-[#FBBF24] rounded-2xl flex items-center justify-center shadow-xl group-hover:-translate-y-2 transition-transform"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg></div>}
            />
            <ValueCard 
              title="База вдохновения" 
              desc="Храните лучшие находки, готовые сценарии и референсы в персональной медиатеке." 
              icon={<div className="w-16 h-16 bg-[#83A2DB] rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform"><span className="text-3xl">💡</span></div>}
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Pain Points */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass-panel p-10 rounded-[3rem] border border-white shadow-xl">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#10141A] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-black mb-4">Хватит тратить часы</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Больше не нужно бесконечно скроллить ленту в поисках идей. Мы делаем это за тебя 24/7.</p>
           </div>
           <div className="glass-panel p-10 rounded-[3rem] border border-white shadow-xl">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#83A2DB] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-black mb-4">Рост на автопилоте</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Алгоритмы любят актуальность. С VibeTrend ты всегда в эпицентре того, что сейчас «залетает».</p>
           </div>
           <div className="glass-panel p-10 rounded-[3rem] border border-white shadow-xl">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#CE6969] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <h3 className="text-xl font-black mb-4">AI Сценарист</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Нашел тренд? Наш AI мгновенно адаптирует его под твой блог, сохраняя структуру вирального ролика.</p>
           </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6 bg-[#10141A] rounded-[4rem] mx-4 my-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
                 Твоя лента, очищенная <br />
                 <span className="text-slate-500">от мусора.</span>
               </h2>
               <p className="text-lg text-slate-400 mb-12">
                 Мы анализируем миллионы видео в реальном времени, чтобы оставить только те, которые приносят реальных подписчиков и продажи.
               </p>
               <div className="space-y-6">
                 {[
                   { t: 'Radar', d: 'Следи за конкурентами и лидерами ниш в реальном времени.' },
                   { t: 'Deep Analysis', d: 'Понимай психологию каждого кадра: почему это смотрят.' },
                   { t: 'Smart Scripting', d: 'Сценарии, которые учитывают удержание внимания.' }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-[#83A2DB] mt-2"></div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{feat.t}</h4>
                        <p className="text-sm text-slate-500">{feat.d}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="relative">
              <div className="glass-panel p-2 rounded-[3rem] border-white/20 shadow-2xl rotate-3 scale-105">
                 <img src="https://picsum.photos/seed/dashboard/1200/1600" className="rounded-[2.5rem] w-full" alt="Dashboard Preview" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#10141A] to-transparent opacity-40 rounded-[2.5rem]"></div>
              </div>
              {/* Floating badges */}
              <div className="absolute top-10 -left-10 bg-[#83A2DB] p-4 rounded-2xl shadow-xl animate-bounce duration-[3s]">
                <span className="text-xs font-black uppercase tracking-widest">Viral Score: 98%</span>
              </div>
              <div className="absolute bottom-20 -right-4 bg-[#CE6969] p-4 rounded-2xl shadow-xl animate-pulse">
                <span className="text-xs font-black uppercase tracking-widest">+2.4M Views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
           <h2 className="text-4xl font-black mb-4">3 шага к твоему успеху</h2>
           <p className="text-slate-500 font-medium">Весь путь от идеи до публикации занимает меньше 15 минут.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { s: '01', t: 'Выбери нишу', d: 'Укажи свою сферу интересов, и мы подберем актуальные тренды именно для тебя.' },
            { s: '02', t: 'Изучи декомпозицию', d: 'Посмотри, какие триггеры и структура помогли видео стать популярным.' },
            { s: '03', t: 'Сними по сценарию', d: 'Получи готовый план действий и сними свой ролик за считанные минуты.' }
          ].map((step, i) => (
            <div key={i} className="text-center group">
               <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-3xl font-black mx-auto mb-8 border border-slate-50 group-hover:scale-110 transition-transform">
                 {step.s}
               </div>
               <h4 className="text-xl font-black mb-4">{step.t}</h4>
               <p className="text-slate-500 font-medium leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto glass-panel p-16 rounded-[4rem] border border-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#10141A] mb-8 tracking-tight">
              Готов взломать <br /> алгоритмы?
            </h2>
            <button 
              onClick={onGetStarted}
              className="px-12 py-6 bg-[#10141A] text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
              Начать прямо сейчас
            </button>
            <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">Бесплатный период 7 дней • Отмена в любое время</p>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#83A2DB]/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CE6969]/10 blur-[80px] rounded-full"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10141A] rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 19h18L12 2z"/></svg>
            </div>
            <span className="text-sm font-black tracking-tighter text-[#10141A]">VibeTrend <span className="text-[#83A2DB]">AI</span></span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#10141A] transition-colors">Pricing</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#10141A] transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#10141A] transition-colors">Contact</a>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 VibeTrend AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const ValueCard: React.FC<{title: string, desc: string, icon: React.ReactNode}> = ({ title, desc, icon }) => (
  <div className="glass-panel p-10 rounded-[2.5rem] border border-white hover:border-[#83A2DB] transition-all group flex flex-col gap-6 relative overflow-hidden shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <h4 className="text-xl font-black text-[#10141A] tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[200px]">{desc}</p>
      </div>
      <div className="relative z-10">
        {icon}
      </div>
    </div>
    {/* Soft Glow Background on Hover */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#83A2DB]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

export default LandingPage;
