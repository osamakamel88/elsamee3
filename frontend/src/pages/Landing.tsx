import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft } from 'lucide-react';

/* ──────────────────────────────────────────────
   Animated Waveform — the hero visual
   ────────────────────────────────────────────── */
function HeroWaveform() {
  const makePath = (
    amplitude: number,
    frequency: number,
    yOffset: number,
    phaseOffset: number = 0,
  ) => {
    const points: string[] = [];
    const width = 1200;
    for (let x = 0; x <= width; x += 2) {
      const y = yOffset + amplitude * Math.sin((x / width) * Math.PI * 2 * frequency + phaseOffset);
      points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  const waves = [
    { amp: 30, freq: 1.5, y: 140, phase: 0,    anim: 'animate-wave-1', opacity: 0.06, stroke: '#6366f1' },
    { amp: 45, freq: 1,   y: 140, phase: 0.8,  anim: 'animate-wave-2', opacity: 0.10, stroke: '#6366f1' },
    { amp: 25, freq: 2,   y: 140, phase: 1.6,  anim: 'animate-wave-3', opacity: 0.07, stroke: '#818cf8' },
    { amp: 55, freq: 0.7, y: 140, phase: 2.4,  anim: 'animate-wave-4', opacity: 0.12, stroke: '#6366f1' },
    { amp: 18, freq: 2.5, y: 140, phase: 3.2,  anim: 'animate-wave-1', opacity: 0.05, stroke: '#a5b4fc' },
    { amp: 38, freq: 1.2, y: 140, phase: 4,    anim: 'animate-wave-3', opacity: 0.08, stroke: '#6366f1' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/[0.04] rounded-full blur-[100px] animate-glow-pulse" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 280" preserveAspectRatio="none" fill="none">
        {waves.map((w, i) => (
          <path key={i} d={makePath(w.amp, w.freq, w.y, w.phase)} stroke={w.stroke} strokeWidth="1.5" opacity={w.opacity} fill="none" className={w.anim} style={{ transformOrigin: 'center' }} />
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Showcase Section — alternating image + text
   ────────────────────────────────────────────── */
interface ShowcaseItemProps {
  num: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  features: string[];
  featuresAr: string[];
  image: string;
  link: string;
  reversed?: boolean;
  isRTL: boolean;
}

function ShowcaseItem({ num, title, titleAr, desc, descAr, features, featuresAr, image, link, reversed, isRTL }: ShowcaseItemProps) {
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? 'lg:direction-rtl' : ''}`}>
      {/* Text side */}
      <div className={`space-y-5 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <span className="text-xs font-mono text-accent">{num}</span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-display leading-tight">
          {isRTL ? titleAr : title}
        </h3>
        <p className="text-sm sm:text-base text-ash leading-relaxed">
          {isRTL ? descAr : desc}
        </p>
        <ul className="space-y-2">
          {(isRTL ? featuresAr : features).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ash">
              <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          to={link}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent transition-colors pt-2"
        >
          <span>{isRTL ? 'جرّب الآن' : 'Try it now'}</span>
          <Arrow size={14} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {/* Image side */}
      <div className={`${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="rounded-2xl overflow-hidden border border-smoke shadow-sm bg-mist">
          <img
            src={image}
            alt={isRTL ? titleAr : title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}


export default function Landing() {
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const showcaseItems: Omit<ShowcaseItemProps, 'isRTL'>[] = [
    {
      num: '01',
      title: 'Unified copyright search',
      titleAr: 'البحث الموحد في قواعد حقوق النشر',
      desc: 'Search across international repertoire databases, Arab collecting societies, and global DSP catalogs in one unified query. Auto-detects ISRC, ISWC, URLs, artist names, and lyrics.',
      descAr: 'بحث شامل عبر قواعد البيانات الدولية وجمعيات المؤلفين والملحنين العربية وكاتالوجات البث الرقمي في استعلام واحد موحد.',
      features: [
        'Cross-query MusicBrainz, Discogs, The MLC, Apple Music, and Openverse',
        'Arab society directory: SACERAU, SAIP, ONDA, BMDA, OTPDA',
        'Auto-detect ISRC/ISWC codes, URLs, and artist names',
        'Audio fingerprint upload and reverse image search',
        'Session caching — results persist across tab switches',
      ],
      featuresAr: [
        'بحث متقاطع في MusicBrainz و Discogs و The MLC و Apple Music',
        'دليل الجمعيات العربية: SACERAU و SAIP و ONDA و BMDA',
        'كشف تلقائي لأكواد ISRC و ISWC والروابط وأسماء الفنانين',
        'رفع بصمة صوتية وبحث عكسي بالصور',
        'تخزين مؤقت — النتائج تبقى عند التنقل بين الأقسام',
      ],
      image: '/showcase/search.jpg',
      link: '/search',
    },
    {
      num: '02',
      title: 'Lyrics proof of authorship',
      titleAr: 'شهادة إثبات أسبقية الكلمات',
      desc: 'Generate cryptographic SHA-256 certificates for your lyrics and poetry. Create irrefutable, timestamped proof that you wrote specific words before anyone else — admissible as digital evidence.',
      descAr: 'إنشاء شهادة تشفيرية SHA-256 لكلماتك وأشعارك. إثبات مُوثّق ومُختوم بالوقت أنك كتبت هذه الكلمات قبل أي شخص آخر.',
      features: [
        'SHA-256 cryptographic hashing per NIST FIPS 180-4',
        'Word count, unique vocabulary, and shingle analysis',
        'Timestamped creation certificate with one-click copy',
        'Works with Arabic poetry, English lyrics, and any language',
        'Instant — no account required during beta',
      ],
      featuresAr: [
        'تشفير SHA-256 وفق معيار NIST FIPS 180-4',
        'تحليل عدد الكلمات والمفردات الفريدة والشرائح النصية',
        'شهادة مختومة بالوقت مع نسخ بنقرة واحدة',
        'يعمل مع الشعر العربي والإنجليزي وأي لغة',
        'فوري — لا يتطلب حساباً في المرحلة التجريبية',
      ],
      image: '/showcase/lyrics.jpg',
      link: '/search',
      reversed: true,
    },
    {
      num: '03',
      title: 'Live stolen revenue audit',
      titleAr: 'تدقيق مباشر للعائدات المسروقة',
      desc: 'Audit real YouTube views and multi-channel DSP usage to calculate net royalty splits for creators. Compute statutory litigation claims under Egyptian Law 82/2002 and international copyright treaties.',
      descAr: 'تدقيق مباشر لمشاهدات يوتيوب واستخدام منصات البث لاحتساب حصص العائدات الصافية للمبدعين وحساب مطالبات التعويض القانونية.',
      features: [
        'Live YouTube view scraping and automatic slider population',
        'Multi-channel breakdown: YouTube AdSense, DSP streaming, TikTok UGC, commercial sync',
        'Creator role-based splits: lyricist 15%, composer 15%, performer 35%, full rights 100%',
        'Multi-currency support: USD, EGP, SAR, AED, EUR',
        'Formal settlement notice generator citing Egyptian Law 82/2002 and Berne Convention',
      ],
      featuresAr: [
        'جلب مباشر لمشاهدات يوتيوب وتعبئة تلقائية للبيانات',
        'تفصيل متعدد القنوات: يوتيوب، بث رقمي، تيك توك، مزامنة تجارية',
        'تقسيم حسب الدور: شاعر 15%، ملحن 15%، مؤدي 35%، حقوق كاملة 100%',
        'دعم عملات متعددة: دولار، جنيه، ريال، درهم، يورو',
        'مولّد إشعار تسوية رسمي يستند لقانون حماية الملكية الفكرية 82/2002',
      ],
      image: '/showcase/estimator.jpg',
      link: '/estimator',
    },
    {
      num: '04',
      title: '24/7 monitoring sentinel',
      titleAr: 'نظام المراقبة المستمرة',
      desc: 'Dual-engine monitoring that tracks songwriter publishing splits across collecting societies (The MLC, SACEM) and distributors (DistroKid, RouteNote), while running continuous acoustic matching across streaming and social platforms.',
      descAr: 'نظام مراقبة مزدوج يتتبع حصص النشر عبر جمعيات التحصيل (The MLC، SACEM) والموزعين (DistroKid، RouteNote) ويجري مطابقة صوتية مستمرة عبر منصات البث.',
      features: [
        'Writer & Repertoire Sentinel: track splits at The MLC, SACEM, DistroKid, RouteNote',
        'Platform scanners: YouTube, Spotify, SoundCloud, TikTok acoustic matching',
        'DistroKid TSV import — parse real "Excruciating Detail" royalty exports',
        'IPI number tracking and co-writer attribution management',
        'Real-time scan status, last scan timestamps, and match counters',
      ],
      featuresAr: [
        'مراقب الكتّاب: تتبع حصص النشر في The MLC و SACEM و DistroKid و RouteNote',
        'ماسحات المنصات: يوتيوب وسبوتيفاي وساوند كلاود وتيك توك',
        'استيراد ملفات DistroKid TSV — تحليل تقارير العائدات الحقيقية',
        'تتبع رقم IPI وإدارة إسناد المؤلفين المشاركين',
        'حالة المسح المباشر وطوابع الوقت وعدادات المطابقة',
      ],
      image: '/showcase/monitoring.jpg',
      link: '/monitoring',
      reversed: true,
    },
    {
      num: '05',
      title: 'Infringement alerts feed',
      titleAr: 'خلاصة تنبيهات الانتهاكات',
      desc: 'Real-time feed of detected copyright breaches, pirated uploads, uncredited streams, and derivative works. Each alert includes severity classification, match confidence, and direct enforcement actions.',
      descAr: 'خلاصة فورية للانتهاكات المكتشفة والتحميلات المقرصنة والبث غير المعتمد والأعمال المشتقة مع تصنيف الشدة ونسبة الثقة وإجراءات الإنفاذ.',
      features: [
        'Severity-coded alerts: High (exact copy), Medium (modified), Low (derivative)',
        'Match confidence percentage with forensic fingerprint correlation',
        'Clickable infringing URLs with platform identification',
        'Direct "Take Action" handoff to DMCA generator with case pre-loaded',
        'Dismiss and false-positive management workflow',
      ],
      featuresAr: [
        'تنبيهات مصنفة: عالية (نسخة مطابقة)، متوسطة (معدّلة)، منخفضة (مشتقة)',
        'نسبة ثقة المطابقة مع ارتباط البصمة الجنائية',
        'روابط المحتوى المنتهك مع تحديد المنصة',
        'إحالة مباشرة لمولّد DMCA مع تحميل القضية تلقائياً',
        'إدارة التجاهل والإيجابيات الخاطئة',
      ],
      image: '/showcase/alerts.jpg',
      link: '/alerts',
    },
    {
      num: '06',
      title: 'DMCA notice generator',
      titleAr: 'مولّد إشعارات الإزالة DMCA',
      desc: 'Generate legally enforceable DMCA takedown notices under 17 U.S.C. Section 512(c)(3) with fair use pre-screening, statutory 6-point compliance, and direct submission links to platform complaint portals.',
      descAr: 'إنشاء إشعارات إزالة DMCA ملزمة قانونياً بموجب القسم 512 مع فحص الاستخدام العادل والامتثال النظامي وروابط مباشرة لبوابات الشكاوى.',
      features: [
        'Statutory 6-point DMCA notice with all required legal elements',
        'Fair Use checklist based on Lenz v. Universal Music Corp. precedent',
        'Multi-platform support: YouTube, Instagram, TikTok, Spotify, SoundCloud, Amazon',
        'Monospace preview with one-click copy to clipboard',
        'Enforcement pipeline tracking: Draft, Sent, Acknowledged, Resolved',
      ],
      featuresAr: [
        'إشعار DMCA بستة عناصر قانونية مطلوبة',
        'قائمة فحص الاستخدام العادل وفق سابقة Lenz ضد Universal',
        'دعم منصات متعددة: يوتيوب، إنستغرام، تيك توك، سبوتيفاي، أمازون',
        'معاينة بخط ثابت مع نسخ بنقرة واحدة',
        'تتبع خط الإنفاذ: مسودة، مُرسل، مُستلم، مُحلّ',
      ],
      image: '/showcase/takedown.jpg',
      link: '/takedowns',
      reversed: true,
    },
    {
      num: '07',
      title: 'Creative works vault',
      titleAr: 'خزنة المصنفات الإبداعية',
      desc: 'Encrypted digital archive where creators register, fingerprint, and manage all their musical and visual works. Each work is stored with ISRC/ISWC identifiers, perceptual hashes, and continuous monitoring status.',
      descAr: 'أرشيف رقمي مشفر يتيح للمبدعين تسجيل أعمالهم الموسيقية والبصرية وإدارتها مع أكواد ISRC و ISWC والبصمات الإدراكية وحالة المراقبة.',
      features: [
        'Multi-role onboarding: composer, lyricist, singer, visual artist',
        'File upload with automatic fingerprint generation (chromaprint, pHash, dHash)',
        'ISRC and ISWC code association for each registered work',
        'Active monitoring toggle with match detection counters',
        'Lyrics text registration for poets and songwriters',
      ],
      featuresAr: [
        'تسجيل متعدد الأدوار: ملحن، شاعر، مغني، فنان بصري',
        'رفع ملفات مع توليد بصمة تلقائي (chromaprint، pHash، dHash)',
        'ربط أكواد ISRC و ISWC لكل عمل مسجل',
        'مفتاح مراقبة نشط مع عدادات كشف المطابقة',
        'تسجيل نصوص الكلمات للشعراء وكتاب الأغاني',
      ],
      image: '/showcase/vault.jpg',
      link: '/works',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ink" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ─── Navbar ─── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" showArabic={false} />

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-ash">
            <a href="#capabilities" className="hover:text-ink transition-colors duration-200">
              {isRTL ? 'القدرات' : 'Capabilities'}
            </a>
            <a href="#why" className="hover:text-ink transition-colors duration-200">
              {isRTL ? 'لماذا السميع' : 'Why elsamee3'}
            </a>
            <a href="#how" className="hover:text-ink transition-colors duration-200">
              {isRTL ? 'كيف يعمل' : 'How It Works'}
            </a>
            <Link to="/estimator" className="hover:text-ink transition-colors duration-200">
              {isRTL ? 'تدقيق العائدات' : 'Revenue Audit'}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-full hover:bg-ink/85 transition-colors">
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-[13px] font-medium text-ash hover:text-ink transition-colors">
                  {isRTL ? 'دخول' : 'Sign in'}
                </Link>
                <Link to="/search" className="px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-full hover:bg-ink/85 transition-colors">
                  {isRTL ? 'جرب الأداة' : 'Try Beta'}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-smoke to-transparent" />
      </header>


      {/* ─── Hero with waveform ─── */}
      <section className="relative pt-32 pb-28 sm:pt-44 sm:pb-36 overflow-hidden">
        <HeroWaveform />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-smoke text-xs font-medium text-ash">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {isRTL ? 'النسخة التجريبية المفتوحة — مجاناً' : 'Public Beta — Free Access'}
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[5.25rem] font-bold tracking-display leading-[1.08] opacity-0 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            {isRTL ? (
              <>حماية{' '}<span className="font-serif italic text-accent">الملكية الفكرية</span><br className="hidden sm:block" /><span className="text-ash">للمبدعين حول العالم</span></>
            ) : (
              <>Protect your{' '}<span className="font-serif italic text-accent">creative</span><br className="hidden sm:block" /><span className="text-ash">work, everywhere.</span></>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ash leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {isRTL
              ? 'منصة متكاملة لكشف السرقات اللحنية، توثيق الكلمات بالتشفير، تدقيق العائدات المسروقة، وصياغة إشعارات الإزالة القانونية.'
              : 'Detect melody theft, seal lyrics with cryptographic proof, audit stolen royalties, and generate legal takedown notices — all in one place.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 opacity-0 animate-fade-up" style={{ animationDelay: '0.55s' }}>
            <Link to="/search" className="group w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink/85 transition-all flex items-center justify-center gap-2">
              {isRTL ? 'ابدأ الفحص' : 'Start scanning'}
              <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link to="/estimator" className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-accent/40 hover:text-accent transition-all text-center">
              {isRTL ? 'تدقيق العائدات المسروقة' : 'Audit stolen revenue'}
            </Link>
          </div>
        </div>
      </section>


      {/* ─── Metrics strip ─── */}
      <section className="border-y border-smoke">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 'SHA-256', label: isRTL ? 'إثبات أسبقية مشفر' : 'Cryptographic proof' },
            { value: isRTL ? 'عالمي' : 'Global', label: isRTL ? 'تغطية دولية كاملة' : 'Worldwide coverage' },
            { value: isRTL ? 'مجاني' : 'Free', label: isRTL ? 'في المرحلة التجريبية' : 'During beta' },
            { value: '< 2s', label: isRTL ? 'زمن الفحص والتدقيق' : 'Scan latency' },
          ].map((stat) => (
            <div key={stat.value}>
              <div className="text-2xl sm:text-3xl font-bold tracking-display">{stat.value}</div>
              <div className="text-xs text-ash mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── Capabilities Showcase (comprehensive with screenshots) ─── */}
      <section id="capabilities" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6 space-y-24 sm:space-y-32">

          {/* Section header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'كتالوج القدرات الشامل' : 'Complete Capabilities'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
              {isRTL
                ? 'كل ما يحتاجه المبدع في مكان واحد'
                : 'Everything a creator needs, in one place'}
            </h2>
            <p className="text-base text-ash">
              {isRTL
                ? 'سبع أدوات احترافية متكاملة لحماية الملكية الفكرية وتدقيق العائدات وإنفاذ حقوقك القانونية.'
                : 'Seven professional tools for copyright protection, revenue auditing, and legal enforcement — built for artists worldwide.'}
            </p>
          </div>

          {/* Showcase items — alternating layout */}
          {showcaseItems.map((item) => (
            <ShowcaseItem key={item.num} {...item} isRTL={isRTL} />
          ))}
        </div>
      </section>


      {/* ─── Platforms & Integrations strip ─── */}
      <section className="border-y border-smoke bg-mist/50">
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'المنصات والتكاملات' : 'Platforms & Integrations'}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-display">
              {isRTL ? 'متصل بالمنصات التي يستخدمها الفنانون' : 'Connected to the platforms artists use'}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Distributors */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-ash text-center">
                {isRTL ? 'الموزعون الرقميون' : 'Digital Distributors'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['DistroKid', 'RouteNote', 'TuneCore', 'CD Baby', 'Ditto Music'].map((p) => (
                  <span key={p} className="px-4 py-2 bg-white border border-smoke rounded-full text-xs font-medium text-ink">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Streaming */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-ash text-center">
                {isRTL ? 'منصات البث' : 'Streaming Platforms'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['YouTube', 'Spotify', 'Apple Music', 'SoundCloud', 'TikTok', 'Deezer', 'Anghami', 'Amazon Music'].map((p) => (
                  <span key={p} className="px-4 py-2 bg-white border border-smoke rounded-full text-xs font-medium text-ink">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-ash text-center">
                {isRTL ? 'قواعد البيانات والسجلات' : 'Repertoire Databases'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['MusicBrainz', 'Discogs', 'The MLC', 'SACEM Paris', 'AcoustID', 'Openverse', 'Apple Music API'].map((p) => (
                  <span key={p} className="px-4 py-2 bg-white border border-smoke rounded-full text-xs font-medium text-ink">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Arab Societies */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-ash text-center">
                {isRTL ? 'جمعيات المؤلفين والملحنين العربية' : 'Arab Collecting Societies'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { code: 'SACERAU', country: isRTL ? 'مصر' : 'Egypt' },
                  { code: 'SAIP', country: isRTL ? 'السعودية' : 'Saudi' },
                  { code: 'ONDA', country: isRTL ? 'الجزائر' : 'Algeria' },
                  { code: 'BMDA', country: isRTL ? 'المغرب' : 'Morocco' },
                  { code: 'OTPDA', country: isRTL ? 'تونس' : 'Tunisia' },
                  { code: 'SACEM Liban', country: isRTL ? 'لبنان' : 'Lebanon' },
                ].map((s) => (
                  <span key={s.code} className="px-4 py-2 bg-white border border-accent/20 rounded-full text-xs font-medium text-accent">
                    {s.code} <span className="text-ash font-normal">({s.country})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Better Together — DistroKid / RouteNote / elsamee3 ─── */}
      <section id="ecosystem" className="py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 space-y-20">

          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'النظام البيئي' : 'The Ecosystem'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
              {isRTL ? (
                <>توزيع الموسيقى <span className="font-serif italic text-accent">شيء</span>، وحمايتها <span className="font-serif italic text-accent">شيء آخر</span></>
              ) : (
                <>Distributing music is <span className="font-serif italic text-accent">one thing</span>. Protecting it is <span className="font-serif italic text-accent">another</span>.</>
              )}
            </h2>
            <p className="text-base text-ash max-w-2xl mx-auto">
              {isRTL
                ? 'DistroKid و RouteNote يوصلان موسيقاك للعالم. السميع يحميها بعد أن تصل. ثلاث أدوات تعمل معاً — ليست بدائل لبعضها.'
                : 'DistroKid and RouteNote deliver your music to the world. elsamee3 protects it once it\'s out there. Three tools working together — not replacements.'}
            </p>
          </div>

          {/* Visual pipeline — 3 role cards */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-smoke via-accent/30 to-smoke -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {/* DistroKid */}
              <div className="group relative bg-white border border-smoke rounded-2xl p-8 space-y-5 hover:border-ink/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-ash">{isRTL ? 'الخطوة 1' : 'Step 1'}</span>
                  <span className="w-8 h-8 rounded-full bg-mist flex items-center justify-center text-xs font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">DistroKid</h3>
                <p className="text-xs font-medium tracking-widest uppercase text-ash">
                  {isRTL ? 'التوزيع' : 'Distribution'}
                </p>
                <p className="text-sm text-ash leading-relaxed">
                  {isRTL
                    ? 'يرفع موسيقاك إلى +150 منصة بث: سبوتيفاي، أبل ميوزيك، أنغامي، ديزر، تيك توك. تدفع اشتراكاً سنوياً وتحتفظ بـ 100% من العائدات.'
                    : 'Uploads your music to 150+ streaming platforms: Spotify, Apple Music, Anghami, Deezer, TikTok. Pay a flat annual fee, keep 100% of royalties.'}
                </p>
                <div className="space-y-1.5 pt-2">
                  {(isRTL
                    ? ['رفع غير محدود للأغاني', 'توزيع لـ +150 منصة', 'تقسيم العائدات بين المتعاونين', 'تقارير بصيغة TSV']
                    : ['Unlimited song uploads', 'Distribution to 150+ stores', 'Royalty splits for collaborators', 'Exportable TSV reports']
                  ).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-ash">
                      <span className="w-1 h-1 rounded-full bg-ink/30" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-smoke">
                  <p className="text-[11px] text-ash">
                    {isRTL ? '⚠️ لا يحمي من السرقة أو القرصنة' : '⚠️ Does not protect against theft or piracy'}
                  </p>
                </div>
              </div>

              {/* RouteNote */}
              <div className="group relative bg-white border border-smoke rounded-2xl p-8 space-y-5 hover:border-ink/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-ash">{isRTL ? 'الخطوة 1' : 'Step 1'}</span>
                  <span className="w-8 h-8 rounded-full bg-mist flex items-center justify-center text-xs font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">RouteNote</h3>
                <p className="text-xs font-medium tracking-widest uppercase text-ash">
                  {isRTL ? 'التوزيع' : 'Distribution'}
                </p>
                <p className="text-sm text-ash leading-relaxed">
                  {isRTL
                    ? 'يوزع موسيقاك مجاناً (مقابل 15% من العائدات) أو بنظام مدفوع (تحتفظ بـ 100%). يدعم YouTube Content ID وأدوات تسويق PUSH.fm.'
                    : 'Distributes your music for free (15% commission) or premium (keep 100%). Supports YouTube Content ID and PUSH.fm marketing tools.'}
                </p>
                <div className="space-y-1.5 pt-2">
                  {(isRTL
                    ? ['خطة مجانية — صفر تكلفة مقدمة', 'Content ID ليوتيوب', 'أدوات تسويق PUSH.fm', 'تقارير شهرية على لوحة التحكم']
                    : ['Free tier — zero upfront cost', 'YouTube Content ID', 'PUSH.fm marketing tools', 'Monthly dashboard reports']
                  ).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-ash">
                      <span className="w-1 h-1 rounded-full bg-ink/30" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-smoke">
                  <p className="text-[11px] text-ash">
                    {isRTL ? '⚠️ لا يكشف السرقات خارج يوتيوب' : '⚠️ Does not detect theft beyond YouTube'}
                  </p>
                </div>
              </div>

              {/* elsamee3 */}
              <div className="group relative bg-ink text-white rounded-2xl p-8 space-y-5 ring-1 ring-accent/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-white/50">{isRTL ? 'الخطوة 2' : 'Step 2'}</span>
                  <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">elsamee3</h3>
                <p className="text-xs font-medium tracking-widest uppercase text-accent">
                  {isRTL ? 'الحماية والتدقيق والإنفاذ' : 'Protection, Audit & Enforcement'}
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {isRTL
                    ? 'يبدأ بعد التوزيع: يراقب المنصات لكشف الاستخدام غير المرخص، يدقق العائدات المسروقة، يوثق أسبقية الكلمات، ويصيغ إشعارات إزالة قانونية.'
                    : 'Picks up where distribution ends: monitors platforms for unlicensed use, audits stolen revenue, certifies lyrics authorship, and generates legal takedown notices.'}
                </p>
                <div className="space-y-1.5 pt-2">
                  {(isRTL
                    ? ['بحث موحد + بصمة صوتية', 'تدقيق مباشر للعائدات المسروقة', 'شهادات SHA-256 للكلمات', 'مولّد DMCA + مراقبة 24/7', 'استيراد تقارير DistroKid TSV', 'دليل جمعيات المؤلفين العربية']
                    : ['Unified search + acoustic fingerprinting', 'Live stolen revenue auditing', 'SHA-256 lyrics certificates', 'DMCA generator + 24/7 monitoring', 'DistroKid TSV report import', 'Arab collecting societies directory']
                  ).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] text-accent font-medium">
                    {isRTL ? '✓ مجاني بالكامل في المرحلة التجريبية' : '✓ Completely free during beta'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow narrative */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-smoke bg-mist/50 p-8 sm:p-12 space-y-8">
              <h3 className="text-lg font-bold tracking-tight text-center">
                {isRTL ? 'كيف تعمل الأدوات الثلاث معاً' : 'How the three tools work together'}
              </h3>

              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    label: isRTL ? 'وزّع' : 'Distribute',
                    platform: 'DistroKid / RouteNote',
                    desc: isRTL
                      ? 'ارفع أغنيتك وألبومك عبر DistroKid أو RouteNote. سيصل عملك إلى سبوتيفاي وأبل ميوزيك وأنغامي وعشرات المنصات.'
                      : 'Upload your song or album via DistroKid or RouteNote. Your work reaches Spotify, Apple Music, Anghami, and dozens of platforms.',
                  },
                  {
                    step: '2',
                    label: isRTL ? 'سجّل وراقب' : 'Register & monitor',
                    platform: 'elsamee3',
                    desc: isRTL
                      ? 'سجّل عملك في خزنة السميع مع أكواد ISRC و ISWC. فعّل المراقبة المستمرة لكشف أي استخدام غير مرخص عبر جميع المنصات.'
                      : 'Register your work in elsamee3\'s vault with ISRC/ISWC codes. Activate continuous monitoring to detect unauthorized use across all platforms.',
                  },
                  {
                    step: '3',
                    label: isRTL ? 'دقّق العائدات' : 'Audit revenue',
                    platform: 'elsamee3',
                    desc: isRTL
                      ? 'استورد تقارير DistroKid TSV إلى السميع. قارن العائدات الفعلية بالمشاهدات والاستماعات المكتشفة. اكشف الفجوات والعائدات المسروقة.'
                      : 'Import your DistroKid TSV exports into elsamee3. Compare actual royalties against detected views and streams. Uncover gaps and stolen revenue.',
                  },
                  {
                    step: '4',
                    label: isRTL ? 'أنفذ حقوقك' : 'Enforce your rights',
                    platform: 'elsamee3',
                    desc: isRTL
                      ? 'عند اكتشاف انتهاك: صِغ إشعار DMCA قانوني، احسب التعويضات المستحقة، وأرسل الإشعار مباشرة عبر بوابات المنصات.'
                      : 'When infringement is detected: generate a legal DMCA notice, calculate statutory damages, and submit directly through platform portals.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.platform === 'elsamee3'
                          ? 'bg-accent text-white'
                          : 'bg-ink text-white'
                      }`}>
                        {item.step}
                      </div>
                      {item.step !== '4' && <div className="w-px h-full bg-smoke mt-2" />}
                    </div>
                    <div className="pb-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          item.platform === 'elsamee3'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-ink/5 text-ash'
                        }`}>
                          {item.platform}
                        </span>
                      </div>
                      <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key insight callout */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <blockquote className="text-xl sm:text-2xl font-bold tracking-display leading-snug">
              {isRTL ? (
                <>"DistroKid و RouteNote <span className="text-ash">يوصلان موسيقاك للجمهور.</span> السميع <span className="text-accent">يتأكد أنك تحصل على حقوقك الكاملة.</span>"</>
              ) : (
                <>"DistroKid and RouteNote <span className="text-ash">get your music to listeners.</span> elsamee3 <span className="text-accent">makes sure you get paid for it.</span>"</>
              )}
            </blockquote>
            <p className="text-xs text-ash">
              {isRTL
                ? 'السميع لا يوزع الموسيقى ولا ينافس الموزعين. هو الطبقة التالية بعد التوزيع: الحماية والتدقيق والإنفاذ.'
                : 'elsamee3 doesn\'t distribute music and doesn\'t compete with distributors. It\'s the layer after distribution: protection, auditing, and enforcement.'}
            </p>
          </div>
        </div>
      </section>


      {/* ─── Why elsamee3 — Competitive differentiation ─── */}
      <section id="why" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6 space-y-20">

          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'لماذا السميع' : 'Why elsamee3'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
              {isRTL ? (
                <>أداة واحدة بدلاً من <span className="font-serif italic text-accent">عشر أدوات</span></>
              ) : (
                <>One tool instead of <span className="font-serif italic text-accent">ten</span></>
              )}
            </h2>
            <p className="text-base text-ash max-w-2xl mx-auto">
              {isRTL
                ? 'أدوات حماية حقوق النشر الحالية إما مغلقة أو باهظة الثمن أو تغطي قناة واحدة فقط. السميع يجمع كل ما تحتاجه في مكان واحد — مجاناً.'
                : 'Existing copyright tools are either enterprise-only, locked behind expensive subscriptions, or cover just one channel. elsamee3 combines everything in one place — free.'}
            </p>
          </div>

          {/* Differentiators grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-smoke rounded-2xl overflow-hidden border border-smoke">
            {[
              {
                title: isRTL ? 'عربي أولاً' : 'Arab-first',
                desc: isRTL
                  ? 'المنصة الوحيدة المتكاملة مع جمعيات SACERAU و SAIP و ONDA و BMDA. واجهة عربية كاملة RTL ليست مجرد ترجمة.'
                  : 'The only platform integrated with SACERAU, SAIP, ONDA, BMDA societies. Full Arabic RTL interface — not a translation afterthought.',
                tag: isRTL ? 'حصري' : 'Exclusive',
              },
              {
                title: isRTL ? 'الكل في واحد' : 'All-in-one',
                desc: isRTL
                  ? 'بحث + بصمة صوتية + مراقبة + تدقيق عائدات + DMCA + خزنة رقمية. المنافسون يقدمون أداة واحدة أو اثنتين فقط.'
                  : 'Search + fingerprint + monitoring + revenue audit + DMCA + vault. Competitors offer only 1–2 of these.',
                tag: isRTL ? '7 أدوات' : '7 tools',
              },
              {
                title: isRTL ? 'مجاني تماماً' : 'Free during beta',
                desc: isRTL
                  ? 'YouTube Content ID يتطلب عقد توزيع. Audible Magic و Pex مخصصة للشركات. HAAWK يأخذ 20% من عائداتك. السميع مجاني.'
                  : 'Content ID requires a distribution deal. Audible Magic & Pex are enterprise-only. HAAWK takes 20% of revenue. elsamee3 is free.',
                tag: isRTL ? 'صفر تكلفة' : '\$0',
              },
              {
                title: isRTL ? 'إثبات أسبقية تشفيري' : 'Cryptographic proof',
                desc: isRTL
                  ? 'لا يوجد منافس يقدم شهادات SHA-256 لإثبات أسبقية الكلمات والأشعار. ميزة فريدة للشعراء وكتاب الأغاني.'
                  : 'No competitor offers SHA-256 authorship certificates for lyrics. A unique feature for poets and songwriters.',
                tag: isRTL ? 'فريدة' : 'Unique',
              },
              {
                title: isRTL ? 'استيراد بيانات الموزعين' : 'Distributor imports',
                desc: isRTL
                  ? 'استيراد ملفات DistroKid TSV وبيانات RouteNote لتحويل التدقيق من تقديرات إلى أرقام حقيقية مدققة.'
                  : 'Import DistroKid TSV exports and RouteNote data to turn estimates into audited real numbers.',
                tag: 'DistroKid + RouteNote',
              },
              {
                title: isRTL ? 'إطار قانوني متعدد' : 'Multi-jurisdiction',
                desc: isRTL
                  ? 'DMCA أمريكي + قانون مصري 82/2002 + اتفاقية بيرن + المادة 17 من الاتحاد الأوروبي. ليس قالباً واحداً للجميع.'
                  : 'US DMCA + Egyptian Law 82/2002 + Berne Convention + EU Article 17. Not a one-size-fits-all template.',
                tag: isRTL ? '4 أنظمة' : '4 frameworks',
              },
            ].map((d) => (
              <div key={d.title} className="bg-white p-8 sm:p-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold tracking-tight">{d.title}</h3>
                  <span className="text-[10px] font-mono text-accent bg-accent/5 px-2 py-0.5 rounded-full">{d.tag}</span>
                </div>
                <p className="text-sm text-ash leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-display text-center">
              {isRTL ? 'مقارنة مع المنافسين' : 'Head-to-head comparison'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-smoke rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-mist text-xs font-medium text-ash">
                    <th className="text-start px-4 py-3 font-medium">{isRTL ? 'الميزة' : 'Feature'}</th>
                    <th className="px-4 py-3 font-bold text-accent">elsamee3</th>
                    <th className="px-4 py-3 font-medium">Content ID</th>
                    <th className="px-4 py-3 font-medium">HAAWK</th>
                    <th className="px-4 py-3 font-medium">DistroKid</th>
                    <th className="px-4 py-3 font-medium">RouteNote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-smoke">
                  {[
                    { feature: isRTL ? 'بحث موحد في السجلات' : 'Unified repertoire search',        e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'بصمة صوتية' : 'Acoustic fingerprinting',                   e: true, c: true,  h: true,  d: false, r: false },
                    { feature: isRTL ? 'شهادة SHA-256 للكلمات' : 'SHA-256 lyrics certificate',      e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'تدقيق العائدات المسروقة' : 'Stolen revenue audit',          e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'مولّد DMCA قانوني' : 'Legal DMCA generator',                e: true, c: false, h: true,  d: false, r: false },
                    { feature: isRTL ? 'مراقبة 24/7' : '24/7 monitoring',                           e: true, c: true,  h: true,  d: false, r: false },
                    { feature: isRTL ? 'دعم عربي كامل' : 'Full Arabic support',                     e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'جمعيات المؤلفين العربية' : 'Arab CMO directory',             e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'استيراد بيانات الموزعين' : 'Distributor data import',        e: true, c: false, h: false, d: false, r: false },
                    { feature: isRTL ? 'مجاني' : 'Free tier',                                       e: true, c: false, h: false, d: false, r: true  },
                    { feature: isRTL ? 'توزيع الموسيقى' : 'Music distribution',                     e: false,c: false, h: false, d: true,  r: true  },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-mist/60 transition-colors">
                      <td className="px-4 py-3 text-start font-medium">{row.feature}</td>
                      <td className="px-4 py-3 text-center">{row.e ? <span className="text-accent font-bold">&#10003;</span> : <span className="text-smoke">—</span>}</td>
                      <td className="px-4 py-3 text-center">{row.c ? <span className="text-ink">&#10003;</span> : <span className="text-smoke">—</span>}</td>
                      <td className="px-4 py-3 text-center">{row.h ? <span className="text-ink">&#10003;</span> : <span className="text-smoke">—</span>}</td>
                      <td className="px-4 py-3 text-center">{row.d ? <span className="text-ink">&#10003;</span> : <span className="text-smoke">—</span>}</td>
                      <td className="px-4 py-3 text-center">{row.r ? <span className="text-ink">&#10003;</span> : <span className="text-smoke">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ash text-center max-w-lg mx-auto">
              {isRTL
                ? 'DistroKid و RouteNote خدمات توزيع موسيقي ممتازة — لكنها لا تحمي حقوقك من السرقة. السميع يكملها ولا يحل محلها.'
                : 'DistroKid and RouteNote are excellent distribution services — but they don\'t protect your rights from theft. elsamee3 complements them, it doesn\'t replace them.'}
            </p>
          </div>
        </div>
      </section>


      {/* ─── How it works ─── */}
      <section id="how" className="py-24 bg-mist">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'طريقة الاستخدام' : 'How it works'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-display">
              {isRTL ? 'ثلاث خطوات فقط' : 'Three simple steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: '01',
                title: isRTL ? 'أدخل المصنف' : 'Input your work',
                desc: isRTL
                  ? 'اكتب مقطعاً من الكلمات، ارفع ملفاً صوتياً، أو الصق رابط فيديو مشتبه به.'
                  : 'Paste lyrics, upload an audio track, or provide a suspected video URL.',
              },
              {
                step: '02',
                title: isRTL ? 'التحليل والمطابقة' : 'Analyze & match',
                desc: isRTL
                  ? 'يُولّد المحرك بصمة مشفرة ويبحث فوراً في الكاتالوجات الدولية.'
                  : 'The engine generates a cryptographic fingerprint and searches catalogs in real-time.',
              },
              {
                step: '03',
                title: isRTL ? 'الحماية والتعويض' : 'Protect & claim',
                desc: isRTL
                  ? 'استخرج شهادة إثبات أسبقية، احسب التعويضات، وصِغ إشعار إزالة قانوني.'
                  : 'Get your authorship certificate, calculate damages, and generate takedown notices.',
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center">
                  <span className="text-sm font-mono font-medium text-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── CTA ─── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent/[0.03] rounded-full blur-[80px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
            {isRTL ? (
              <>ابدأ حماية{' '}<span className="font-serif italic text-accent">أعمالك الإبداعية</span></>
            ) : (
              <>Start protecting your{' '}<span className="font-serif italic text-accent">creative work</span></>
            )}
          </h2>
          <p className="text-base text-ash max-w-lg mx-auto">
            {isRTL
              ? 'لا تنتظر حتى يُسرق لحنك أو تُقتبس كلماتك. افحص مصنفاتك الآن مجاناً.'
              : "Don't wait for your melody to be copied. Run your first scan now, free."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/search" className="group w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink/85 transition-all flex items-center justify-center gap-2">
              {isRTL ? 'تشغيل الأداة' : 'Launch tool'}
              <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-accent/40 hover:text-accent transition-all text-center">
              {isRTL ? 'إنشاء حساب' : 'Create account'}
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
}
