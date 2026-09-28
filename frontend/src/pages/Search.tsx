import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import SearchBar from '../components/SearchBar';
import ResultCard, { ResultItem } from '../components/ResultCard';
import { toast } from 'react-hot-toast';
import { Shield, Database, Loader2, Info, ArrowUpRight, Feather, Building2, Music } from 'lucide-react';

export default function Search() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchMeta, setSearchMeta] = useState<{ query: string; detectedType: string; count: number } | null>(null);

  const handleSearch = async (queryText: string, category: string = 'all') => {
    setActiveCategory(category);
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await api.post('/search', { query: queryText });
      const data = response.data;
      setResults(data.results || []);
      setSearchMeta({
        query: queryText,
        detectedType: data.detected_type,
        count: data.results_count || (data.results ? data.results.length : 0),
      });

      if (data.results && data.results.length > 0) {
        toast.success(isRTL ? `تم العثور على ${data.results.length} مصنف وقيد حقوق!` : `Found ${data.results.length} copyright records!`);
      } else {
        toast(isRTL ? 'لم يتم العثور على نتائج، جرب مصطلحاً آخر أو كود ISWC.' : 'No direct records found. Try another query.', { icon: '🔍' });
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      toast.error(isRTL ? 'حدث خطأ أثناء فحص السجلات، يرجى المحاولة ثانية.' : 'Search request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLyricsSearch = async (lyrics: string) => {
    setLoading(true);
    setHasSearched(true);
    setActiveCategory('lyricist');
    toast(isRTL ? 'جاري فحص ومطابقة نصوص الكلمات عبر البصمة النصية...' : 'Computing lyrics hash and scanning archives...', { icon: '✍️' });

    try {
      const response = await api.post('/search/lyrics', { lyrics });
      const data = response.data;
      const matches = data.matches || [];
      setResults(matches);
      setSearchMeta({
        query: lyrics.slice(0, 40) + '...',
        detectedType: 'lyrics_fingerprint',
        count: matches.length,
      });

      if (matches.length > 0) {
        toast.success(isRTL ? `تم فحص البصمة ومطابقة ${matches.length} عمل محتمل!` : `Computed lyrics fingerprint and matched ${matches.length} works!`);
      } else {
        toast(isRTL ? 'البصمة فريدة! لا يوجد تطابق مسجل مسبقاً لهذه الكلمات.' : 'Lyrics fingerprint is unique! No conflicting registrations found.', { icon: '✨' });
      }
    } catch (err) {
      console.error('Lyrics search failed:', err);
      toast.error(isRTL ? 'فشل فحص الكلمات.' : 'Failed to scan lyrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSearch = async (file: File, type: 'audio' | 'image') => {
    setLoading(true);
    setHasSearched(true);
    const formData = new FormData();
    formData.append('file', file);

    const endpoint = type === 'audio' ? '/search/audio' : '/search/image';
    toast(isRTL ? `جاري استخراج البصمة لـ ${file.name}...` : `Extracting fingerprint for ${file.name}...`, { icon: '🧬' });

    try {
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      const matches = data.matches || [];
      setResults(matches);
      setSearchMeta({
        query: file.name,
        detectedType: `${type}_fingerprint`,
        count: matches.length,
      });

      toast.success(isRTL ? `تم استخراج البصمة والبحث بنجاح!` : `Fingerprint computed and searched successfully!`);
    } catch (err: any) {
      console.error('File search error:', err);
      toast.error(isRTL ? 'فشل فحص الملف.' : 'Failed to analyze file.');
    } finally {
      setLoading(false);
    }
  };

  // Filter results by selected category
  const filteredResults = results.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'composer') {
      return item.type === 'composer' || item.type === 'work' || item.type === 'composition_match' || (item.iswc && item.iswc.length > 0) || item.source.includes('MusicBrainz Works');
    }
    if (activeCategory === 'lyricist') {
      return item.type === 'lyricist' || item.type === 'lyrics' || item.type === 'lyrics_match' || (item.author && item.author.toLowerCase().includes('lyricist'));
    }
    if (activeCategory === 'arab_cmo') {
      return item.type === 'arab_cmo' || item.source.includes('Arab Repertoire');
    }
    if (activeCategory === 'music') {
      return item.type === 'recording' || item.type === 'release' || item.source.includes('MusicBrainz Recordings') || item.source.includes('Discogs');
    }
    if (activeCategory === 'visual') {
      return item.type === 'visual_artwork' || item.type === 'image' || item.source.includes('Openverse');
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-2">
          <Shield size={14} />
          <span>{isRTL ? 'حماية حقوق الملحنين والشعراء والمؤلفين الموسيقيين' : 'Copyright Vault for Composers, Lyricists & Songwriters'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRTL ? 'البحث عن الألحان والكلمات والجمعيات العربية' : 'Search Melodies, Lyrics & Arab Copyright Societies'}
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          {isRTL
            ? 'فحص شامل يشمل جمعية المؤلفين والملحنين بمصر (SACERAU)، هيئة الملكية الفكرية السعودية (SAIP)، ديوان ONDA بالجزائر، ومكتب BMDA بالمغرب، مع دعم البصمة النصية لكتاب الكلمات ورموز ISWC للملحنين.'
            : 'Cross-query Arab collecting societies (SACERAU, SAIP, ONDA, BMDA, OTPDA), ISWC composition registers, and international repertoires.'}
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="py-2">
        <SearchBar
          onSearch={handleSearch}
          onFileSearch={handleFileSearch}
          onLyricsSearch={handleLyricsSearch}
          isLoading={loading}
        />
      </div>

      {/* Quick Arab Societies & Composer Links Bar */}
      {!hasSearched && (
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-50/70 via-blue-50/40 to-purple-50/70 p-5 rounded-3xl border border-emerald-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <Building2 size={16} className="text-emerald-700" />
              <span>{isRTL ? 'دليل الجمعيات والهيئات العربية للمؤلفين والملحنين:' : 'Arab Authors & Composers Collecting Societies:'}</span>
            </span>
            <button
              onClick={() => handleSearch('جمعية', 'arab_cmo')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              {isRTL ? 'عرض جميع الهيئات العربية ←' : 'Browse All Arab Societies →'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: '🇪🇬 جمعية المؤلفين والملحنين (SACERAU مصر)', q: 'SACERAU' },
              { label: '🇸🇦 الملكية الفكرية (SAIP السعودية)', q: 'السعودية' },
              { label: '🇩🇿 حقوق المؤلف (ONDA الجزائر)', q: 'ONDA' },
              { label: '🇲🇦 المكتب المغربي (BMDA المغرب)', q: 'المغرب' },
              { label: '🇹🇳 حقوق المؤلف (OTPDA تونس)', q: 'تونس' },
              { label: '🇱🇧 ساسيم لبنان (SACEM Liban)', q: 'لبنان' },
            ].map((soc) => (
              <button
                key={soc.label}
                onClick={() => handleSearch(soc.q, 'arab_cmo')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-slate-800 font-semibold transition-all shadow-2xs"
              >
                {soc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            <p className="text-sm font-medium">
              {isRTL
                ? 'جاري فحص قواعد بيانات الملحنين والشعراء والجمعيات العربية...'
                : 'Querying composer, lyricist, and Arab copyright society registries...'}
            </p>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="space-y-4">
            {/* Search Meta summary bar */}
            <div className="flex flex-wrap items-center justify-between bg-slate-100/80 p-3.5 rounded-xl text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Database size={15} className="text-brand-blue" />
                <span>
                  {isRTL ? 'نتائج الفحص عن:' : 'Results for:'} <strong className="text-slate-900 font-bold">"{searchMeta?.query}"</strong>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-mono">
                  {searchMeta?.detectedType}
                </span>
              </div>
              <span className="text-slate-500 font-semibold">
                {isRTL
                  ? `عرض ${filteredResults.length} من إجمالي ${results.length} قيد حقوق`
                  : `Showing ${filteredResults.length} of ${results.length} total records`}
              </span>
            </div>

            {/* Results List */}
            {filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((item, index) => (
                  <ResultCard key={item.id || index} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <Info size={36} className="mx-auto text-slate-400" />
                <h3 className="font-semibold text-slate-800 text-base">
                  {isRTL ? 'لا توجد نتائج في هذا التصنيف' : 'No records match this specific category'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isRTL
                    ? 'جرب النقر على زر "جميع المصادر" أو كتابة اسم الملحن / الشاعر بشكل مباشر.'
                    : 'Try selecting "All Sources" or broadening your search terms.'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base">
              {isRTL ? '💡 أمثلة لبحث الملحنين والشعراء والمصنفات' : '💡 Example Composer & Lyricist Searches'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {[
                'بليغ حمدي (Baligh Hamdi)',
                'أحمد رامي (Ahmed Rami)',
                'سيد درويش (Sayed Darwish)',
                'صلاح جاهين (Salah Jaheen)',
                'محمد عبد الوهاب',
                'الأخوين رحباني',
                'عمر خيرت',
                'T-070.783.439-C'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => handleSearch(example.split(' ')[0], 'all')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-brand-blue border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{example}</span>
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 pt-2">
              {isRTL
                ? 'يمكنك فحص نصوص الكلمات عبر أيقونة القلم ✍️ أو رفع اللحن الصوتي 🎤 أو البحث برقم ISWC للمصنف.'
                : 'Scan lyrics with the feather icon ✍️, upload melody audio clips 🎤, or query by ISWC musical work code.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
