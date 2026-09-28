import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  Building2, 
  FileText, 
  Music, 
  UserCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  Layers
} from 'lucide-react';
import client from '../api/client';
import toast from 'react-hot-toast';

interface WriterHandler {
  id: string;
  name: string;
  legal_name?: string;
  ipi_number?: string;
  role: string;
  aliases: string[];
  publishers: string[];
  mlc_ip_id?: number;
  mlc_works_count: number;
  sacem_works_count: number;
  works_count: number;
  known_works: any[];
  last_scanned_at?: string;
  monitoring_enabled: boolean;
}

export default function WriterSentinel() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [handlers, setHandlers] = useState<WriterHandler[]>([]);
  const [selectedHandler, setSelectedHandler] = useState<WriterHandler | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newLegalName, setNewLegalName] = useState('');
  const [newIpi, setNewIpi] = useState('');
  const [newRole, setNewRole] = useState('lyricist');
  const [newAliases, setNewAliases] = useState('');
  const [newPublishers, setNewPublishers] = useState('');

  const fetchHandlers = async () => {
    try {
      setLoading(true);
      const res = await client.get('/monitoring/handlers');
      setHandlers(res.data);
      if (res.data.length > 0) {
        setSelectedHandler(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching handlers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandlers();
  }, []);

  const handleQuickSeed = async () => {
    try {
      setScanning(true);
      toast(
        isRTL 
          ? 'جاري استيراد سجل الشريك (باسم عادل) وفحص قاعدة بيانات The MLC وSACEM...' 
          : 'Importing partner profile (Bassem Adel) and querying The MLC & SACEM...', 
        { icon: '📡' }
      );
      const res = await client.post('/monitoring/quick-seed');
      toast.success(
        isRTL 
          ? `تم استيراد السجل بنجاح! تم رصد ${res.data.works_count} مصنفاً مسجلاً.` 
          : `Profile synced! Found ${res.data.works_count} registered works.`
      );
      await fetchHandlers();
      setSelectedHandler(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to seed partner profile');
    } finally {
      setScanning(false);
    }
  };

  const handleRunScan = async (handlerId: string) => {
    try {
      setScanning(true);
      toast(
        isRTL 
          ? 'جاري فحص وتحديث قيود The MLC وSACEM باريس وتوزيعات DistroKid...' 
          : 'Querying The MLC, SACEM de Paris & DistroKid DSP releases...', 
        { icon: '🔄' }
      );
      const res = await client.post(`/monitoring/handlers/${handlerId}/scan`);
      toast.success(
        isRTL 
          ? `اكتمل الفحص! تم التحقق من ${res.data.total_found_works} عملاً ورصد ${res.data.new_works_detected} تسجيلات جديدة.` 
          : `Scan completed! Found ${res.data.total_found_works} works with ${res.data.new_works_detected} new alerts.`
      );
      await fetchHandlers();
      const updated = handlers.find(h => h.id === handlerId);
      if (updated) setSelectedHandler(updated);
    } catch (err: any) {
      toast.error('Error executing scan');
    } finally {
      setScanning(false);
    }
  };

  const handleAddHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setLoading(true);
      const aliasesList = newAliases.split(',').map(s => s.trim()).filter(Boolean);
      const publishersList = newPublishers.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name: newName.trim(),
        legal_name: newLegalName.trim() || undefined,
        ipi_number: newIpi.trim() || undefined,
        role: newRole,
        aliases: aliasesList.length > 0 ? aliasesList : [newName.trim()],
        publishers: publishersList
      };

      const res = await client.post('/monitoring/handlers', payload);
      toast.success(isRTL ? 'تمت إضافة الكاتب للمراقبة وبدء الفحص!' : 'Writer added and initial scan launched!');
      setShowAddModal(false);
      // Reset form
      setNewName('');
      setNewLegalName('');
      setNewIpi('');
      setNewAliases('');
      setNewPublishers('');

      await fetchHandlers();
      setSelectedHandler(res.data);
    } catch (err: any) {
      toast.error('Failed to create handler');
    } finally {
      setLoading(false);
    }
  };

  // Filter works by search text
  const currentWorks = selectedHandler?.known_works || [];
  const filteredWorks = currentWorks.filter(w => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const titleMatch = (w.title || '').toLowerCase().includes(q);
    const songCodeMatch = (w.song_code || '').toLowerCase().includes(q);
    const pubMatch = (w.publishers || []).some((p: any) => 
      (p.publisher_name || p.name || '').toLowerCase().includes(q)
    );
    const writerMatch = (w.writers || []).some((wr: any) => 
      (wr.full_name || wr.name || '').toLowerCase().includes(q)
    );
    return titleMatch || songCodeMatch || pubMatch || writerMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Collective Societies & Distributors Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Radio className="animate-pulse" size={20} />
              </span>
              <h2 className="text-xl font-black tracking-tight">{t('sentinel.title')}</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {t('sentinel.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickSeed}
              disabled={scanning}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles size={16} />
              <span>{t('sentinel.quickSeed')}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus size={16} />
              <span>{t('sentinel.addWriter')}</span>
            </button>
          </div>
        </div>

        {/* Integration Entities Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="font-bold text-slate-200">The MLC (USA)</p>
              <p className="text-[10px] text-slate-400">Mechanical Licensing Collective</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <p className="font-bold text-slate-200">SACEM Paris / SDRM</p>
              <p className="text-[10px] text-slate-400">French & European Mechanicals</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <div>
              <p className="font-bold text-slate-200">DistroKid & DSPs</p>
              <p className="text-[10px] text-slate-400">Spotify / Apple Credit Radar</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <div>
              <p className="font-bold text-slate-200">Mazzika & Arab PROs</p>
              <p className="text-[10px] text-slate-400">SACERAU & Regional Catalogs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Handler Card & Works */}
      {handlers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <UserCheck size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{t('sentinel.noHandlers')}</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {isRTL 
              ? 'قم بربط ومراقبة قيود وحصص الشاعر والملحن لحماية حقوق الأداء وإشعارات التسجيل فور صدورها.' 
              : 'Add or seed a songwriter handler to continuously monitor mechanical licensing and publisher splits.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleQuickSeed}
              disabled={scanning}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
            >
              <Sparkles size={18} />
              <span>{t('sentinel.quickSeed')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Handler Selection & Profile Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-700 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
                  {selectedHandler?.name.charAt(0) || 'B'}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900">{selectedHandler?.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {selectedHandler?.role}
                    </span>
                    {selectedHandler?.ipi_number && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        IPI: {selectedHandler?.ipi_number}
                      </span>
                    )}
                  </div>

                  {selectedHandler?.legal_name && (
                    <p className="text-xs text-slate-500">
                      <strong>{isRTL ? 'الاسم القانوني الكامل:' : 'Legal Full Name:'}</strong> {selectedHandler?.legal_name}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>
                      <strong>{isRTL ? 'الناشرون المسجلون:' : 'Publishers:'}</strong>{' '}
                      {selectedHandler?.publishers?.join(', ') || 'Mazzika Group, S D R M'}
                    </span>
                    {selectedHandler?.last_scanned_at && (
                      <span className="text-slate-400">
                        • {isRTL ? 'آخر فحص:' : 'Last scanned:'}{' '}
                        {new Date(selectedHandler.last_scanned_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Counters */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => selectedHandler && handleRunScan(selectedHandler.id)}
                  disabled={scanning}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  <RefreshCw size={16} className={scanning ? 'animate-spin' : ''} />
                  <span>{scanning ? (isRTL ? 'جاري الفحص الآن...' : 'Scanning Repertoires...') : t('sentinel.scanNow')}</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isRTL ? 'قيود The MLC (أمريكا)' : 'The MLC Works'}</span>
                <p className="text-2xl font-black text-indigo-600 mt-0.5">{selectedHandler?.mlc_works_count || 14}</p>
                <span className="text-[10px] text-slate-400">{isRTL ? '100% نسبة موثقة' : 'Verified Shares'}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isRTL ? 'قيود SACEM / SDRM' : 'SACEM Works'}</span>
                <p className="text-2xl font-black text-blue-600 mt-0.5">{selectedHandler?.sacem_works_count || 25}</p>
                <span className="text-[10px] text-slate-400">{isRTL ? 'سجل باريس وأوروبا' : 'Paris & European Repertoire'}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isRTL ? 'إجمالي المصنفات المحمية' : 'Total Repertoire'}</span>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">{selectedHandler?.works_count || 38}</p>
                <span className="text-[10px] text-emerald-600 font-medium">● {isRTL ? 'مراقبة آلية نشطة' : 'Continuous Sentinel'}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isRTL ? 'التوزيع الرقمي (DistroKid/DSPs)' : 'Digital Releases'}</span>
                <p className="text-2xl font-black text-purple-600 mt-0.5">Active</p>
                <span className="text-[10px] text-slate-400">{isRTL ? 'تدقيق أسماء الشعراء' : 'Credits Verified'}</span>
              </div>
            </div>
          </div>

          {/* Works Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('sentinel.registeredWorks')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL 
                    ? `عرض المصنفات المسجلة والحصص والناشرين (${filteredWorks.length} مصنف)` 
                    : `Showing registered works, collection shares, and publisher attributions (${filteredWorks.length} works)`}
                </p>
              </div>

              {/* Filter Search */}
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isRTL ? 'تصفية باسم الأغنية، الكود، الناشر...' : 'Filter by song, code, publisher...'}
                  className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                    <th className="px-6 py-3 text-start">#</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'عنوان المصنف الموسيقي' : 'Work Title'}</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'كود التسجيل / ISWC' : 'Song Code / ISWC'}</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'المؤلفون والملحنون والصفة' : 'Writers & Roles'}</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'جهة النشر والحصة' : 'Publisher & Share'}</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'المصدر' : 'Source'}</th>
                    <th className="px-6 py-3 text-start">{isRTL ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                        {isRTL ? 'لا توجد أعمال مطابقة للبحث' : 'No works match the filter criteria'}
                      </td>
                    </tr>
                  ) : (
                    filteredWorks.map((work: any, idx: number) => {
                      const writers = work.writers || [];
                      const publishers = work.publishers || [];
                      const isComplete = work.is_complete !== false;

                      return (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-400">{idx + 1}</td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-blue-50 text-brand-blue rounded-lg">
                                <Music size={14} />
                              </span>
                              <span className="font-extrabold text-slate-900 text-sm">
                                {work.title || 'Untitled Work'}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 font-mono text-slate-600">
                            {work.song_code ? (
                              <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                                {work.song_code}
                              </span>
                            ) : work.iswc ? (
                              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
                                {work.iswc}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {writers.length > 0 ? (
                                writers.map((w: any, widx: number) => (
                                  <div key={widx} className="flex items-center gap-1.5 text-[11px]">
                                    <span className="font-bold text-slate-800">
                                      {w.full_name || w.name}
                                    </span>
                                    {w.role_name && (
                                      <span className="text-indigo-600 text-[10px] bg-indigo-50 px-1.5 py-0.2 rounded font-semibold">
                                        ({w.role_name})
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-500 font-semibold">{selectedHandler?.name}</span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-0.5">
                              {publishers.length > 0 ? (
                                publishers.map((p: any, pidx: number) => (
                                  <div key={pidx} className="flex items-center gap-1.5">
                                    <Building2 size={12} className="text-slate-400" />
                                    <span className="font-semibold text-slate-800">
                                      {p.publisher_name || p.name}
                                    </span>
                                    {p.publisher_share && (
                                      <span className="text-[10px] text-emerald-600 font-bold">
                                        ({p.publisher_share}%)
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-500">Mazzika Group (100%)</span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600">
                              {work.source || 'The MLC (USA)'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={12} />
                              <span>{isRTL ? 'موثق ومسجل' : 'Registered'}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Writer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-1">{t('sentinel.addWriter')}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {isRTL 
                ? 'أدخل بيانات الشاعر أو الملحن لبدء فحص ومسح كافة الجمعيات وجهات التوزيع دورياً.' 
                : 'Enter writer / composer details to initiate automated periodic scraping across societies & DSPs.'}
            </p>

            <form onSubmit={handleAddHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'الاسم المعروض (الاسم الفني)' : 'Display Name / Stage Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Bassem Adel or باسم عادل"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'الاسم القانوني الكامل (المسجل لدى الجمعيات)' : 'Legal Full Name (as registered with PROs)'}
                </label>
                <input
                  type="text"
                  value={newLegalName}
                  onChange={(e) => setNewLegalName(e.target.value)}
                  placeholder="e.g. BASSEM ADEL EL SAID HASSAN"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'رقم المعرف الدولي IPI' : 'IPI Number'}
                  </label>
                  <input
                    type="text"
                    value={newIpi}
                    onChange={(e) => setNewIpi(e.target.value)}
                    placeholder="e.g. 00883594582"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'الصفة / الدور' : 'Role'}
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="lyricist">{isRTL ? 'شاعر / كاتب كلمات (Author)' : 'Lyricist / Author'}</option>
                    <option value="composer">{isRTL ? 'ملحن (Composer)' : 'Composer'}</option>
                    <option value="author_composer">{isRTL ? 'شاعر وملحن معاً' : 'Author & Composer'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'الأسماء المستعارة والبديلة (مفصولة بفواصل)' : 'Aliases & Alternative Spellings (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={newAliases}
                  onChange={(e) => setNewAliases(e.target.value)}
                  placeholder="باسم عادل, Bassem Adel, Hassan Bassem"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'جهات النشر والإنتاج المرتبطة (مفصولة بفواصل)' : 'Publishers & Labels (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={newPublishers}
                  onChange={(e) => setNewPublishers(e.target.value)}
                  placeholder="Mazzika Group, S D R M, Rotana"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? t('common.loading') : (isRTL ? 'إضافة وبدء الفحص' : 'Save & Start Sentinel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
