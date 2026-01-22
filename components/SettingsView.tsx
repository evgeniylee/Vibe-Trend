
import React, { useState, useEffect } from 'react';
import { ScrapeCreators } from '../scrapeCreatorsService';
import { DbService } from '../geminiService';
import { supabase } from '../supabaseClient';
import { InfoBadge } from './Tooltip';

interface SettingsViewProps {
  user: any;
  dbStatus?: 'connecting' | 'online' | 'offline';
  onShowToast?: (msg: string, type?: 'success' | 'error') => void;
  onKeySaved?: () => void;
  showTooltips: boolean;
  onToggleTooltips: () => void;
}

interface APILog {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  payload?: any;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, dbStatus, onShowToast, onKeySaved, showTooltips, onToggleTooltips }) => {
  const adminEmails = ['admin@vibetrend.ai', 'evgeniylee94@gmail.com'];
  const isAdmin = adminEmails.includes(user?.email) || user?.app_metadata?.role === 'admin' || user?.email?.includes('admin');
  
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'admin'>(isAdmin ? 'admin' : 'profile');

  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [dob, setDob] = useState(user?.user_metadata?.dob || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<APILog[]>([]);

  useEffect(() => {
    if (isAdmin) {
      const loadKey = async () => {
        const dbKey = await DbService.getScKey();
        const localKey = localStorage.getItem('vibe_trend_sc_key');
        const finalKey = dbKey || localKey || '';
        
        if (finalKey) {
          setApiKey(finalKey);
          ScrapeCreators.setKey(finalKey);
        }
      };
      loadKey();

      const handleLog = (e: any) => {
        setLogs(prev => [e.detail, ...prev].slice(0, 20));
      };

      window.addEventListener('sc-api-log', handleLog);
      return () => window.removeEventListener('sc-api-log', handleLog);
    }
  }, [isAdmin]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        dob: dob,
      }
    });
    setIsUpdatingProfile(false);

    if (error) {
      onShowToast?.(error.message, "error");
    } else {
      onShowToast?.("Профиль успешно обновлен");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onShowToast?.("Пароли не совпадают", "error");
      return;
    }
    if (newPassword.length < 6) {
      onShowToast?.("Минимум 6 символов", "error");
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);

    if (error) {
      onShowToast?.(error.message, "error");
    } else {
      onShowToast?.("Пароль успешно обновлен");
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSaveKey = async () => {
    const cleanVal = apiKey.trim();
    setIsSaving(true);
    try {
      ScrapeCreators.setKey(cleanVal);
      await DbService.saveScKey(cleanVal);
      onShowToast?.("Ключ сохранен в облако");
      onKeySaved?.();
      handleVerify();
    } catch (e) {
      onShowToast?.("Ошибка сохранения", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerify = async () => {
    const keyToVerify = apiKey.trim();
    if (!keyToVerify) return;
    setVerifyStatus({ loading: true });
    const result = await ScrapeCreators.validateKey();
    setVerifyStatus({ loading: false, success: result.success, message: result.message });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {isAdmin && (
        <div className="flex gap-2 p-1.5 glass-panel rounded-3xl w-fit mx-auto shadow-sm">
          <button 
            onClick={() => setActiveSubTab('profile')}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'profile' ? 'bg-[#10141A] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Профиль
          </button>
          <button 
            onClick={() => setActiveSubTab('admin')}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'admin' ? 'bg-[#10141A] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Система (Admin)
          </button>
        </div>
      )}

      {activeSubTab === 'profile' ? (
        <div className="space-y-8">
          {/* Global Interface Settings */}
          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
             <h3 className="text-xl font-black text-[#10141A] mb-8">Интерфейс</h3>
             <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-700">Интерактивные подсказки</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Отображать знак "?" возле кнопок</p>
                </div>
                <button 
                  onClick={onToggleTooltips}
                  className={`w-14 h-8 rounded-full transition-all relative ${showTooltips ? 'bg-[#83A2DB]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${showTooltips ? 'left-7 shadow-lg' : 'left-1'}`}></div>
                </button>
             </div>
          </div>

          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-[#83A2DB]/10 rounded-[2rem] flex items-center justify-center text-[#83A2DB] shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#10141A]">Личные данные</h2>
                <p className="text-slate-400 text-sm font-medium">Ваша учетная запись в VibeTrend</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email</span>
                  <span className="text-sm font-bold text-slate-400 select-none">{user?.email}</span>
                </div>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Регистрация</span>
                  <span className="text-sm font-bold text-slate-700">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Имя</label>
                  <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Фамилия</label>
                  <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-sm"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isUpdatingProfile}
                className="px-10 py-4 bg-[#10141A] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>
          </div>

          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
            <h3 className="text-xl font-black text-[#10141A] mb-8">Безопасность</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Новый пароль</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Подтвердите пароль</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/5 shadow-sm"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="px-10 py-4 bg-[#10141A] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Обновление...' : 'Обновить пароль'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-2xl font-black text-[#10141A]">Статус облака</h2>
                 <p className="text-slate-400 text-sm font-medium">Синхронизация настроек и базы PostgreSQL</p>
              </div>
              <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border ${
                dbStatus === 'online' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                 <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className="text-xs font-black uppercase tracking-widest">{dbStatus === 'online' ? 'Подключено' : 'Ошибка связи'}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[3rem] p-10 border border-white shadow-2xl shadow-black/[0.02]">
            <div className="flex items-center gap-6 mb-10">
               <div className="w-16 h-16 bg-[#10141A] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-black/20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
               </div>
               <div>
                  <h2 className="text-2xl font-black text-[#10141A]">Cloud Vault</h2>
                  <p className="text-slate-400 text-sm font-medium">Ключ ScrapeCreators необходим для доступа к живым данным Instagram.</p>
               </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="relative">
                <input 
                  type={isVisible ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Вставьте ваш ключ: sk_live_..."
                  className="w-full pl-6 pr-32 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-mono focus:outline-none focus:ring-4 focus:ring-[#83A2DB]/10 shadow-sm"
                />
                <button onClick={() => setIsVisible(!isVisible)} className="absolute inset-y-0 right-4 p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  {isVisible ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L14.49 4.49" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
              <div className="mt-6 flex items-center gap-4">
                 <button onClick={handleSaveKey} disabled={isSaving || !apiKey} className="px-8 py-4 bg-[#10141A] text-white rounded-2xl text-xs font-bold hover:scale-[1.02] transition-all shadow-xl">
                   {isSaving ? 'Сохранение...' : 'Сохранить и активировать'}
                 </button>
                 {apiKey && (
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${verifyStatus.success ? 'text-green-600' : 'text-blue-600'}`}>
                        {verifyStatus.loading ? 'Проверка...' : verifyStatus.message || 'Ключ загружен'}
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
