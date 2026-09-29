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
      desc: 'Dual-engine monitoring that tracks songwriter publishing splits across collecting societies (The MLC, SACEM, DistroKid) and runs continuous acoustic matching across streaming and social platforms.',
      descAr: 'نظام مراقبة مزدوج يتتبع حصص النشر عبر جمعيات التحصيل ويجري مطابقة صوتية مستمرة عبر منصات البث والتواصل الاجتماعي.',
      features: [
        'Writer & Repertoire Sentinel: track publishing splits at The MLC, SACEM, DistroKid',
        'Platform scanners: YouTube, Spotify, SoundCloud, TikTok acoustic matching',
        'IPI number tracking and co-writer attribution management',
        'One-click demo seed with complete songwriter catalog (38+ works)',
        'Real-time scan status, last scan timestamps, and match counters',
      ],
      featuresAr: [
        'مراقب الكتّاب: تتبع حصص النشر في The MLC و SACEM و DistroKid',
        'ماسحات المنصات: يوتيوب وسبوتيفاي وساوند كلاود وتيك توك',
        'تتبع رقم IPI وإدارة إسناد المؤلفين المشاركين',
        'بذر تجريبي بنقرة واحدة مع كتالوج كامل (38+ عمل)',
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
