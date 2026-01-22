
import React from 'react';

interface PricingViewProps {
  onUpgrade: (plan: 'pro' | 'agency') => void;
  currentPlan?: string;
}

const PricingView: React.FC<PricingViewProps> = ({ onUpgrade, currentPlan = 'free' }) => {
  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '0',
      description: 'Для тех, кто только начинает свой путь в контенте.',
      features: ['3 анализа в день', '5 сценариев в месяц', 'Базовые тренды'],
      buttonText: 'Текущий план',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      price: '29',
      description: 'Для блогеров и экспертов, нацеленных на быстрый рост.',
      features: ['Безлимитный анализ', '50 сценариев/мес', 'Приоритетный AI', 'Deep Insights'],
      buttonText: 'Выбрать Pro',
      highlight: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '99',
      description: 'Для команд и продакшн-студий.',
      features: ['Все из Pro', 'До 5 аккаунтов', 'Командный доступ', 'API Access'],
      buttonText: 'Связаться',
      highlight: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black text-[#10141A] mb-6 tracking-tight">Инвестируй в свои охваты</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Выберите план, который поможет вам создавать контент профессионально и системно.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative glass-panel rounded-[3.5rem] p-10 border transition-all duration-500 hover:scale-[1.02] ${
              plan.highlight ? 'border-[#83A2DB] shadow-2xl shadow-blue-100 ring-4 ring-blue-50/50' : 'border-white shadow-xl'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#83A2DB] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Популярный выбор
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[#10141A] mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-4xl font-black text-[#10141A]">${plan.price}</span>
              <span className="text-slate-400 text-sm font-bold">/мес</span>
            </div>

            <ul className="space-y-4 mb-12">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <svg className={`w-5 h-5 ${plan.highlight ? 'text-[#83A2DB]' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => plan.id !== 'free' && onUpgrade(plan.id as any)}
              disabled={plan.id === 'free' && currentPlan === 'free'}
              className={`w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${
                plan.highlight 
                  ? 'bg-[#10141A] text-white shadow-xl hover:shadow-black/20' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {plan.id === 'free' && currentPlan === 'free' ? 'Активен' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-[#10141A] rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h4 className="text-2xl font-black mb-2">Нужен индивидуальный тариф?</h4>
            <p className="text-slate-400 text-sm">Мы работаем с крупными блогерами и сетями пабликов.</p>
         </div>
         <button className="relative z-10 px-10 py-5 bg-[#83A2DB] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
            Написать нам
         </button>
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
};

export default PricingView;
