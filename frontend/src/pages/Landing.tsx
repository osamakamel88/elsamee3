import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft } from 'lucide-react';

/* ──────────────────────────────────────────────
   Animated Waveform — the hero visual effect
   Multiple sinusoidal SVG paths that breathe
   and undulate at different speeds, creating
   a living sound-wave visualization.
   ────────────────────────────────────────────── */
function HeroWaveform() {
  // Generate a sine-wave SVG path
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
      {/* Subtle radial glow behind the waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/[0.04] rounded-full blur-[100px] animate-glow-pulse" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 280"
        preserveAspectRatio="none"
        fill="none"
      >
        {waves.map((w, i) => (
          <path
            key={i}
            d={makePath(w.amp, w.freq, w.y, w.phase)}
            stroke={w.stroke}
            strokeWidth="1.5"
            opacity={w.opacity}
            fill="none"
            className={w.anim}
            style={{ transformOrigin: 'center' }}
          />
        ))}
      </svg>
    </div>
  );
}


export default function Landing() {
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

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
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-full hover:bg-ink/85 transition-colors"
              >
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-[13px] font-medium text-ash hover:text-ink transition-colors"
                >
                  {isRTL ? 'دخول' : 'Sign in'}
                </Link>
                <Link
                  to="/search"
                  className="px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-full hover:bg-ink/85 transition-colors"
                >
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
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-smoke text-xs font-medium text-ash">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {isRTL ? 'النسخة التجريبية المفتوحة — مجاناً' : 'Public Beta — Free Access'}
            </div>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-[5.25rem] font-bold tracking-display leading-[1.08] opacity-0 animate-fade-up"
            style={{ animationDelay: '0.25s' }}
          >
            {isRTL ? (
              <>
                حماية{' '}
                <span className="font-serif italic text-accent">الملكية الفكرية</span>
                <br className="hidden sm:block" />
                <span className="text-ash">للمبدعين حول العالم</span>
              </>
            ) : (
              <>
                Protect your{' '}
                <span className="font-serif italic text-accent">creative</span>
                <br className="hidden sm:block" />
                <span className="text-ash">work, everywhere.</span>
              </>
            )}
          </h1>

          <p
            className="max-w-2xl mx-auto text-base sm:text-lg text-ash leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {isRTL
              ? 'منصة متكاملة لكشف السرقات اللحنية، توثيق الكلمات بالتشفير، تدقيق العائدات المسروقة، وصياغة إشعارات الإزالة القانونية.'
              : 'Detect melody theft, seal lyrics with cryptographic proof, audit stolen royalties, and generate legal takedown notices — all in one place.'}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.55s' }}
          >
            <Link
              to="/search"
              className="group w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink/85 transition-all flex items-center justify-center gap-2"
            >
              {isRTL ? 'ابدأ الفحص' : 'Start scanning'}
              <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              to="/estimator"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-accent/40 hover:text-accent transition-all text-center"
            >
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


      {/* ─── Capabilities ─── */}
      <section id="capabilities" className="py-28">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-accent">
              {isRTL ? 'قدرات المنصة' : 'Capabilities'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-display">
              {isRTL
                ? 'أدوات احترافية للمبدعين'
                : 'Professional tools for creators'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-smoke rounded-2xl overflow-hidden border border-smoke">
            {[
              {
                num: '01',
                title: isRTL ? 'البصمة الصوتية' : 'Acoustic fingerprinting',
                desc: isRTL
                  ? 'تحليل الطيف الترددي للألحان لاكتشاف الاقتباس والسرقات اللحنية بدقة عالية.'
                  : 'Deep wave analysis to identify melody copying and unlicensed re-recordings with forensic confidence.',
                link: '/search',
              },
              {
                num: '02',
                title: isRTL ? 'توثيق الكلمات' : 'Lyrics certification',
                desc: isRTL
                  ? 'بصمة نصية مشفرة SHA-256 لإثبات تاريخ كتابة النص الغنائي ومنع سرقة الكلمات.'
                  : 'SHA-256 cryptographic hashing to generate irrefutable proof-of-authorship certificates for lyricists.',
                link: '/search',
              },
              {
                num: '03',
                title: isRTL ? 'تدقيق العائدات المسروقة' : 'Stolen revenue audit',
                desc: isRTL
                  ? 'تدقيق مباشر لروابط الفيديوهات واحتساب العائدات المسلوبة والتعويضات المستحقة.'
                  : 'Direct URL auditing to calculate stolen ad revenue, streaming royalties, and statutory damages.',
                link: '/estimator',
              },
              {
                num: '04',
                title: isRTL ? 'المراقبة وإشعارات الإزالة' : 'Monitoring & takedowns',
                desc: isRTL
                  ? 'رصد مستمر لمنصات البث وصياغة إخطارات إزالة DMCA بنقرة واحدة.'
                  : 'Continuous multi-platform monitoring with one-click DMCA notice generation.',
                link: '/monitoring',
              },
              {
                num: '05',
                title: isRTL ? 'كتالوج الهيئات الدولية' : 'Global repertoire queries',
                desc: isRTL
                  ? 'فحص شامل عبر جمعيات المؤلفين والملحنين وسجلات ISWC الدولية.'
                  : 'Unified queries across collecting societies and ISWC registers.',
                link: '/search',
              },
              {
                num: '06',
                title: isRTL ? 'خزنة المصنفات الرقمية' : 'Creative vault',
                desc: isRTL
                  ? 'أرشيف مشفر لتسجيل وحفظ أعمالك الموسيقية والبصرية مع رموز ISRC و ISWC.'
                  : 'Encrypted vault to register and manage all your works with forensic traceability.',
                link: '/works',
              },
            ].map((cap) => (
              <Link
                key={cap.num}
                to={cap.link}
                className="group bg-white p-8 sm:p-10 flex flex-col justify-between hover:bg-mist transition-colors duration-300"
              >
                <div className="space-y-4">
                  <span className="text-xs font-mono text-accent">{cap.num}</span>
                  <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent transition-colors duration-200">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-ash leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-1 text-xs font-medium text-ash group-hover:text-accent transition-colors duration-200">
                  <span>{isRTL ? 'استكشاف' : 'Explore'}</span>
                  <Arrow size={12} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─── How it works ─── */}
      <section id="how" className="py-28 bg-mist">
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
        {/* Subtle accent glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent/[0.03] rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
            {isRTL ? (
              <>
                ابدأ حماية{' '}
                <span className="font-serif italic text-accent">أعمالك الإبداعية</span>
              </>
            ) : (
              <>
                Start protecting your{' '}
                <span className="font-serif italic text-accent">creative work</span>
              </>
            )}
          </h2>
          <p className="text-base text-ash max-w-lg mx-auto">
            {isRTL
              ? 'لا تنتظر حتى يُسرق لحنك أو تُقتبس كلماتك. افحص مصنفاتك الآن مجاناً.'
              : "Don't wait for your melody to be copied. Run your first scan now, free."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/search"
              className="group w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink/85 transition-all flex items-center justify-center gap-2"
            >
              {isRTL ? 'تشغيل الأداة' : 'Launch tool'}
              <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-accent/40 hover:text-accent transition-all text-center"
            >
              {isRTL ? 'إنشاء حساب' : 'Create account'}
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
}
