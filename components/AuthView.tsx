
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface AuthViewProps {
  onSuccess?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // New Profile Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('vibetrend_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              dob: dob,
            }
          }
        });
        if (signUpError) throw signUpError;
        alert("Проверьте почту для подтверждения регистрации!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        // Save email if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem('vibetrend_remembered_email', email);
        } else {
          localStorage.removeItem('vibetrend_remembered_email');
        }

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="glass-panel w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white animate-in zoom-in-95 duration-500 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#10141A] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl mx-auto mb-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 19h18L12 2z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#10141A] tracking-tight">
            {isSignUp ? 'Создать аккаунт' : 'С возвращением'}
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            {isSignUp ? 'Заполните данные профиля' : 'Войдите, чтобы продолжить работу'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Имя</label>
                  <input 
                    type="text" 
                    name="given-name"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Фамилия</label>
                  <input 
                    type="text" 
                    name="family-name"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Телефон</label>
                <input 
                  type="tel" 
                  name="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Дата рождения</label>
                <input 
                  type="date" 
                  name="bday"
                  autoComplete="bday"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email</label>
            <input 
              type="email" 
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Пароль</label>
            <input 
              type="password" 
              name="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#83A2DB] transition-all"></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4 shadow-sm"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Запомнить меня</span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#10141A] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Загрузка...' : isSignUp ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-400 hover:text-[#10141A] transition-colors"
          >
            {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
