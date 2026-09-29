import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import api from '../api/client';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    artistType: 'musician',
    country: 'EG',
  });
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: 'EG', name: isRTL ? 'مصر' : 'Egypt' },
    { code: 'SA', name: isRTL ? 'السعودية' : 'Saudi Arabia' },
    { code: 'AE', name: isRTL ? 'الإمارات' : 'UAE' },
    { code: 'MA', name: isRTL ? 'المغرب' : 'Morocco' },
    { code: 'DZ', name: isRTL ? 'الجزائر' : 'Algeria' },
    { code: 'TN', name: isRTL ? 'تونس' : 'Tunisia' },
    { code: 'LB', name: isRTL ? 'لبنان' : 'Lebanon' },
    { code: 'JO', name: isRTL ? 'الأردن' : 'Jordan' },
    { code: 'KW', name: isRTL ? 'الكويت' : 'Kuwait' },
    { code: 'QA', name: isRTL ? 'قطر' : 'Qatar' },
    { code: 'OM', name: isRTL ? 'عُمان' : 'Oman' },
    { code: 'OTHER', name: isRTL ? 'أخرى' : 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error(isRTL ? 'يرجى كتابة الاسم' : 'Name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error(isRTL ? 'بريد إلكتروني غير صحيح' : 'Valid email required');
      return;
    }
    if (formData.password.length < 6) {
      toast.error(isRTL ? 'كلمة المرور: 6 أحرف على الأقل' : 'Password: 6+ characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName.trim(),
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        artistType: formData.artistType,
        artist_type: formData.artistType,
        country: formData.country,
        language: isRTL ? 'ar' : 'en',
      });

      const data = response.data;
      if (data.access_token && data.user) {
        login(data.access_token, data.user);
        toast.success(isRTL ? 'تم إنشاء حسابك بنجاح' : 'Account created successfully');
        navigate('/dashboard');
      } else {
        toast.success(isRTL ? 'تم التسجيل، سجّل دخولك' : 'Registered! Please sign in.');
        navigate('/login');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || (isRTL ? 'فشل إنشاء الحساب' : 'Registration failed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-mist border border-smoke rounded-lg focus:bg-white focus:ring-1 focus:ring-ink/20 focus:border-ink/30 outline-none text-sm transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-5 end-5">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-display">
            {isRTL ? 'السميع' : 'elsamee3'}
          </h1>
          <p className="text-sm text-ash">
            {isRTL ? 'إنشاء حساب جديد' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ash">
              {isRTL ? 'الاسم' : 'Full name'}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={isRTL ? 'الاسم الكامل أو الفني' : 'Your name or stage name'}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ash">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="artist@example.com"
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ash">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={6}
            />
            <span className="text-[11px] text-ash/60">{isRTL ? '6 أحرف على الأقل' : '6+ characters'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ash">
                {isRTL ? 'التصنيف' : 'Type'}
              </label>
              <select
                value={formData.artistType}
                onChange={(e) => setFormData({ ...formData, artistType: e.target.value })}
                className={inputClass}
              >
                <option value="musician">{isRTL ? 'ملحن / موسيقي' : 'Musician'}</option>
                <option value="lyricist">{isRTL ? 'شاعر / كاتب' : 'Lyricist'}</option>
                <option value="visual_artist">{isRTL ? 'فنان بصري' : 'Visual artist'}</option>
                <option value="both">{isRTL ? 'شامل' : 'All'}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ash">
                {isRTL ? 'الدولة' : 'Country'}
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={inputClass}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-white rounded-lg font-medium text-sm hover:bg-ink/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isRTL ? 'جاري التسجيل...' : 'Creating...'}</span>
              </>
            ) : (
              <span>{isRTL ? 'إنشاء حساب' : 'Create account'}</span>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-xs text-ash">
          {isRTL ? 'لديك حساب؟' : 'Already have an account?'}{' '}
          <Link to="/login" className="font-medium text-ink hover:underline underline-offset-2">
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
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
