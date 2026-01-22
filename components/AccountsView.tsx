
import React, { useState } from 'react';
import { InstagramAccount } from '../types';
import { searchInstagramAccount } from '../geminiService';
import { InfoBadge } from './Tooltip';

interface AccountsViewProps {
  followedAccounts: InstagramAccount[];
  onToggleFollow: (account: InstagramAccount) => void;
  // Add showTooltips prop to fix TypeScript error in App.tsx
  showTooltips?: boolean;
}

const AccountsView: React.FC<AccountsViewProps> = ({ followedAccounts, onToggleFollow, showTooltips = true }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<InstagramAccount | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setSearchResult(null);
    try {
      const data = await searchInstagramAccount(username);
      setSearchResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isFollowed = (account: InstagramAccount) => 
    followedAccounts.some(a => a.id === account.id);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Search Section */}
      <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Добавить аккаунт для отслеживания</h3>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 font-medium">@</span>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username_инстаграм"
              className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !username}
            className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-black/10 disabled:bg-slate-200 flex items-center gap-2"
          >
            {loading ? 'Поиск...' : 'Найти'}
            {showTooltips && <InfoBadge text="Найти профиль в Instagram для добавления в ваш Радар." />}
          </button>
        </form>

        {searchResult && (
          <div className="mt-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img src={searchResult.avatar} alt={searchResult.username} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-display font-bold text-slate-900">{searchResult.fullName}</h4>
                <p className="text-slate-500 font-medium">@{searchResult.username}</p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xl">{searchResult.description}</p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                    👥 {searchResult.followers}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                    👁️ {searchResult.avgViews} (ср.)
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                    🏷️ {searchResult.niche}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onToggleFollow(searchResult)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                  isFollowed(searchResult) 
                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                    : 'bg-black text-white hover:bg-slate-900'
                }`}
              >
                {isFollowed(searchResult) ? 'Перестать следить' : 'Следить'}
                {showTooltips && <InfoBadge text={isFollowed(searchResult) ? "Удалить автора из списка отслеживания." : "Добавить автора в Радар, чтобы видеть его новые видео в ленте."} />}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Followed List */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-display font-bold text-slate-900">Ваши подписки ({followedAccounts.length})</h3>
        </div>

        {followedAccounts.length === 0 ? (
          <div className="bg-white py-20 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Вы еще ни на кого не подписаны</h4>
            <p className="text-slate-500 mt-2 max-w-sm">Добавьте экспертов или конкурентов в своей нише, чтобы анализировать их стратегии и контент.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {followedAccounts.map(account => (
              <div key={account.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <img src={account.avatar} alt={account.username} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" />
                    {account.isGrowing && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => onToggleFollow(account)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    title="Удалить из подписок"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-lg">{account.fullName}</h4>
                  <p className="text-slate-400 text-sm font-medium mb-4">@{account.username}</p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mb-6">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                      👥 {account.followers}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                      👁️ {account.avgViews}
                    </span>
                  </div>
                  <button className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                    Открыть аналитику профиля
                    {showTooltips && <InfoBadge text="Посмотреть подробную сводку по аккаунту и его лучшим публикациям." />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AccountsView;
