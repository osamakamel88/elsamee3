import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import {
  Shield,
  Zap,
  Music,
  Feather,
  Building2,
  Calculator,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Radar,
  Fingerprint,
  Globe2,
  Layers,
  BarChart3,
  ShieldCheck,
  Check,
  Radio
} from 'lucide-react';

export default function Landing() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const capabilities = [
    {
      id: 'acoustic',
      badge: isRTL ? 'فحص الألحان' : 'Acoustic Scan',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Music className="text-brand-blue" size={24} />,
      title: isRTL ? 'البصمة الصوتية اللحنية' : 'Acoustic Melodic Fingerprinting',
      description: isRTL
        ? 'تحليل الطيف الترددي للألحان والمقاطع الموسيقية لاكتشاف الاقتباس والسرقات اللحنية بدقة متناهية حتى بعد تغيير سرعة المقطع أو نغمته (Pitch/Tempo Shift).'
        : 'Deep acoustic wave analysis to identify melody copying, sample manipulation, and unlicensed re-recordings with high forensic confidence.',
      actionText: isRTL ? 'فحص ملف صوتي' : 'Scan Audio File',
      actionUrl: '/search',
    },
    {
      id: 'lyrics',
      badge: isRTL ? 'توثيق الكلمات' : 'Lyrics Seal',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Feather className="text-purple-600" size={24} />,
      title: isRTL ? 'شهادة إثبات الأسبقية للشعراء' : 'Proof of Creation for Lyricists',
      description: isRTL
        ? 'توليد بصمة نصية مشفرة SHA-256 وفق معايير NIST FIPS واستخراج شهادة رقمية رسمية تثبت تاريخ كتابة النص الغنائي لمنع سرقة الكلمات والقصائد.'
        : 'Generate cryptographic SHA-256 creation hashes with timestamps, providing lyricists with irrefutable proof-of-authorship certificates.',
      actionText: isRTL ? 'توثيق كلمات قصيدة' : 'Generate Lyrics Certificate',
      actionUrl: '/search',
    },
    {
      id: 'cmo',
      badge: isRTL ? 'الهيئات والجمعيات' : 'Global Repertoire',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <Building2 className="text-emerald-700" size={24} />,
      title: isRTL ? 'كتالوج الهيئات والجمعيات الدولية' : 'Global & Arab Collecting Societies',
      description: isRTL
        ? 'فحص شامل يربط سجلات جمعية المؤلفين والملحنين بمصر (SACERAU)، الملكية الفكرية السعودية (SAIP)، ديوان ONDA بالجزائر، ومكتب BMDA بالمغرب ورموز ISWC الدولية.'
        : 'Direct unified queries across Arab collecting societies (SACERAU, SAIP, ONDA, BMDA) and international ISWC composition registers.',
      actionText: isRTL ? 'استعلام الهيئات' : 'Query Repertoires',
      actionUrl: '/search',
    },
    {
      id: 'damages',
      badge: isRTL ? 'تدقيق مالي' : 'Royalties Audit',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Calculator className="text-amber-600" size={24} />,
      title: isRTL ? 'حاسبة العائدات والتعويضات المسروقة' : 'Live Stolen Royalties Auditor',
      description: isRTL
        ? 'تدقيق مباشر لروابط الفيديوهات غير المصرح بها واحتساب إجمالي العائدات المالية المسلوبة وقيمة التعويضات القانونية المستحقة بالجنيه والريال والدولار.'
        : 'Direct video URL auditing to calculate exact stolen ad revenue, mechanical streaming royalties, and legal statutory damages instantly.',
      actionText: isRTL ? 'تدقيق رابط منتهك' : 'Audit Infringing URL',
      actionUrl: '/estimator',
    },
    {
      id: 'radar',
      badge: isRTL ? 'رصد دائم' : 'Auto Radar',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <Radar className="text-rose-600" size={24} />,
      title: isRTL ? 'المراقبة المستمرة وإشعارات DMCA' : 'Automated Radar & Takedowns',
      description: isRTL
        ? 'رادار مستمر يرصد منصات البث الرقمي وشبكات التواصل، وينبهك فور رصد أي استخدام غير مرخص لمصنفك مع صياغة إخطارات إزالة قانونية بنقرة واحدة.'
        : 'Continuous multi-platform monitoring that alerts you the moment your work is detected, with one-click compliant DMCA notice generation.',
      actionText: isRTL ? 'استعراض الرادار' : 'Explore Radar',
      actionUrl: '/monitoring',
    },
    {
      id: 'vault',
      badge: isRTL ? 'خزنة رقمية' : 'Creative Vault',
      badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: <Shield className="text-cyan-700" size={24} />,
      title: isRTL ? 'خزنة المصنفات والأعمال الرقمية' : 'Creative Repertoire Vault',
      description: isRTL
        ? 'أرشيف رقمي سيادي مشفر يتيح للفنانين حول العالم تسجيل كافة أعمالهم الغنائية، اللحنية، والبصرية وحفظ بصماتها ورموز ISRC و ISWC في مكان واحد آمن.'
        : 'A sovereign encrypted vault where creators organize, store, and manage all their musical and visual works with instant forensic traceability.',
      actionText: isRTL ? 'لوحة المصنفات' : 'My Works Vault',
      actionUrl: '/works',
    },
  ];

  const globalCoverage = [
    { name: '🇪🇬 SACERAU', label: isRTL ? 'جمعية المؤلفين والملحنين بمصر' : 'Authors & Composers Society (Egypt)' },
    { name: '🇸🇦 SAIP', label: isRTL ? 'الهيئة السعودية للملكية الفكرية' : 'Saudi Intellectual Property Authority' },
    { name: '🇩🇿 ONDA', label: isRTL ? 'الديوان الوطني لحقوق المؤلف (الجزائر)' : 'National Copyright Office (Algeria)' },
    { name: '🇲🇦 BMDA', label: isRTL ? 'المكتب المغربي لحقوق المؤلف' : 'Moroccan Copyright Bureau' },
    { name: '🌐 The MLC & ISWC', label: isRTL ? 'المكانيكال الدولي وسجلات ISWC' : 'Global Mechanical & ISWC Registers' },
    { name: '🎵 Global DSPs', label: isRTL ? 'يوتيوب وسبوتيفاي وآبل ميوزك' : 'YouTube, Spotify & Apple Music' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-blue selection:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Logo theme="light" size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#capabilities" className="hover:text-brand-blue transition-colors">
              {isRTL ? 'كتالوج القدرات' : 'Capabilities Catalog'}
            </a>
            <a href="#global-repertoire" className="hover:text-brand-blue transition-colors">
              {isRTL ? 'الهيئات والجمعيات' : 'Global Repertoires'}
            </a>
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors">
              {isRTL ? 'كيف يعمل؟' : 'How It Works'}
            </a>
            <Link to="/estimator" className="hover:text-brand-blue transition-colors flex items-center gap-1">
              <Calculator size={14} className="text-amber-600" />
              <span>{isRTL ? 'حاسبة التعويضات' : 'Damages Auditor'}</span>
            </Link>
          </nav>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span>
                <ArrowIcon size={16} />
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-all"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <Link
                  to="/search"
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Zap size={14} className="fill-white" />
                  <span>{isRTL ? 'جرب الأداة (Beta)' : 'Try Beta Tool'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Light, Simple & Breathable */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 bg-gradient-to-b from-slate-50/70 via-white to-white overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Open Beta Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-xs sm:text-sm font-semibold text-blue-900 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-brand-blue font-bold">
              {isRTL ? 'متاح الآن في المرحلة التجريبية المفتوحة (Public Beta)' : 'Now Live in Public Beta for Artists Worldwide'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">
              {isRTL ? 'فحص حي وفوري مجاناً' : 'Free instant forensic trial'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.25] sm:leading-[1.18]">
            {isRTL ? (
              <>
                درع <span className="text-brand-blue">الملكية الفكرية</span> وبصمة الإبداع للمبدعين والفنانين حول العالم
              </>
            ) : (
              <>
                Universal <span className="text-brand-blue">Copyright Shield</span> & Forensic Repertoire for Creators
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed">
            {isRTL
              ? 'المنصة الشاملة للملحنين والشعراء والموسيقيين لكشف السرقات اللحنية، استخراج شهادات إثبات الأسبقية بختم SHA-256، وتدقيق العائدات المسروقة مباشرة عبر الهيئات والكاتالوجات الدولية.'
              : 'Empowering songwriters, composers, lyricists, and labels worldwide to detect melody theft, seal lyrics with SHA-256 authorship certificates, and audit stolen DSP revenues.'}
          </p>

          {/* MAIN PROMINENT BETA CTA BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group border border-blue-500"
            >
              <Zap size={20} className="fill-white group-hover:animate-pulse" />
              <span>{isRTL ? '⚡ جرب الأداة الرئيسية الآن (Beta)' : '⚡ Launch Beta Tool Now'}</span>
              <ArrowIcon size={19} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            <Link
              to="/estimator"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 hover:border-slate-400 shadow-2xs transition-all flex items-center justify-center gap-2.5"
            >
              <Calculator size={18} className="text-amber-600" />
              <span>{isRTL ? 'حاسبة العائدات المسروقة' : 'Damages Auditor'}</span>
            </Link>
          </div>

          {/* Clickable Quick Sample Searches */}
          <div className="pt-1">
            <p className="text-xs text-slate-400 mb-2">
              {isRTL ? 'أو ابدأ التجربة فوراً بأحد هذه النماذج:' : 'Or test immediately with these sample queries:'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { q: 'الساعة اللي بعيشها في قربك 60 دقيقة', label: isRTL ? '✍️ فحص كلمات (60 دقيقة)' : '✍️ Lyrics (60 Minutes)' },
                { q: 'SACERAU', label: isRTL ? '🏛️ جمعية المؤلفين والملحنين (مصر)' : '🏛️ SACERAU Repertoire' },
                { q: 'SAIP', label: isRTL ? '🇸🇦 الملكية الفكرية السعودية' : '🇸🇦 SAIP Saudi Arabia' },
                { q: 'ألحان شرقية', label: isRTL ? '🎼 ألحان ومصنفات موسيقية' : '🎼 Musical Works' },
              ].map((sample) => (
                <button
                  key={sample.q}
                  onClick={() => navigate('/search')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-blue-50 border border-slate-200 text-xs text-slate-700 hover:text-brand-blue font-medium transition-all shadow-2xs"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Highlights Grid - Clean Light Theme */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                {isRTL ? 'معايير NIST للتشفير' : 'NIST Cryptographic Proof'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">Global</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                {isRTL ? 'تغطية للمبدعين عالمياً' : 'Worldwide Artists Coverage'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">0.00$</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                {isRTL ? 'مجاني بالكامل في البيتا' : 'Free Public Beta Trial'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">&lt; 1.5s</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                {isRTL ? 'سرعة فحص الروابط والألحان' : 'Instant Audit Latency'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Catalog Section - Simple, Clean & Light */}
      <section id="capabilities" className="py-20 bg-slate-50/50 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-200 text-xs font-bold">
              <Layers size={14} />
              <span>{isRTL ? 'كتالوج قدرات منصة السميع' : 'elsamee3 Capabilities Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isRTL
                ? 'حلول سيادية متكاملة لحماية حقوق المبدعين حول العالم'
                : 'Complete Intellectual Property Toolset for Creators Worldwide'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {isRTL
                ? 'أدوات تقنية وقانونية متطورة مصممة للملحنين، كتاب الكلمات والشعراء، والفنانين المستقلين.'
                : 'Advanced forensic tech and royalty auditing tailored for songwriters, composers, lyricists, and artists.'}
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item) => (
              <div
                key={item.id}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 shadow-2xs group-hover:bg-blue-100/60 transition-colors">
                      {item.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeStyle}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={item.actionUrl}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors group-hover:underline"
                  >
                    <span>{item.actionText}</span>
                    <ArrowIcon size={14} />
                  </Link>
                  <span className="text-[11px] font-semibold text-slate-400">Open Beta</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global & Arab Repertoire Section */}
      <section id="global-repertoire" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Globe2 size={14} />
              <span>{isRTL ? 'تغطية إقليمية ودولية' : 'Worldwide Repertoires & Societies'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isRTL
                ? 'فحص شامل عبر الهيئات وجمعيات المؤلفين والملحنين'
                : 'Unified Cross-Queries Across Collecting Societies'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              {isRTL
                ? 'تدقيق مباشر لقواعد بيانات الأداء العلني والتوزيع الميكانيكي للمصنفات الفنية في مصر والسعودية والجزائر والمغرب والسجلات العالمية.'
                : 'Verify ownership data across regional public performance societies, international mechanical registries, and streaming platforms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {globalCoverage.map((soc) => (
              <div
                key={soc.name}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 transition-colors flex items-center gap-3 shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 shrink-0 text-emerald-800 font-bold text-xs">
                  {soc.name.split(' ')[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{soc.name}</h4>
                  <p className="text-[11px] text-slate-500">{soc.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            >
              <span>{isRTL ? 'استعلام دليل الجمعيات والهيئات العربية ←' : 'Browse All Societies in Search Tool →'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Clean 3-Step Flow */}
      <section id="how-it-works" className="py-16 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              {isRTL ? 'طريقة الاستخدام' : 'Simple 3-Step Workflow'}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              {isRTL ? 'كيف يعمل فحص السميع في ثوانٍ معدودة؟' : 'How elsamee3 Protects Your Work in Seconds'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue font-bold flex items-center justify-center font-mono text-sm border border-blue-200">
                01
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {isRTL ? '1. إدخال المصنف أو الكلمات' : '1. Input Work or Lyrics'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isRTL
                  ? 'اكتب مقطعاً من كلمات القصيدة، أو ارفع ملفك الصوتي أو الصق رابط فيديو يوتيوب مشتبه به.'
                  : 'Paste a lyrics stanza, upload an audio track, or provide a suspected video URL.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center font-mono text-sm border border-purple-200">
                02
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {isRTL ? '2. استخراج البصمة والمطابقة' : '2. Forensic Hash & Matching'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isRTL
                  ? 'يقوم المحرك بتوليد هاش SHA-256 مشفر والبحث فوراً في قواعد بيانات المصنفات والكاتالوجات الدولية.'
                  : 'The engine generates SHA-256 cryptographic proof and matches against catalogs in real-time.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center font-mono text-sm border border-emerald-200">
                03
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {isRTL ? '3. الشهادة واحتساب التعويض' : '3. Certificate & Damages'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isRTL
                  ? 'استخرج شهادة إثبات الأسبقية الرسمية، واحسب بدقة المبالغ المسروقة وصغ إشعار إزالة قانوني.'
                  : 'Receive your authorship certificate, calculate stolen royalties, and generate DMCA notices.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Prominent Call To Action Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-blue-900 border border-blue-200 text-xs font-semibold shadow-2xs">
              <Sparkles size={14} className="text-brand-blue" />
              <span>{isRTL ? 'مرحلة البيتا المفتوحة (Open Beta)' : 'Free Open Beta Access Worldwide'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isRTL ? 'ابدأ حماية مصنفاتك الإبداعية الآن مجاناً' : 'Start Protecting Your Creative Works Free Today'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {isRTL
                ? 'لا تنتظر حتى يتم اقتباس لحنك أو سرقة كلماتك. افحص مصنفاتك واستخرج شهادة إثبات الأسبقية في ثوانٍ.'
                : 'Do not wait for your melody to be copied or your lyrics to be stolen. Run your forensic scan now.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/search"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Zap size={18} className="fill-white" />
                <span>{isRTL ? 'تشغيل الأداة الرئيسية فوراً (Beta)' : 'Launch Main Beta Tool'}</span>
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all shadow-2xs"
              >
                {isRTL ? 'إنشاء حساب دائم في الخزنة' : 'Create Vault Account'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Footer with Mandatory O3 Smart Solutions Attribution */}
      <Footer variant="full" />
    </div>
  );
}
