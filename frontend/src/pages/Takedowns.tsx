import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Send, CheckCircle2, AlertCircle, Copy, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Takedowns() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  // Form State
  const [workTitle, setWorkTitle] = useState('Summer Breeze (Master Recording)');
  const [platform, setPlatform] = useState('youtube');
  const [infringingUrl, setInfringingUrl] = useState('https://www.youtube.com/watch?v=unauthorized_rip_123');
  const [originalUrl, setOriginalUrl] = useState('https://open.spotify.com/track/official_isrc_123');
  const [claimantName, setClaimantName] = useState('Basem & Rights Holders');
  const [contactEmail, setContactEmail] = useState('rights@elsamee3.com');

  // Fair Use Checklist
  const [checklist, setChecklist] = useState({
    notParody: true,
    notCritique: true,
    isSubstantial: true,
    causesMarketHarm: true,
  });

  const platformTakedownUrls: Record<string, string> = {
    youtube: 'https://www.youtube.com/copyright_complaint_form',
    instagram: 'https://help.instagram.com/contact/552695131608132',
    facebook: 'https://www.facebook.com/help/contact/634636770043571',
    tiktok: 'https://www.tiktok.com/legal/report/Copyright',
    spotify: 'https://artists.spotify.com/c/dmca',
    soundcloud: 'https://soundcloud.com/pages/copyright',
    redbubble: 'https://www.redbubble.com/social/reportcontent',
    amazon: 'https://www.amazon.com/report/infringement',
  };

  const sampleCases = [
    {
      id: 'TK-101',
      title: 'Summer Breeze (Unauthorized Speed-Up Bootleg)',
      platform: 'YouTube',
      infringingUrl: 'https://youtube.com/watch?v=bootleg_sample',
      status: 'resolved',
      date: '2026-09-20',
      noticeText: `DMCA Takedown Notice per 17 U.S.C. § 512(c)(3)
Original Work: Summer Breeze (ISRC: USAT21234567)
Infringing URL: https://youtube.com/watch?v=bootleg_sample
Status: Content Removed by YouTube Copyright Operations`,
    },
    {
      id: 'TK-102',
      title: 'Cairo Sunset Calligraphy (Print-on-Demand T-Shirt)',
      platform: 'Redbubble',
      infringingUrl: 'https://redbubble.com/shop/counterfeit_shirt',
      status: 'sent',
      date: '2026-09-26',
      noticeText: `Notice of Copyright Infringement
Original Artwork: Cairo Sunset Calligraphy
Infringing URL: https://redbubble.com/shop/counterfeit_shirt
Submitted to: Redbubble Legal & Trust Team`,
    },
    {
      id: 'TK-103',
      title: 'Vocal Stem Pack Leak',
      platform: 'GitHub',
      infringingUrl: 'https://github.com/leaks/sample-pack-stems',
      status: 'acknowledged',
      date: '2026-09-27',
      noticeText: `DMCA Notice for Repository Delisting
Repository: https://github.com/leaks/sample-pack-stems
Status: Under review by GitHub Legal`,
    },
  ];

  const generatedNoticeText = `
DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE
Pursuant to 17 U.S.C. § 512(c)(3)

To the Designated Copyright Agent for ${platform.toUpperCase()}:

1. IDENTIFICATION OF COPYRIGHTED WORK:
I am the copyright owner (or authorized agent) of the original copyrighted work entitled:
"${workTitle}"
Original source/registration: ${originalUrl}

2. IDENTIFICATION OF INFRINGING MATERIAL:
The following URL contains an unauthorized copy, performance, or reproduction of my copyrighted work:
Infringing URL: ${infringingUrl}

3. CONTACT INFORMATION:
Name: ${claimantName}
Email: ${contactEmail}
Agent: Generated via elsamee3 (السميع) Rights Protection Platform

4. GOOD FAITH STATEMENT:
I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law (including applicable fair use principles).

5. ACCURACY & PERJURY STATEMENT:
The information in this notification is accurate, and under penalty of perjury, I declare that I am authorized to act on behalf of the owner of the exclusive right that is allegedly infringed.

Electronic Signature:
/${claimantName}/
Date: ${new Date().toLocaleDateString()}
`.trim();

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(generatedNoticeText);
    toast.success(isRTL ? 'تم نسخ نص إشعار DMCA إلى الحافظة!' : 'DMCA notice copied to clipboard!');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="text-brand-blue" size={24} />
            <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.takedowns')}</h1>
          </div>
          <p className="text-slate-500 text-xs">
            {isRTL
              ? 'إنشاء ومتابعة إشعارات الإزالة القانونية (DMCA) وفق المادة 512 مع التحقق من معايير الاستخدام العادل.'
              : 'Generate and track legally compliant statutory DMCA takedown notices (17 U.S.C. § 512) with fair use pre-checks.'}
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-all text-sm"
        >
          <Sparkles size={18} />
          <span>{showGenerator ? (isRTL ? 'إغلاق المولد' : 'Close Generator') : (isRTL ? 'إنشاء إشعار جديد' : 'New DMCA Notice')}</span>
        </button>
      </div>

      {/* Interactive DMCA Generator Modal/Section */}
      {showGenerator && (
        <div className="bg-white p-6 rounded-3xl border-2 border-brand-blue/30 shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isRTL ? 'مولد إشعارات DMCA القانونية الآلي' : 'Statutory DMCA Takedown Notice Generator'}
            </h2>
            <p className="text-slate-500 text-xs">
              {isRTL
                ? 'يقوم هذا المولد بإنشاء إشعار رسمي مكتمل الأركان الستة القانونية وفقاً للقانون الأمريكي والدولي.'
                : 'Generates compliant notices containing all 6 statutory elements under 17 U.S.C. § 512(c)(3).'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Original Work Title</label>
              <input
                type="text"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue capitalize"
              >
                {Object.keys(platformTakedownUrls).map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Infringing URL</label>
              <input
                type="url"
                value={infringingUrl}
                onChange={(e) => setInfringingUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Source / Proof of Ownership URL</label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue font-mono text-xs"
              />
            </div>
          </div>

          {/* Mandatory Fair Use Checklist per Lenz v. Universal */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <ShieldAlert size={18} />
              <span>Mandatory Good-Faith Fair Use Evaluation (Lenz v. Universal Music Corp.)</span>
            </div>
            <p className="text-xs text-amber-700">
              Before issuing a takedown, you must evaluate in good faith whether the use qualifies as fair use (parody, critique, or transformative educational excerpt).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.notParody}
                  onChange={(e) => setChecklist({ ...checklist, notParody: e.target.checked })}
                  className="rounded text-brand-blue"
                />
                <span>The use is NOT parody or satire</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.notCritique}
                  onChange={(e) => setChecklist({ ...checklist, notCritique: e.target.checked })}
                  className="rounded text-brand-blue"
                />
                <span>The use is NOT journalistic review or critique</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.isSubstantial}
                  onChange={(e) => setChecklist({ ...checklist, isSubstantial: e.target.checked })}
                  className="rounded text-brand-blue"
                />
                <span>A substantial, core portion of the work was copied</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.causesMarketHarm}
                  onChange={(e) => setChecklist({ ...checklist, causesMarketHarm: e.target.checked })}
                  className="rounded text-brand-blue"
                />
                <span>The unauthorized use harms commercial distribution</span>
              </label>
            </div>
          </div>

          {/* Generated Text Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Statutory Notice Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotice}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy Notice</span>
                </button>

                {platformTakedownUrls[platform] && (
                  <a
                    href={platformTakedownUrls[platform]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <span>Submit to {platform.toUpperCase()} Portal</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 border border-slate-800">
              {generatedNoticeText}
            </pre>
          </div>
        </div>
      )}

      {/* Active Takedown Cases Pipeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          {isRTL ? 'سجل وبلاغات الإزالة النشطة' : 'Enforcement Cases & Takedown History'}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {sampleCases.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      c.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : c.status === 'sent'
                        ? 'bg-blue-50 text-brand-blue border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {c.platform}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{c.infringingUrl}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Filed: {c.date}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(c.noticeText);
                    toast.success('Notice copied!');
                  }}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>Copy Record</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
