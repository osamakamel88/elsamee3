import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import api from '../api/client';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { i18n } = useTranslation();
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
        toast.success(isRTL ? 'مرحباً بك!' : 'Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(isRTL ? 'فشل تسجيل الدخول' : 'Login failed');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || (isRTL ? 'بيانات غير صحيحة' : 'Invalid credentials');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login('demo_vault_token_authorized', {
      id: 'demo-user-vault-001',
      email: 'creator@elsamee3.com',
      fullName: isRTL ? 'فنان تجريبي' : 'Demo Artist',
      artistType: 'both',
      country: 'EG',
    });
    toast.success(isRTL ? 'تم الدخول كفنان تجريبي' : 'Signed in as Demo Artist');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-5 end-5">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-display">
            {isRTL ? 'السميع' : 'elsamee3'}
          </h1>
          <p className="text-sm text-ash">
            {isRTL ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ash">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@example.com"
              className="w-full px-4 py-3 bg-mist border border-smoke rounded-lg focus:bg-white focus:ring-1 focus:ring-ink/20 focus:border-ink/30 outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ash">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-mist border border-smoke rounded-lg focus:bg-white focus:ring-1 focus:ring-ink/20 focus:border-ink/30 outline-none text-sm transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-white rounded-lg font-medium text-sm hover:bg-ink/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isRTL ? 'جاري الدخول...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isRTL ? 'تسجيل الدخول' : 'Sign in'}</span>
            )}
          </button>
        </form>

        {/* Demo */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 text-xs font-medium text-ash hover:text-ink border border-dashed border-smoke rounded-lg hover:border-ink/20 transition-colors"
        >
          {isRTL ? 'دخول تجريبي سريع' : 'Quick demo access'}
        </button>

        {/* Register link */}
        <p className="text-center text-xs text-ash">
          {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <Link to="/register" className="font-medium text-ink hover:underline underline-offset-2">
            {isRTL ? 'إنشاء حساب' : 'Register'}
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-[11px] text-ash/60">
          &copy; {new Date().getFullYear()} elsamee3 &middot;{' '}
          {isRTL ? 'تصميم وتطوير' : 'Designed & Developed by'}{' '}
          <a
            href="https://o3.instafeed.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-2"
          >
            O3 Smart Solutions
          </a>
        </p>
      </div>
    </div>
  );
}
