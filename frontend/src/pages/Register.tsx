import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Logo from '../components/Logo';
import api from '../api/client';
import { Shield, User, Mail, Lock, Globe, Music, Loader2, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { t, i18n } = useTranslation();
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
    { code: 'EG', name: isRTL ? 'مصر (Egypt)' : 'Egypt' },
    { code: 'SA', name: isRTL ? 'المملكة العربية السعودية (KSA)' : 'Saudi Arabia' },
    { code: 'AE', name: isRTL ? 'الإمارات العربية المتحدة (UAE)' : 'United Arab Emirates' },
    { code: 'MA', name: isRTL ? 'المغرب (Morocco)' : 'Morocco' },
    { code: 'DZ', name: isRTL ? 'الجزائر (Algeria)' : 'Algeria' },
    { code: 'TN', name: isRTL ? 'تونس (Tunisia)' : 'Tunisia' },
    { code: 'LB', name: isRTL ? 'لبنان (Lebanon)' : 'Lebanon' },
    { code: 'JO', name: isRTL ? 'الأردن (Jordan)' : 'Jordan' },
    { code: 'KW', name: isRTL ? 'الكويت (Kuwait)' : 'Kuwait' },
    { code: 'QA', name: isRTL ? 'قطر (Qatar)' : 'Qatar' },
    { code: 'OM', name: isRTL ? 'عُمان (Oman)' : 'Oman' },
    { code: 'OTHER', name: isRTL ? 'دولة أخرى (Other)' : 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error(isRTL ? 'يرجى كتابة الاسم الكامل' : 'Full name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error(isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Valid email is required');
      return;
    }
    if (formData.password.length < 6) {
      toast.error(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
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
        toast.success(
          isRTL
            ? 'تم إنشاء حسابك وحفظه في قاعدة البيانات بنجاح!'
            : 'Account registered and saved in database successfully!'
        );
        navigate('/dashboard');
      } else {
        toast.success(isRTL ? 'تم التسجيل بنجاح، يرجى تسجيل الدخول.' : 'Registered successfully! Please log in.');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || (isRTL ? 'فشل إنشاء الحساب، يرجى المحاولة ثانية.' : 'Failed to register account.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 w-full max-w-lg space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Logo size="lg" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRTL
              ? 'سجّل حسابك لحماية ألحانك، أشعارك، وأعمالك الفنية واستخراج شهادات إثبات الأسبقية.'
              : 'Register to protect your melodies, lyrics, and creative works.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User size={15} className="text-brand-blue" />
              <span>{isRTL ? 'الاسم الكامل أو الاسم الفني' : 'Full Name / Stage Name'}</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={isRTL ? 'مثال: أحمد ممدوح أو فرقة النغم' : 'e.g. Sara Composer'}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-slate-800 text-sm transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={15} className="text-brand-blue" />
              <span>{t('auth.email') || 'البريد الإلكتروني'}</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-slate-800 text-sm transition-all"
              required
              minLength={6}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRTL ? '6 أحرف أو أرقام على الأقل' : 'At least 6 characters'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Music size={15} className="text-brand-blue" />
                <span>{isRTL ? 'التصنيف الفني' : 'Artist Type'}</span>
              </label>
              <select
                value={formData.artistType}
                onChange={(e) => setFormData({ ...formData, artistType: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 text-sm transition-all"
              >
                <option value="musician">{isRTL ? 'ملحن / مؤلف موسيقي' : 'Composer / Musician'}</option>
                <option value="lyricist">{isRTL ? 'شاعر / كاتب كلمات' : 'Lyricist / Songwriter'}</option>
                <option value="visual_artist">{isRTL ? 'فنان بصري / مصمم' : 'Visual Artist'}</option>
                <option value="both">{isRTL ? 'شامل (موسيقي وبصري)' : 'Musician & Visual'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe size={15} className="text-brand-blue" />
                <span>{isRTL ? 'الدولة' : 'Country'}</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 text-sm transition-all"
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
            className="w-full py-3 bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isRTL ? 'جاري التسجيل وحفظ الحساب...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>{isRTL ? 'إنشاء حساب وتسجيل في قاعدة البيانات' : 'Register & Save to Database'}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs sm:text-sm text-slate-600 border-t border-slate-100">
          <span>{isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'} </span>
          <Link to="/login" className="text-brand-blue font-bold hover:underline ms-1">
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}
