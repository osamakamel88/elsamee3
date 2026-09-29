import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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
          <Link to="/" className="flex items-center gap-2 select-none">
            <span className="text-xl font-bold tracking-display text-ink">
              {isRTL ? 'السميع' : 'elsamee3'}
            </span>
          </Link>

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


      {/* ─── Hero ─── */}
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 animate-fade-up">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-smoke text-xs font-medium text-ash">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isRTL ? 'النسخة التجريبية المفتوحة — مجاناً' : 'Public Beta — Free Access'}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-display leading-[1.1]">
            {isRTL ? (
              <>
                حماية <span className="italic font-serif">الملكية الفكرية</span>
                <br className="hidden sm:block" />
                <span className="text-ash"> للمبدعين حول العالم</span>
              </>
            ) : (
              <>
                Protect your <span className="italic font-serif">creative</span>
                <br className="hidden sm:block" />
                <span className="text-ash">work, everywhere.</span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ash leading-relaxed">
            {isRTL
              ? 'منصة متكاملة لكشف السرقات اللحنية، توثيق الكلمات بالتشفير، تدقيق العائدات المسروقة، وصياغة إشعارات الإزالة القانونية.'
              : 'Detect melody theft, seal lyrics with cryptographic proof, audit stolen royalties, and generate legal takedown notices — all in one place.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/search"
              className="group w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink/85 transition-all flex items-center justify-center gap-2"
            >
              {isRTL ? 'ابدأ الفحص' : 'Start scanning'}
              <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              to="/estimator"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-ink/30 transition-all text-center"
            >
              {isRTL ? 'تدقيق العائدات المسروقة' : 'Audit stolen revenue'}
            </Link>
          </div>
        </div>
      </section>


      {/* ─── Metrics strip ─── */}
      <section className="border-y border-smoke">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in">
          {[
            { value: 'SHA-256', label: isRTL ? 'إثبات أسبقية مشفر' : 'Cryptographic proof' },
            { value: isRTL ? 'عالمي' : 'Global', label: isRTL ? 'تغطية دولية كاملة' : 'Worldwide coverage' },
            { value: isRTL ? 'مجاني' : 'Free', label: isRTL ? 'في المرحلة التجريبية' : 'During beta' },
            { value: '< 2s', label: isRTL ? 'زمن الفحص والتدقيق' : 'Scan latency' },
          ].map((stat) => (
            <div key={stat.value}>
              <div className="text-2xl sm:text-3xl font-bold tracking-display">{stat.value}</div>
              <div className="text-xs text-ash mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── Capabilities ─── */}
      <section id="capabilities" className="py-24">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-ash">
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
                title: isRTL ? 'البصمة الصوتية' : 'Acoustic fingerprinting',
                desc: isRTL
                  ? 'تحليل الطيف الترددي للألحان لاكتشاف الاقتباس والسرقات اللحنية بدقة عالية.'
                  : 'Deep wave analysis to identify melody copying and unlicensed re-recordings with forensic confidence.',
                link: '/search',
              },
              {
                title: isRTL ? 'توثيق الكلمات' : 'Lyrics certification',
                desc: isRTL
                  ? 'بصمة نصية مشفرة SHA-256 لإثبات تاريخ كتابة النص الغنائي ومنع سرقة الكلمات.'
                  : 'SHA-256 cryptographic hashing to generate irrefutable proof-of-authorship certificates for lyricists.',
                link: '/search',
              },
              {
                title: isRTL ? 'تدقيق العائدات المسروقة' : 'Stolen revenue audit',
                desc: isRTL
                  ? 'تدقيق مباشر لروابط الفيديوهات واحتساب العائدات المسلوبة والتعويضات المستحقة.'
                  : 'Direct URL auditing to calculate stolen ad revenue, streaming royalties, and statutory damages.',
                link: '/estimator',
              },
              {
                title: isRTL ? 'المراقبة وإشعارات الإزالة' : 'Monitoring & takedowns',
                desc: isRTL
                  ? 'رصد مستمر لمنصات البث وصياغة إخطارات إزالة DMCA بنقرة واحدة.'
                  : 'Continuous multi-platform monitoring with one-click DMCA notice generation.',
                link: '/monitoring',
              },
              {
                title: isRTL ? 'كتالوج الهيئات الدولية' : 'Global repertoire queries',
                desc: isRTL
                  ? 'فحص شامل عبر جمعيات المؤلفين والملحنين وسجلات ISWC الدولية.'
                  : 'Unified queries across collecting societies (SACERAU, SAIP, ONDA, BMDA) and ISWC registers.',
                link: '/search',
              },
              {
                title: isRTL ? 'خزنة المصنفات الرقمية' : 'Creative vault',
                desc: isRTL
                  ? 'أرشيف مشفر لتسجيل وحفظ أعمالك الموسيقية والبصرية مع رموز ISRC و ISWC.'
                  : 'Encrypted vault to register, store, and manage all your works with instant forensic traceability.',
                link: '/works',
              },
            ].map((cap, i) => (
              <Link
                key={i}
                to={cap.link}
                className="group bg-white p-8 sm:p-10 flex flex-col justify-between hover:bg-mist transition-colors duration-300"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold tracking-tight group-hover:text-ink/70 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-ash leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-1 text-xs font-medium text-ash group-hover:text-ink transition-colors">
                  <span>{isRTL ? 'استكشاف' : 'Explore'}</span>
                  <Arrow size={12} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─── How it works ─── */}
      <section id="how" className="py-24 bg-mist">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-medium tracking-widest uppercase text-ash">
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
                <span className="text-sm font-mono text-ash">{item.step}</span>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display leading-tight">
            {isRTL
              ? 'ابدأ حماية أعمالك الإبداعية'
              : 'Start protecting your creative work'}
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
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-full border border-smoke text-ink hover:border-ink/30 transition-all text-center"
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
