import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Logo from '../components/Logo';
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
  ChevronRight,
  Radar,
  FileText,
  Fingerprint,
  Globe2,
  Layers,
  BarChart3,
  Eye
} from 'lucide-react';

export default function Landing() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const capabilities = [
    {
      id: 'acoustic',
      badge: isRTL ? 'فحص صوتي' : 'Acoustic Scan',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: <Music className="text-blue-400" size={26} />,
      title: isRTL ? 'البصمة الصوتية اللحنية' : 'Acoustic Melodic Fingerprinting',
      description: isRTL
        ? 'تحليل الطيف الترددي للألحان والمقاطع الصوتية لاكتشاف الاقتباس والسرقات اللحنية بدقة متناهية حتى بعد تغيير سرعة المقطع أو نغمته (Pitch/Tempo Shift).'
        : 'Deep acoustic wave analysis to identify melody copying, sample manipulation, and unlicensed re-recordings with high forensic confidence.',
      actionText: isRTL ? 'فحص ملف صوتي' : 'Scan Audio File',
      actionUrl: '/search',
    },
    {
      id: 'lyrics',
      badge: isRTL ? 'توثيق كلمات' : 'Poetry Proof',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: <Feather className="text-purple-400" size={26} />,
      title: isRTL ? 'شهادة إثبات الأسبقية للشعراء' : 'Proof of Creation for Lyricists',
      description: isRTL
        ? 'توليد بصمة نصية مشفرة SHA-256 وفق معايير NIST FIPS واستخراج شهادة رقمية رسمية تثبت تاريخ كتابة النص الغنائي لمنع سرقة الكلمات والقصائد.'
        : 'Generate cryptographic SHA-256 creation hashes with timestamps, providing lyricists with irrefutable proof-of-authorship certificates.',
      actionText: isRTL ? 'توثيق كلمات قصيدة' : 'Generate Lyrics Hash',
      actionUrl: '/search',
    },
    {
      id: 'cmo',
      badge: isRTL ? 'هيئات عربية' : 'Arab CMOs',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <Building2 className="text-emerald-400" size={26} />,
      title: isRTL ? 'كتالوج الهيئات والجمعيات العربية' : 'Arab Copyright Societies Repertoire',
      description: isRTL
        ? 'فحص متكامل يربط سجلات جمعية المؤلفين والملحنين بمصر (SACERAU)، الملكية الفكرية السعودية (SAIP)، ديوان ONDA بالجزائر، ومكتب BMDA بالمغرب ورموز ISWC الدولية.'
        : 'Direct unified queries across Arab collecting societies (SACERAU, SAIP, ONDA, BMDA) and international ISWC composition registers.',
      actionText: isRTL ? 'استعلام الهيئات' : 'Query CMOs',
      actionUrl: '/search',
    },
    {
      id: 'damages',
      badge: isRTL ? 'تدقيق مالي' : 'Revenue Audit',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <Calculator className="text-amber-400" size={26} />,
      title: isRTL ? 'حاسبة العائدات والتعويضات المسروقة' : 'Live Stolen Royalties Auditor',
      description: isRTL
        ? 'تدقيق مباشر لروابط يوتيوب والفيديوهات غير المصرح بها واحتساب إجمالي العائدات المالية المسلوبة وقيمة التعويضات القانونية المستحقة بالجنيه والريال والدولار.'
        : 'Direct video URL auditing to calculate exact stolen ad revenue, mechanical streaming royalties, and legal statutory damages instantly.',
      actionText: isRTL ? 'تدقيق رابط منتهك' : 'Audit Infringing URL',
      actionUrl: '/estimator',
    },
    {
      id: 'radar',
      badge: isRTL ? 'رصد آلي' : 'Auto Radar',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: <Radar className="text-rose-400" size={26} />,
      title: isRTL ? 'المراقبة المستمرة وإشعارات DMCA' : 'Automated Radar & Takedowns',
      description: isRTL
        ? 'رادار مستمر يرصد منصات البث الرقمي وشبكات التواصل، وينبهك فور رصد أي استخدام غير مرخص لمصنفك مع توليد إخطارات قانونية ملزمة بضغطة زر.'
        : 'Continuous multi-platform monitoring that alerts you the moment your work is detected, with one-click compliant DMCA notice generation.',
      actionText: isRTL ? 'استعراض الرادار' : 'Explore Radar',
      actionUrl: '/monitoring',
    },
    {
      id: 'vault',
      badge: isRTL ? 'خزنة رقمية' : 'Digital Vault',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      icon: <Shield className="text-cyan-400" size={26} />,
      title: isRTL ? 'خزنة المصنفات والأعمال الرقمية' : 'Creative Repertoire Vault',
      description: isRTL
        ? 'أرشيف رقمي سيادي مشفر يتيح للفنانين تسجيل كافة أعمالهم الغنائية، اللحنية، والبصرية وحفظ بصماتها ورموز ISRC/ISWC في مكان واحد آمن.'
        : 'A sovereign encrypted vault where creators organize, store, and manage all their musical and visual works with instant forensic traceability.',
      actionText: isRTL ? 'لوحة المصنفات' : 'My Works Vault',
      actionUrl: '/works',
    },
  ];

  const arabSocieties = [
    { name: '🇪🇬 SACERAU', label: isRTL ? 'جمعية المؤلفين والملحنين (مصر)' : 'Authors & Composers Society (Egypt)' },
    { name: '🇸🇦 SAIP', label: isRTL ? 'الهيئة السعودية للملكية الفكرية' : 'Saudi Intellectual Property Authority' },
    { name: '🇩🇿 ONDA', label: isRTL ? 'الديوان الوطني لحقوق المؤلف (الجزائر)' : 'National Copyright Office (Algeria)' },
    { name: '🇲🇦 BMDA', label: isRTL ? 'المكتب المغربي لحقوق المؤلف' : 'Moroccan Copyright Bureau' },
    { name: '🇹🇳 OTPDA', label: isRTL ? 'المؤسسة التونسية لحقوق المؤلف' : 'Tunisian Copyright Body' },
    { name: '🌐 The MLC & CISAC', label: isRTL ? 'المكانيكال الدولي وسجلات ISWC' : 'Global Mechanical & ISWC Registers' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-blue selection:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] end-[-5%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] start-[25%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Logo theme="dark" size="md" />

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#capabilities" className="hover:text-white transition-colors">
              {isRTL ? 'كتالوج القدرات' : 'Capabilities Catalog'}
            </a>
            <a href="#arab-cmo" className="hover:text-white transition-colors">
              {isRTL ? 'الهيئات والجمعيات' : 'Arab Repertoire'}
            </a>
            <a href="#estimator-preview" className="hover:text-white transition-colors">
              {isRTL ? 'حاسبة التعويضات' : 'Damages Auditor'}
            </a>
            <Link to="/search" className="hover:text-cyan-400 text-cyan-300 font-bold transition-colors flex items-center gap-1.5">
              <Zap size={15} />
              <span>{isRTL ? 'الأداة التجريبية' : 'Live Beta Tool'}</span>
            </Link>
          </nav>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <span>{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span>
                <ArrowIcon size={16} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold text-xs sm:text-sm transition-all"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <Link
                  to="/search"
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={15} className="text-cyan-300" />
                  <span>{isRTL ? 'جرب الأداة (Beta)' : 'Try Beta'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Beta Badge Indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs sm:text-sm font-semibold shadow-inner">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300">
              {isRTL ? 'متاح الآن في المرحلة التجريبية المفتوحة (Public Beta)' : 'Now Live in Public Beta'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              {isRTL ? 'تجربة حية فورية بدون اشتراك' : 'Instant free trial without paywall'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.15]">
            {isRTL ? (
              <>
                درع <span className="bg-gradient-to-r from-brand-blue via-cyan-400 to-indigo-400 bg-clip-text text-transparent">الملكية الفكرية</span> وبصمة الإبداع للمؤلفين والملحنين
              </>
            ) : (
              <>
                AI-Powered <span className="bg-gradient-to-r from-brand-blue via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Copyright Shield</span> & Creative Repertoire
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            {isRTL
              ? 'المنصة السيادية الأولى لفحص السرقات اللحنية، استخراج شهادات إثبات الأسبقية للشعراء بختم SHA-256 المشفر، وتدقيق العائدات المسروقة عبر الربط مع الهيئات وجمعيات المؤلفين والملحنين العربية.'
              : 'Protect melodies from plagiarism, secure lyrics with NIST-standard cryptographic proof-of-creation hashes, and audit stolen revenues across Arab collecting societies & DSP catalogs.'}
          </p>

          {/* MAIN PROMINENT BETA CTA BUTTON */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group border border-white/20"
            >
              <Zap size={22} className="text-cyan-200 fill-cyan-200 group-hover:animate-bounce" />
              <span>{isRTL ? '⚡ جرب الأداة الرئيسية الآن (Beta)' : '⚡ Launch Beta Tool Now'}</span>
              <ArrowIcon size={20} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            <Link
              to="/estimator"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-700/80 hover:border-slate-500 shadow-md transition-all flex items-center justify-center gap-2.5"
            >
              <Calculator size={19} className="text-amber-400" />
              <span>{isRTL ? 'حاسبة التعويضات المسروقة' : 'Damages Auditor'}</span>
            </Link>
          </div>

          {/* Quick Click-to-Test Prompts */}
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2.5">
              {isRTL ? 'أو جرب البحث فوراً بهذه الأمثلة المعتمدة:' : 'Or test immediately with these sample queries:'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { q: 'الساعة اللي بعيشها في قربك 60 دقيقة', label: isRTL ? '✍️ فحص كلمات أغنية (60 دقيقة)' : '✍️ Lyrics Scan (Assala 60 Min)' },
                { q: 'SACERAU', label: isRTL ? '🏛️ جمعية ساسيرو بمصر' : '🏛️ SACERAU Egypt' },
                { q: 'SAIP', label: isRTL ? '🇸🇦 الملكية الفكرية السعودية' : '🇸🇦 SAIP Saudi Arabia' },
                { q: 'ألحان شرقية وبيات', label: isRTL ? '🎼 فحص مصنفات الملحنين' : '🎼 Composers & Melodies' },
              ].map((sample) => (
                <button
                  key={sample.q}
                  onClick={() => navigate('/search')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/50 text-xs text-slate-300 hover:text-cyan-300 font-medium transition-all shadow-xs"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                {isRTL ? 'بصمة تشفير SHA-256' : 'NIST Cryptographic Hash'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">6+</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                {isRTL ? 'هيئات حقوق عربية مدعومة' : 'Arab CMO Repertoires'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">0.00$</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                {isRTL ? 'مجاني بالكامل في النسخة التجريبية' : 'Zero-Fee in Public Beta'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 1.5s</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                {isRTL ? 'سرعة فحص وتدقيق الروابط' : 'Instant Audit Latency'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Catalog Section */}
      <section id="capabilities" className="relative z-10 py-20 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
              <Layers size={14} />
              <span>{isRTL ? 'كتالوج قدرات منصة السميع' : 'elsamee3 Capabilities Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isRTL
                ? 'كل ما يحتاجه المبدع العربي لحماية حقوقه في منظومة واحدة'
                : 'Complete Intellectual Property Toolset for Modern Creators'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              {isRTL
                ? 'حلول تقنية وقانونية متكاملة للملحنين، الشعراء، كتاب الأغاني، والمنتجين الفنيين.'
                : 'Forensic tech and legal empowerment tailored for composers, songwriters, lyricists, and independent labels.'}
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item) => (
              <div
                key={item.id}
                className="group relative p-6 sm:p-7 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={item.actionUrl}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:underline"
                  >
                    <span>{item.actionText}</span>
                    <ArrowIcon size={15} />
                  </Link>
                  <span className="text-[11px] font-mono text-slate-500">Live Beta</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arab CMO & Collecting Societies Repertoire */}
      <section id="arab-cmo" className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <Globe2 size={14} />
              <span>{isRTL ? 'الربط العربي الإقليمي' : 'Arab Regional Integration'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRTL
                ? 'فحص شامل عبر هيئات وجمعيات المؤلفين والملحنين'
                : 'Query Arab Collecting Societies & International Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              {isRTL
                ? 'تستعلم المنصة السجلات المعتمدة لحفظ حقوق الأداء العلني والتوزيع الميكانيكي للمصنفات الغنائية والموسيقية.'
                : 'Verify ownership data across regional public performance societies and international mechanical repertoires.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {arabSocieties.map((soc) => (
              <div
                key={soc.name}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center gap-3 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-emerald-400 font-bold text-xs">
                  {soc.name.split(' ')[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">{soc.name}</h4>
                  <p className="text-[11px] text-slate-400">{soc.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <span>{isRTL ? 'استعلام دليل الجمعيات والهيئات العربية ←' : 'Browse All Supported Societies →'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Interactive Preview / Simulation Section */}
      <section id="estimator-preview" className="relative z-10 py-16 bg-gradient-to-b from-slate-900/60 to-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {isRTL ? 'معاينة حية للمحرك' : 'Engine Live Preview'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {isRTL ? 'كيف يعمل فحص السميع في ثوانٍ معدودة؟' : 'How elsamee3 Works in Seconds'}
                </h3>
              </div>
              <Link
                to="/search"
                className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{isRTL ? 'جرّب بنفسك الآن' : 'Test Live Yourself'}</span>
                <ArrowIcon size={16} />
              </Link>
            </div>

            {/* Steps Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center font-mono text-sm">
                  01
                </div>
                <h4 className="font-bold text-base text-white">
                  {isRTL ? '1. إدخال المصنف أو الكلمات' : '1. Input Work or Lyrics'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRTL
                    ? 'اكتب مقطعاً من كلمات القصيدة، أو ارفع ملفك الصوتي أو الصق رابط فيديو يوتيوب مشتبه به.'
                    : 'Paste a poetry stanza, upload an audio track, or provide a suspected video URL.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center font-mono text-sm">
                  02
                </div>
                <h4 className="font-bold text-base text-white">
                  {isRTL ? '2. استخراج البصمة والمطابقة' : '2. Forensic Hash & Matching'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRTL
                    ? 'يقوم المحرك بتوليد هاش SHA-256 مشفر والبحث فوراً في قواعد بيانات المصنفات والكاتالوجات الرقمية.'
                    : 'The engine generates SHA-256 cryptographic proof and matches against catalogs in real-time.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono text-sm">
                  03
                </div>
                <h4 className="font-bold text-base text-white">
                  {isRTL ? '3. الشهادة واحتساب التعويض' : '3. Certificate & Damages'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRTL
                    ? 'استخرج شهادة إثبات الأسبقية الرسمية، واحسب بدقة المبالغ المسروقة وصغ إشعار إزالة قانوني.'
                    : 'Receive your authorship certificate, calculate stolen royalties, and generate DMCA notices.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Prominent Call To Action Banner */}
      <section className="relative z-10 py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 border border-blue-500/30 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-300" />
              <span>{isRTL ? 'مرحلة البيتا المفتوحة (Open Beta)' : 'Free Open Beta Access'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isRTL ? 'ابدأ حماية مصنفاتك الإبداعية الآن مجاناً' : 'Start Protecting Your Creative Works Free Today'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isRTL
                ? 'لا تنتظر حتى يتم اقتباس لحنك أو سرقة كلماتك. افحص مصنفاتك واستخرج شهادة إثبات الأسبقية في ثوانٍ.'
                : 'Do not wait for your melody to be copied or your lyrics to be stolen. Run your forensic scan now.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/search"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Zap size={18} className="text-brand-blue fill-brand-blue" />
                <span>{isRTL ? 'تشغيل الأداة الرئيسية فوراً (Beta)' : 'Launch Main Beta Tool'}</span>
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/40 text-white font-bold text-sm transition-all"
              >
                {isRTL ? 'إنشاء حساب دائم في الخزنة' : 'Create Vault Account'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo theme="dark" size="sm" />
            <p className="text-[11px] text-slate-400">
              {isRTL
                ? 'السميع (elsamee3): المنصة السيادية لحماية حقوق الملكية الفكرية والبصمة الصوتية للمبدعين العرب.'
                : 'elsamee3: Sovereign copyright protection & forensic acoustic vault for creators.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <Link to="/search" className="hover:text-white transition-colors">
              {isRTL ? 'البحث والبصمة' : 'Search & Fingerprint'}
            </Link>
            <Link to="/estimator" className="hover:text-white transition-colors">
              {isRTL ? 'حاسبة التعويضات' : 'Damages Auditor'}
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              {isRTL ? 'إنشاء حساب' : 'Register'}
            </Link>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} elsamee3. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
