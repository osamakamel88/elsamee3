import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import api from '../api/client';
import { Shield, Mail, Lock, Loader2, LogIn, Sparkles } from 'lucide-react';

export default function Login() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error(isRTL ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;
      if (data.access_token && data.user) {
        login(data.access_token, data.user);
        toast.success(isRTL ? `مرحباً بك مجدداً، ${data.user.fullName || data.user.email}!` : `Welcome back!`);
        navigate('/');
      } else {
        toast.error(isRTL ? 'فشل تسجيل الدخول، تحقق من البيانات.' : 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || (isRTL ? 'البريد أو كلمة المرور غير صحيحة.' : 'Incorrect email or password.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login('demo_vault_token_authorized', {
      id: 'demo-user-vault-001',
      email: 'creator@elsamee3.com',
      fullName: isRTL ? 'فنان تجريبي معتمد' : 'Verified Demo Artist',
      artistType: 'both',
      country: 'EG',
    });
    toast.success(isRTL ? 'تم تسجيل الدخول السريع كفنان تجريبي!' : 'Signed in as Demo Artist!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-indigo-600 text-white shadow-md shadow-blue-500/20 mb-1">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('app.name') || 'السميع (elsamee3)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRTL
              ? 'تسجيل الدخول إلى خزنة الملكية الفكرية وإدارة المصنفات'
              : 'Sign in to your copyright vault & repertoire'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={15} className="text-brand-blue" />
              <span>{t('auth.email') || 'البريد الإلكتروني'}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-slate-800 text-sm transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock size={15} className="text-brand-blue" />
              <span>{t('auth.password') || 'كلمة المرور'}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-slate-800 text-sm transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isRTL ? 'جاري التحقق...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>{isRTL ? 'دخول تجريبي سريع للمعاينة (Demo Mode)' : 'Quick Demo Access'}</span>
          </button>
        </div>

        <div className="pt-2 text-center text-xs sm:text-sm text-slate-600 border-t border-slate-100">
          <span>{isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"} </span>
          <Link to="/register" className="text-brand-blue font-bold hover:underline ms-1">
            {isRTL ? 'إنشاء حساب جديد' : 'Register now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
