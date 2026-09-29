import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import {
  X,
  Calculator,
  Coins,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Copy,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Info,
  Youtube,
  Music,
  Video,
  Tv
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RoyaltyEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialArtist?: string;
  initialRole?: string;
}

export default function RoyaltyEstimatorModal({
  isOpen,
  onClose,
  initialTitle = '',
  initialArtist = '',
  initialRole = 'lyricist'
}: RoyaltyEstimatorModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [title, setTitle] = useState(initialTitle || (isRTL ? 'مصنف موسيقي / غنائي' : 'Musical / Lyrical Work'));
  const [artist, setArtist] = useState(initialArtist || (isRTL ? 'باسم عادل (شاعر) / فنان' : 'Bassem Adel / Artist'));
  const [role, setRole] = useState(initialRole || 'lyricist');
  const [currency, setCurrency] = useState('EGP');
  const [territory, setTerritory] = useState('mena');
  const [infringementType, setInfringementType] = useState('unauthorized_commercial');

  // Usage inputs
  const [youtubeViews, setYoutubeViews] = useState<number>(3000000);
  const [dspStreams, setDspStreams] = useState<number>(1200000);
  const [ugcCreations, setUgcCreations] = useState<number>(15000);
  const [syncCommercialUses, setSyncCommercialUses] = useState<number>(1);

  // Results state
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialArtist) setArtist(initialArtist);
    if (initialRole) setRole(initialRole);
  }, [initialTitle, initialArtist, initialRole, isOpen]);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      calculateEstimate();
    }, 150);

    return () => clearTimeout(timer);
  }, [
    isOpen,
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
        work_title: title,
        artist: artist,
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
      console.warn('Live API valuation failed, falling back to instant client evaluation', err);
      // Fallback calculation in case of network issues
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

  const copyLegalClaimText = () => {
    if (!result) return;
    const currSymbol = currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : '$';
    
    const text = isRTL
      ? `📋 إشعار مطالبة مالية وتعويض قانوني عن استغلال مصنف:\n` +
        `• المصنف: "${title}"\n` +
        `• صاحب الحق/الصفة: ${artist} (${role === 'lyricist' ? 'شاعر ومؤلف الكلمات' : role === 'composer' ? 'الملحن' : role})\n` +
        `• حجم الاستغلال المرصود: ${youtubeViews.toLocaleString()} مشاهدة يوتيوب | ${dspStreams.toLocaleString()} استماع منصات | ${ugcCreations.toLocaleString()} مقطع تيك توك/ريلز\n` +
        `• العائدات المستحقة الصافية: ${result.claimant_total_earnings_converted.toLocaleString()} ${currSymbol}\n` +
        `• مبلغ التسوية الودية المقترح (مع التعويض القانوني): ${result.recommended_settlement_claim_converted.toLocaleString()} ${currSymbol}\n` +
        `• الأساس القانوني: المواد (138، 139، 181) من قانون حماية الملكية الفكرية رقم 82 لسنة 2002 واتفاقية برن الدولية.\n` +
        `— صادر وموثق عبر منصة السميع (elsamee3.vercel.app)`
      : `📋 Formal Royalty & Legal Damages Settlement Notice:\n` +
        `• Work: "${title}"\n` +
        `• Claimant: ${artist} (${role})\n` +
        `• Tracked Usage: ${youtubeViews.toLocaleString()} YT Views | ${dspStreams.toLocaleString()} DSP Streams | ${ugcCreations.toLocaleString()} UGC Creations\n` +
        `• Net Accrued Royalties: ${result.claimant_total_earnings_converted.toLocaleString()} ${currency}\n` +
        `• Recommended Settlement Claim: ${result.recommended_settlement_claim_converted.toLocaleString()} ${currency}\n` +
        `• Statutory Basis: Berne Convention Art. 9, 17 U.S.C. § 504 & Egypt Law 82/2002.\n` +
        `— Verified via elsamee3 Rights Guardian (elsamee3.vercel.app)`;

    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم نسخ نص المطالبة القانونية إلى الحافظة بنجاح!' : 'Legal settlement claim copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <span>{isRTL ? 'حاسبة العائدات والتعويضات التقديرية' : 'Royalty & Damages Estimator'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {isRTL ? 'مباشر وفوري' : 'Live Engine'}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isRTL
                  ? 'تقدير أرباح المشاهدات والاستماع والاستخدام التجاري وحساب التعويض القانوني للشاعر والملحن'
                  : 'Estimate YouTube, DSP, TikTok UGC earnings & legal settlement claims for creators'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Metadata & Creator Role Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {isRTL ? 'اسم المصنف / الأغنية' : 'Work / Track Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {isRTL ? 'اسم صاحب الحق / الشريك' : 'Creator / Rightsholder'}
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'العملة' : 'Currency'}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="EGP">EGP (ج.م مصري)</option>
                  <option value="SAR">SAR (ر.س سعودي)</option>
                  <option value="USD">USD ($ دولار)</option>
                  <option value="AED">AED (د.إ إماراتي)</option>
                  <option value="EUR">EUR (€ يورو)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isRTL ? 'نطاق الجمهور' : 'Territory'}
                </label>
                <select
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="mena">{isRTL ? 'الشرق الأوسط (MENA)' : 'Arab MENA'}</option>
                  <option value="global">{isRTL ? 'عالمي (Global)' : 'Global'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isRTL ? 'صفتك القانونية في المصنف (لتحديد نسبة الحصة والمطالبة):' : 'Your Legal Role & Entitled Share:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'lyricist', labelAr: 'الشاعر / المؤلف ✍️', labelEn: 'Lyricist (15%)', subAr: 'حصة الكلمات والنشر' },
                { id: 'composer', labelAr: 'الملحن 🎼', labelEn: 'Composer (15%)', subAr: 'حصة اللحن والنشر' },
                { id: 'songwriter_both', labelAr: 'شاعر وملحن 🎵', labelEn: 'Both (30%)', subAr: 'كامل حصة التأليف' },
                { id: 'performer', labelAr: 'المطرب / المؤدي 🎤', labelEn: 'Singer (35%)', subAr: 'حصة أداء الماستر' },
                { id: 'producer_label', labelAr: 'المنتج / الشركة 🏢', labelEn: 'Producer (35%)', subAr: 'حصة إنتاج الماستر' },
                { id: 'full_rights', labelAr: 'كامل الحقوق 👑', labelEn: 'Full Rights (100%)', subAr: 'شامل كل القنوات' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs flex flex-col justify-center items-center gap-0.5 ${
                    role === r.id
                      ? 'bg-blue-50 border-brand-blue text-brand-blue font-bold shadow-sm ring-1 ring-brand-blue'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold">{isRTL ? r.labelAr : r.labelEn}</span>
                  <span className="text-[10px] text-slate-600 font-normal">{r.subAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders & Platform Inputs */}
          <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins size={16} className="text-amber-500" />
                {isRTL ? 'إحصائيات الانتشار والاستخدام المرصود:' : 'Tracked Platform Usage & Streams:'}
              </span>
              <span className="text-xs font-normal text-slate-500">
                {isRTL ? 'اسحب المؤشرات أو اكتب القيمة' : 'Adjust sliders or type values'}
              </span>
            </h3>

            {/* YouTube Views */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Youtube size={16} className="text-red-600" />
                  {isRTL ? 'مشاهدات يوتيوب (AdSense & Content ID)' : 'YouTube Views'}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={youtubeViews}
                    onChange={(e) => setYoutubeViews(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-28 px-2 py-1 text-end font-mono text-xs font-bold border rounded-lg bg-slate-50"
                  />
                  <span className="text-xs text-slate-600">{isRTL ? 'مشاهدة' : 'views'}</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={50000000}
                step={250000}
                value={youtubeViews}
                onChange={(e) => setYoutubeViews(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                <span>0</span>
                <span>1M</span>
                <span>10M</span>
                <span>25M</span>
                <span>50M+</span>
              </div>
            </div>

            {/* DSP Streaming */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Music size={16} className="text-emerald-600" />
                  {isRTL ? 'استماعات المنصات الرقمية (Spotify, Apple, Anghami, Deezer)' : 'DSP Audio Streams'}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={dspStreams}
                    onChange={(e) => setDspStreams(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-28 px-2 py-1 text-end font-mono text-xs font-bold border rounded-lg bg-slate-50"
                  />
                  <span className="text-xs text-slate-600">{isRTL ? 'استماع' : 'streams'}</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={100000}
                value={dspStreams}
                onChange={(e) => setDspStreams(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                <span>0</span>
                <span>500K</span>
                <span>5M</span>
                <span>10M</span>
                <span>20M+</span>
              </div>
            </div>

            {/* UGC TikTok / Reels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Video size={16} className="text-purple-600" />
                    {isRTL ? 'فيديوهات تيك توك وريلز (UGC)' : 'TikTok & Reels Videos'}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={ugcCreations}
                    onChange={(e) => setUgcCreations(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-2 py-1 text-end font-mono text-xs font-bold border rounded-lg bg-slate-50"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={ugcCreations}
                  onChange={(e) => setUgcCreations(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-[11px] text-purple-700 font-semibold mt-1">
                  {result?.ugc_virality_label_ar || 'تصنيف الرواج'}
                </p>
              </div>

              {/* Sync Commercial Ads / TV */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tv size={16} className="text-amber-600" />
                    {isRTL ? 'استخدامات إعلانية / درامية (Sync)' : 'Commercial Sync / Ads'}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={syncCommercialUses}
                    onChange={(e) => setSyncCommercialUses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 px-2 py-1 text-end font-mono text-xs font-bold border rounded-lg bg-slate-50"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[0, 1, 2, 3, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSyncCommercialUses(cnt)}
                      className={`flex-1 py-1 text-xs rounded-lg border font-semibold ${
                        syncCommercialUses === cnt
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt === 0 ? (isRTL ? 'بدون' : 'None') : `${cnt} ${isRTL ? 'إعلان' : 'sync'}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Infringement Nature (for Legal Settlement) */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
            <div className="flex items-center gap-2 mb-2 text-rose-900 font-bold text-xs sm:text-sm">
              <ShieldAlert size={18} className="text-rose-600" />
              <span>{isRTL ? 'طبيعة الانتهاك وحجم التعويض القانوني المقترح:' : 'Infringement Nature & Damages Benchmark:'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'unauthorized_commercial', labelAr: 'حملة إعلانية / تجارية بدون إذن', labelEn: 'Commercial Ad (2.8x)', mult: '2.8x' },
                { id: 'derivative_sample', labelAr: 'سرقة لحن أو اقتباس كلمات', labelEn: 'Stolen Sample (2.2x)', mult: '2.2x' },
                { id: 'willful_theft', labelAr: 'استيلاء متعمد ونسب لغير صاحبه', labelEn: 'Willful Plagiarism (3.8x)', mult: '3.8x' },
                { id: 'uncredited_stream', labelAr: 'نشر وقرصنة بدون ذكر المبدع', labelEn: 'Uncredited Piracy (1.3x)', mult: '1.3x' },
              ].map((inf) => (
                <button
                  key={inf.id}
                  type="button"
                  onClick={() => setInfringementType(inf.id)}
                  className={`p-2 rounded-xl border text-xs text-start transition-all ${
                    infringementType === inf.id
                      ? 'bg-white border-rose-500 text-rose-900 font-bold shadow-xs ring-1 ring-rose-500'
                      : 'bg-white/60 border-rose-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{isRTL ? inf.labelAr : inf.labelEn}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                      {inf.mult}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              
              {/* Dual Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Net Earnings Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 end-0 p-4 opacity-10">
                    <Coins size={90} />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                    {isRTL ? 'صافي العائدات المستحقة لصفتك' : 'Your Net Entitled Earnings'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
                    {result.claimant_total_earnings_converted.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-blue-200">
                      {currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : currency}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mt-2">
                    {isRTL
                      ? `من إجمالي صناعة يقدر بـ ${result.total_gross_converted.toLocaleString()} ${currency} عبر كافة القنوات.`
                      : `From an estimated gross industry pool of ${result.total_gross_converted.toLocaleString()} ${currency}.`}
                  </p>
                </div>

                {/* Statutory Settlement Claim Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-rose-700 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 end-0 p-4 opacity-10">
                    <ShieldAlert size={90} />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold">
                    {isRTL ? 'قيمة التعويض والتسوية الودية المقترحة' : 'Recommended Settlement Claim'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-amber-100">
                    {result.recommended_settlement_claim_converted.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-amber-200">
                      {currency === 'EGP' ? 'ج.م' : currency === 'SAR' ? 'ر.س' : currency}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100 mt-2">
                    {isRTL
                      ? `تصل قضائياً حتى ${result.max_litigation_demand_converted.toLocaleString()} ${currency} شاملاً الضررين المادي والأدبي.`
                      : `Litigation ceiling benchmark up to ${result.max_litigation_demand_converted.toLocaleString()} ${currency} in civil claims.`}
                  </p>
                </div>

              </div>

              {/* Channel Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">YouTube AdSense</span>
                  <span className="text-sm font-bold text-red-600">
                    {result.channel_breakdown_converted.youtube.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">DSPs Streaming</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {result.channel_breakdown_converted.dsp_streaming.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">TikTok UGC</span>
                  <span className="text-sm font-bold text-purple-600">
                    {result.channel_breakdown_converted.ugc_social.toLocaleString()} {currency}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Sync Commercial</span>
                  <span className="text-sm font-bold text-amber-600">
                    {result.channel_breakdown_converted.sync_commercial.toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              {/* Legal Citation Footnote */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5">
                <Info size={17} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  {isRTL ? result.legal_basis_summary_ar : result.legal_basis_summary_en}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isRTL
              ? 'الحسابات مبنية على متوسطات أسعار البث ونسب جمعيات المؤلفين SDRM وSACEM وThe MLC'
              : 'Rates calibrated to The MLC, SACEM, SDRM & YouTube Partner standards'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLegalClaimText}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Copy size={15} />
              <span>{isRTL ? 'نسخ نص المطالبة والتعويض' : 'Copy Claim Notice'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-900/20"
            >
              {isRTL ? 'تم والعودة' : 'Done'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
