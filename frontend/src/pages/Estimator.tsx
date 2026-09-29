import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import {
  Calculator,
  Coins,
  TrendingUp,
  ShieldAlert,
  Copy,
  Info,
  Youtube,
  Music,
  Video,
  Tv,
  Sparkles,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  Share2,
  Award,
  Search,
  Loader2,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Estimator() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Live Auto-Audit State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditedVideos, setAuditedVideos] = useState<any[]>([]);
  const [totalAuditedViews, setTotalAuditedViews] = useState<number>(0);

  // Manual & Audited Inputs
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [role, setRole] = useState<string>('lyricist');
  const [currency, setCurrency] = useState<string>('EGP');
  const [territory, setTerritory] = useState<string>('mena');
  const [infringementType, setInfringementType] = useState<string>('unauthorized_commercial');

  const [youtubeViews, setYoutubeViews] = useState<number>(5000000);
  const [dspStreams, setDspStreams] = useState<number>(1500000);
  const [ugcCreations, setUgcCreations] = useState<number>(35000);
  const [syncCommercialUses, setSyncCommercialUses] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // Industry Standard Presets (100% generic)
  const presets = [
    {
      id: 'mega_hit',
      titleAr: 'أغنية جماهيرية كبرى (Mega Hit)',
      titleEn: 'Mega Commercial Hit',
      descAr: '25 مليون مشاهدة يوتيوب، 8 مليون استماع منصات، 150 ألف فيديو تيك توك',
      descEn: '25M YT views, 8M DSP streams, 150K TikTok creations',
      yt: 25000000,
      dsp: 8000000,
      ugc: 150000,
      sync: 2
    },
    {
      id: 'tiktok_viral',
      titleAr: 'تريند فيروسي (Viral Social Sound)',
      titleEn: 'Viral Social Sound',
      descAr: '3 مليون مشاهدة يوتيوب، 1.2 مليون استماع، 350 ألف فيديو تيك توك وريلز',
      descEn: '3M YT views, 1.2M streams, 350K UGC creations',
      yt: 3000000,
      dsp: 1200000,
      ugc: 350000,
      sync: 0
    },
    {
      id: 'commercial_sync',
      titleAr: 'حملة إعلانية تجارية (Commercial Ad Sync)',
      titleEn: 'Commercial Ad Campaign',
      descAr: '10 مليون مشاهدة، 2 مليون استماع، ترخيصان إعلانيان تلفزيونيان',
      descEn: '10M views, 2M streams, 2 commercial TV/brand syncs',
      yt: 10000000,
      dsp: 2000000,
      ugc: 20000,
      sync: 2
    },
    {
      id: 'regional_standard',
      titleAr: 'إصدار رقمي قياسي (Standard Digital Release)',
      titleEn: 'Standard Digital Release',
      descAr: '1.5 مليون مشاهدة، 450 ألف استماع، 8 آلاف فيديو',
      descEn: '1.5M views, 450K streams, 8K UGC videos',
      yt: 1500000,
      dsp: 450000,
      ugc: 8000,
      sync: 0
    }
  ];

  const applyPreset = (preset: any) => {
    setYoutubeViews(preset.yt);
    setDspStreams(preset.dsp);
    setUgcCreations(preset.ugc);
    setSyncCommercialUses(preset.sync);
    toast.success(isRTL ? `تم تطبيق نموذج: ${preset.titleAr}` : `Applied: ${preset.titleEn}`);
  };

  // Perform Live Auto-Audit by Song / Artist / URL
  const handleAuditSearch = async () => {
    if (!searchQuery.trim()) {
      toast(isRTL ? 'يرجى كتابة اسم الأغنية أو الفنان أولاً' : 'Please enter a song or artist name', { icon: '🔍' });
      return;
    }

    setIsAuditing(true);
    toast(isRTL ? 'جاري فحص استهلاك ومشاهدات العمل على YouTube والمنصات...' : 'Auditing real live views and DSP footprint...', { icon: '📡' });

    try {
      const payload = {
        query: searchQuery.trim(),
        role: role,
        currency: currency,
        territory: territory,
        infringement_type: infringementType
      };

      const res = await api.post('/valuation', payload);
      const data = res.data;

      if (data.total_real_views) {
        setTotalAuditedViews(data.total_real_views);
        setAuditedVideos(data.top_videos || []);
        setTitle(data.detected_title || searchQuery);
        setArtist(data.detected_artist || (isRTL ? 'فنان غير محدد' : 'Artist'));
        setYoutubeViews(data.total_real_views);
        setDspStreams(data.estimated_dsp_streams || Math.round(data.total_real_views * 0.3));
        setUgcCreations(data.estimated_ugc_creations || 10000);
        if (data.valuation) {
          setResult(data.valuation);
        }
        toast.success(
          isRTL
            ? `تم التدقيق الحي! رصد ${data.total_real_views_formatted} مشاهدة فعلية على يوتيوب`
            : `Audit complete! Detected ${data.total_real_views_formatted} real live views.`
        );
      } else {
        calculateEstimate();
      }
    } catch (err: any) {
      console.warn('Live audit error, falling back to calculation', err);
      toast.error(isRTL ? 'تعذر جلب البيانات الحية، يمكنك استخدام المؤشرات اليدوية' : 'Audit request timed out, using manual sliders');
      calculateEstimate();
    } finally {
      setIsAuditing(false);
    }
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateEstimate();
    }, 150);
    return () => clearTimeout(timer);
  }, [
    title,
    artist,
    role,
    currency,
    territory,
    infringementType,
    youtubeViews,
    dspStreams,
    ugcCreations,
    syncCommercialUses
  ]);

  const calculateEstimate = async () => {
    setLoading(true);
    try {
      const payload = {
        work_title: title || (isRTL ? 'مصنف مسجل' : 'Registered Artwork'),
        artist: artist || (isRTL ? 'صاحب الحق' : 'Rightsholder'),
        role: role,
        currency: currency,
        territory: territory,
        infringement_type: infringementType,
        youtube_views: Number(youtubeViews) || 0,
        total_dsp_streams: Number(dspStreams) || 0,
        ugc_video_creations: Number(ugcCreations) || 0,
        sync_commercial_uses: Number(syncCommercialUses) || 0,
      };

      const res = await api.post('/valuation', payload);
      setResult(res.data);
    } catch (err: any) {
      const fx = currency === 'EGP' ? 48.5 : currency === 'SAR' ? 3.75 : 1.0;
      const ytGross = (youtubeViews / 1000) * (territory === 'mena' ? 2.2 * 0.45 : 6.5 * 0.60);
      const dspGross = dspStreams * (territory === 'mena' ? 0.0032 : 0.0048);
      const ugcGross = ugcCreations > 50000 ? 5000 : ugcCreations > 5000 ? 1250 : 150;
      const syncGross = syncCommercialUses * (territory === 'mena' ? 3500 : 12500);

      const roleShare = role === 'lyricist' || role === 'composer' ? 0.15 : role === 'songwriter_both' ? 0.30 : 0.35;
      const claimantTotal = (ytGross + dspGross) * roleShare + ugcGross * 0.2 + syncGross * 0.25;

      setResult({
        currency,
        claimant_total_earnings_converted: Math.round(claimantTotal * fx),
        total_gross_converted: Math.round((ytGross + dspGross + ugcGross + syncGross) * fx),
        recommended_settlement_claim_converted: Math.round((claimantTotal * 2.8 + 2500) * fx),
        max_litigation_demand_converted: Math.round((claimantTotal * 2.8 + 2500) * 2.1 * fx),
        ugc_virality_tier: ugcCreations > 50000 ? 'Viral Sensation' : 'Active Buzz',
        ugc_virality_label_ar: ugcCreations > 50000 ? 'انتشار فيروسي واسع' : 'رواج متوسط',
        channel_breakdown_converted: {
          youtube: Math.round(ytGross * roleShare * fx),
          dsp_streaming: Math.round(dspGross * roleShare * fx),
          ugc_social: Math.round(ugcGross * 0.2 * fx),
          sync_commercial: Math.round(syncGross * 0.25 * fx),
        },
        legal_basis_summary_ar: 'المطالبة مؤسسة طبقاً للمواد (138، 139، 181) من قانون حماية الملكية الفكرية رقم 82 لسنة 2002.',
        legal_basis_summary_en: 'Statutory claim grounded in Egyptian Law 82/2002 and Berne Convention Article 9.'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyClaimNotice = () => {
    if (!result) return;
    const currSymbol = currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : '$';
    const displayTitle = title || (isRTL ? 'مصنف موسيقي / غنائي' : 'Musical Work');
    const displayArtist = artist || (isRTL ? 'صاحب الحق المعتمد' : 'Verified Creator');
    
    const text = isRTL
      ? `📋 إشعار مطالبة مالية وتعويض قانوني عن استغلال مصنف:\n` +
        `• المصنف: "${displayTitle}"\n` +
        `• صاحب الحق/الصفة: ${displayArtist} (${role === 'lyricist' ? 'الشاعر ومؤلف الكلمات' : role === 'composer' ? 'الملحن ومبدع اللحن' : role})\n` +
        `• حجم الاستغلال المرصود: ${youtubeViews.toLocaleString()} مشاهدة يوتيوب | ${dspStreams.toLocaleString()} استماع منصات | ${ugcCreations.toLocaleString()} مقطع تيك توك/ريلز\n` +
        `• العائدات المستحقة الصافية لصاحب الحق: ${result.claimant_total_earnings_converted.toLocaleString()} ${currSymbol}\n` +
        `• مبلغ التسوية الودية المقترح (مع التعويض القانوني): ${result.recommended_settlement_claim_converted.toLocaleString()} ${currSymbol}\n` +
        `• الأساس القانوني: المواد (138، 139، 181) من قانون حماية الملكية الفكرية رقم 82 لسنة 2002 واتفاقية برن الدولية.\n` +
        `— صادر وموثق عبر منصة السميع (elsamee3.vercel.app)`
      : `📋 Formal Royalty & Legal Damages Settlement Notice:\n` +
        `• Work: "${displayTitle}"\n` +
        `• Claimant: ${displayArtist} (${role})\n` +
        `• Tracked Usage: ${youtubeViews.toLocaleString()} YT Views | ${dspStreams.toLocaleString()} DSP Streams | ${ugcCreations.toLocaleString()} UGC Creations\n` +
        `• Net Accrued Royalties: ${result.claimant_total_earnings_converted.toLocaleString()} ${currency}\n` +
        `• Recommended Settlement Claim: ${result.recommended_settlement_claim_converted.toLocaleString()} ${currency}\n` +
        `• Statutory Basis: Berne Convention Art. 9, 17 U.S.C. § 504 & Egypt Law 82/2002.\n` +
        `— Verified via elsamee3 Rights Guardian (elsamee3.vercel.app)`;

    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم نسخ نص المطالبة الرسمية للتعويض!' : 'Formal settlement claim copied!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 p-8 opacity-10 pointer-events-none">
          <Calculator size={160} />
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
            <Sparkles size={14} />
            <span>{isRTL ? 'محرك التدقيق المالي والقضائي للمصنفات' : 'Live Royalty & Damages Audit Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isRTL ? 'حاسبة وتدقيق العائدات والتعويضات' : 'Royalty & Damages Valuation & Audit'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            {isRTL
              ? 'أداة احترافية لحساب وتدقيق أرباح أي أغنية أو مصنف عبر مشاهدات يوتيوب الفعلية ومنصات البث الرقمي (Spotify, Apple, Anghami) وتيك توك، وتقدير مبالغ التعويض القضائي العادل للشاعر والملحن والمؤدي طبقاً لقوانين الملكية الفكرية.'
              : 'Professional tool to audit and calculate multi-channel royalties across YouTube, DSPs, TikTok UGC, and estimate statutory legal claims under copyright law.'}
          </p>
        </div>
      </div>

      {/* FEATURE 1: Live Profit Auto-Audit by Song / Artist / URL */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-xl border border-indigo-800/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Search size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>{isRTL ? 'الفحص والتدقيق الآلي لأرباح أي أغنية (Live Profit Auto-Audit)' : 'Live Song Profit Auto-Audit'}</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {isRTL ? 'رصد حي ومباشر' : 'Live Scraping'}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isRTL
                  ? 'ابحث باسم الأغنية أو الفنان أو الصق رابط فيديو يوتيوب لجلب المشاهدات الفعلية وحساب الأرباح المحققة فوراً:'
                  : 'Search any track or artist name to scrape real YouTube views, DSP metadata, and calculate actual profits:'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuditSearch()}
            placeholder={isRTL ? 'اكتب اسم الأغنية أو الفنان (مثال: تملي معاك، نور العين، بحبك...) أو الصق رابطاً...' : 'Enter track or artist name (e.g. Tamally Maak, Shape of You) or paste URL...'}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
          />
          <button
            onClick={handleAuditSearch}
            disabled={isAuditing}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 flex-shrink-0"
          >
            {isAuditing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span>{isAuditing ? (isRTL ? 'جاري الفحص المباشر...' : 'Auditing Live...') : (isRTL ? 'فحص وتدقيق الأرباح الحقيقية' : 'Audit Real Profits')}</span>
          </button>
        </div>

        {/* Real Live Videos Found */}
        {auditedVideos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {isRTL
                  ? `تم رصد ${totalAuditedViews.toLocaleString()} مشاهدة فعلية عبر مقاطع يوتيوب التالية:`
                  : `Detected ${totalAuditedViews.toLocaleString()} real views across live uploads:`}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {auditedVideos.map((v, idx) => (
                <a
                  key={idx}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors group"
                >
                  <div className="truncate flex-1 me-2">
                    <span className="block font-semibold text-slate-200 truncate group-hover:text-emerald-300 transition-colors">
                      {v.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{v.channel}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-300 flex-shrink-0">
                    {v.views_formatted}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preset Benchmarks (Generic Reference) */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          {isRTL ? 'نماذج قياسية للمقارنة السريعة:' : 'Quick Industry Benchmark Presets:'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="p-3.5 bg-white border border-slate-200 rounded-2xl text-start hover:border-brand-blue hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-blue">
                {isRTL ? p.titleAr : p.titleEn}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {isRTL ? p.descAr : p.descEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Work Metadata */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck size={18} className="text-brand-blue" />
              <span>{isRTL ? 'بيانات المصنف وصفة صاحب الحق:' : 'Work & Rights Details:'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'اسم الأغنية / المصنف' : 'Track Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  placeholder={isRTL ? 'مثال: اسم الأغنية' : 'e.g. Song Title'}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'اسم المبدع / الشاعر / الملحن' : 'Creator / Artist'}
                </label>
                <input
                  type="text"
                  value={artist}
                  placeholder={isRTL ? 'مثال: اسم الشاعر أو الملحن أو الفنان' : 'e.g. Creator / Artist name'}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Currency & Territory */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'عملة التقدير' : 'Currency'}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white outline-none"
                >
                  <option value="EGP">ج.م مصري (EGP)</option>
                  <option value="SAR">ر.س سعودي (SAR)</option>
                  <option value="USD">$ دولار أمريكي (USD)</option>
                  <option value="AED">د.إ إماراتي (AED)</option>
                  <option value="EUR">€ يورو (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'النطاق الجغرافي للاستماع' : 'Territory'}
                </label>
                <select
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white outline-none"
                >
                  <option value="mena">{isRTL ? 'الوطن العربي (MENA)' : 'Arab MENA'}</option>
                  <option value="global">{isRTL ? 'عالمي / دولي (Global)' : 'Global'}</option>
                </select>
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isRTL ? 'حدد صفتك القانونية (لتحديد نسبة أرباحك الصافية):' : 'Select Creator Legal Role:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'lyricist', label: isRTL ? 'الشاعر / المؤلف ✍️' : 'Lyricist (15%)', sub: isRTL ? 'حصة الكلمات والنشر' : 'Lyrics share' },
                  { id: 'composer', label: isRTL ? 'الملحن 🎼' : 'Composer (15%)', sub: isRTL ? 'حصة اللحن والنشر' : 'Melody share' },
                  { id: 'songwriter_both', label: isRTL ? 'شاعر وملحن معاً 🎵' : 'Both (30%)', sub: isRTL ? 'كامل حصة التأليف' : 'Full Publishing' },
                  { id: 'performer', label: isRTL ? 'المطرب / المؤدي 🎤' : 'Performer (35%)', sub: isRTL ? 'حصة أداء الماستر' : 'Master share' },
                  { id: 'producer_label', label: isRTL ? 'المنتج / الشركة 🏢' : 'Producer (35%)', sub: isRTL ? 'حصة إنتاج الماستر' : 'Master share' },
                  { id: 'full_rights', label: isRTL ? 'كامل الحقوق 👑' : 'Full Rights (100%)', sub: isRTL ? 'كامل قنوات العمل' : 'All channels' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2.5 rounded-xl border text-start transition-all text-xs flex flex-col gap-0.5 ${
                      role === r.id
                        ? 'bg-blue-50 border-brand-blue text-brand-blue font-bold shadow-xs ring-1 ring-brand-blue'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold">{r.label}</span>
                    <span className="text-[10px] text-slate-600 font-normal">{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Metrics Sliders */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins size={18} className="text-amber-500" />
                <span>{isRTL ? 'مؤشرات الانتشار والاستهلاك المرصود:' : 'Consumption & Usage Metrics:'}</span>
              </span>
            </h2>

            {/* YouTube */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Youtube size={16} className="text-red-600" />
                  <span>{isRTL ? 'مشاهدات يوتيوب (YouTube AdSense & Content ID)' : 'YouTube Views'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border">
                  {youtubeViews.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100000000}
                step={250000}
                value={youtubeViews}
                onChange={(e) => setYoutubeViews(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* DSP Streaming */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Music size={16} className="text-emerald-600" />
                  <span>{isRTL ? 'استماعات المنصات الرقمية (Spotify, Apple, Anghami, Deezer)' : 'DSP Audio Streams'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border">
                  {dspStreams.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30000000}
                step={100000}
                value={dspStreams}
                onChange={(e) => setDspStreams(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* TikTok & UGC */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video size={16} className="text-purple-600" />
                  <span>{isRTL ? 'فيديوهات تيك توك وريلز المنشأة بالصوت (UGC Creations)' : 'TikTok & Reels Videos'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-purple-700 bg-white px-2 py-0.5 rounded border">
                  {ugcCreations.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={5000}
                value={ugcCreations}
                onChange={(e) => setUgcCreations(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <p className="text-[11px] text-purple-700 font-semibold mt-1">
                {result?.ugc_virality_label_ar}
              </p>
            </div>

            {/* Sync Commercials */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tv size={16} className="text-amber-600" />
                  <span>{isRTL ? 'استخدام إعلاني / مسلسل تلفزيوني (Commercial Sync)' : 'Commercial Sync Uses'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded border">
                  {syncCommercialUses} {isRTL ? 'استخدام' : 'uses'}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSyncCommercialUses(cnt)}
                    className={`flex-1 py-1.5 text-xs rounded-xl border font-bold ${
                      syncCommercialUses === cnt
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cnt === 0 ? (isRTL ? 'بدون' : '0') : cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Infringement Multiplier */}
          <div className="bg-rose-50/70 p-5 rounded-3xl border border-rose-200 space-y-3">
            <h2 className="text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600" />
              <span>{isRTL ? 'طبيعة الانتهاك لتحديد التعويض القانوني:' : 'Infringement Nature for Damages:'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'unauthorized_commercial', label: isRTL ? 'استغلال في إعلان تجاري بدون ترخيص' : 'Commercial Ad Sync (2.8x)', mult: '2.8x' },
                { id: 'derivative_sample', label: isRTL ? 'سرقة واقتباس لحن أو كلمات' : 'Stolen Melody / Sample (2.2x)', mult: '2.2x' },
                { id: 'willful_theft', label: isRTL ? 'انتحال متعمد ونسب العمل لغير مبدعه' : 'Willful Commercial Theft (3.8x)', mult: '3.8x' },
                { id: 'uncredited_stream', label: isRTL ? 'قرصنة ورفع بدون تصريح أو نسبة' : 'Uncredited Piracy (1.3x)', mult: '1.3x' },
              ].map((inf) => (
                <button
                  key={inf.id}
                  type="button"
                  onClick={() => setInfringementType(inf.id)}
                  className={`p-3 rounded-xl border text-xs text-start transition-all ${
                    infringementType === inf.id
                      ? 'bg-white border-rose-500 text-rose-950 font-bold shadow-xs ring-1 ring-rose-500'
                      : 'bg-white/60 border-rose-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{inf.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold">
                      {inf.mult}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Results Dashboard */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Net Entitlement Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 end-0 p-4 opacity-10 pointer-events-none">
              <Coins size={140} />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Award size={18} className="text-blue-300" />
              <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                {isRTL ? 'صافي العائدات المستحقة لصفتك' : 'Your Net Entitled Royalties'}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              {result ? result.claimant_total_earnings_converted.toLocaleString() : '...'}
              <span className="text-base font-normal text-blue-200 ms-2">
                {currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : currency}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-500/30 text-xs text-blue-100 flex items-center justify-between">
              <span>{isRTL ? 'إجمالي عائدات الصناعة المقدرة:' : 'Total Gross Industry Revenue:'}</span>
              <span className="font-bold text-white font-mono">
                {result ? result.total_gross_converted.toLocaleString() : '0'} {currency}
              </span>
            </div>
          </div>

          {/* Statutory Settlement Demand Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-rose-700 to-red-800 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 end-0 p-4 opacity-10 pointer-events-none">
              <ShieldAlert size={140} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={18} className="text-amber-200" />
              <span className="text-xs uppercase tracking-wider text-amber-200 font-bold">
                {isRTL ? 'مبلغ التعويض والتسوية الودية المقترح' : 'Recommended Legal Settlement Claim'}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-amber-100">
              {result ? result.recommended_settlement_claim_converted.toLocaleString() : '...'}
              <span className="text-base font-normal text-amber-200 ms-2">
                {currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : currency}
              </span>
            </div>

            <p className="text-xs text-amber-100 mt-2 leading-relaxed">
              {isRTL
                ? `يشمل أرباح الاستغلال ومعامل التعويض عن الأضرار المادية والأدبية (${result?.willful_penalty_multiplier}x).`
                : `Includes disgorgement of infringer profits and statutory damages multiplier.`}
            </p>

            <div className="mt-4 pt-3 border-t border-rose-500/30 text-xs text-rose-100 flex items-center justify-between">
              <span>{isRTL ? 'الحد الأقصى للمطالبة القضائية:' : 'Max Litigation Ceiling:'}</span>
              <span className="font-bold text-white font-mono">
                {result ? result.max_litigation_demand_converted.toLocaleString() : '0'} {currency}
              </span>
            </div>
          </div>

          {/* Detailed Platform Breakdown */}
          {result && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isRTL ? 'تفصيل الحصة الصافية حسب القناة:' : 'Net Share by Channel:'}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Youtube size={16} className="text-red-600" />
                    <span className="text-xs font-medium text-slate-700">YouTube AdSense & Content ID</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-600">
                    {result.channel_breakdown_converted.youtube.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">DSP Streaming (Spotify/Apple/Anghami)</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {result.channel_breakdown_converted.dsp_streaming.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-purple-600" />
                    <span className="text-xs font-medium text-slate-700">TikTok & Reels UGC Virality</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-600">
                    {result.channel_breakdown_converted.ugc_social.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tv size={16} className="text-amber-600" />
                    <span className="text-xs font-medium text-slate-700">Commercial Sync & Broadcast Licensing</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-600">
                    {result.channel_breakdown_converted.sync_commercial.toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={copyClaimNotice}
              className="w-full py-3 px-4 bg-brand-blue text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors"
            >
              <Copy size={16} />
              <span>{isRTL ? 'نسخ إشعار المطالبة والتعويض الرسمي' : 'Copy Formal Claim Notice'}</span>
            </button>
          </div>

          {/* Legal Reference Box */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-3xl text-xs text-blue-900 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-brand-blue">
              <Info size={15} />
              <span>{isRTL ? 'المرجعية القانونية ومعايير الحساب:' : 'Statutory Framework:'}</span>
            </div>
            <p>
              {isRTL
                ? 'طبقاً للمواد 138 و139 و181 من قانون حماية الملكية الفكرية المصري رقم 82 لسنة 2002، والمادتين 9 و11 من اتفاقية برن، يستحق المؤلف والملحن كامل العائدات المستخلصة من استغلال مصنفهما مع حق طلب التعويض العادل عن حجب النسبة أو التعدي.'
                : 'Under Berne Convention Art. 9 & Egypt Law 82/2002, authors and composers are entitled to full disgorgement of profits and punitive statutory damages for unauthorized commercial exploitation.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
