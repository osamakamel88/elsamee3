import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import SearchBar from '../components/SearchBar';
import ResultCard, { ResultItem } from '../components/ResultCard';
import { toast } from 'react-hot-toast';
import { Sparkles, Database, Loader2, Info, ArrowUpRight } from 'lucide-react';

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
        toast.success(isRTL ? `تم العثور على ${data.results.length} نتيجة!` : `Found ${data.results.length} records!`);
      } else {
        toast(isRTL ? 'لم يتم العثور على نتائج، جرب كلمة أخرى.' : 'No direct records found. Try another query.', { icon: '🔍' });
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      toast.error(isRTL ? 'حدث خطأ أثناء البحث، يرجى المحاولة ثانية.' : 'Search request failed. Please try again.');
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
    toast(isRTL ? `جاري تحليل وبصمة ملف ${file.name}...` : `Fingerprinting and analyzing ${file.name}...`, { icon: '🧬' });

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

      toast.success(isRTL ? `تم استخراج البصمة بنجاح!` : `Fingerprint computed successfully!`);
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
    if (activeCategory === 'music') {
      return item.source.includes('MusicBrainz') || item.type === 'recording' || item.type === 'artist' || item.type === 'work';
    }
    if (activeCategory === 'visual') {
      return item.source.includes('Openverse') || item.type === 'visual_artwork';
    }
    if (activeCategory === 'huggingface') {
      return item.source.includes('Hugging Face') || item.type === 'ai_model' || item.type === 'ai_dataset';
    }
    if (activeCategory === 'github') {
      return item.source.includes('GitHub') || item.type === 'code_repository';
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-2">
          <Sparkles size={14} />
          <span>{isRTL ? 'محرك البحث وحماية الحقوق العالمي' : 'Global Copyright & AI Protection Engine'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRTL ? 'البحث عن الفنانين والأعمال والتسريبات' : 'Search Artists, Works & AI Models'}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {isRTL
            ? 'ابحث عبر MusicBrainz و Openverse ومستودعات GitHub ونماذج Hugging Face للكشف عن استغلال أعمالك أو نسخها.'
            : 'Cross-query MusicBrainz, Openverse, GitHub repositories, and Hugging Face AI models to detect misuse or copyright breaches.'}
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="py-2">
        <SearchBar
          onSearch={handleSearch}
          onFileSearch={handleFileSearch}
          isLoading={loading}
        />
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            <p className="text-sm font-medium">
              {isRTL
                ? 'جاري فحص قواعد البيانات العالمية (MusicBrainz, Hugging Face, GitHub, Openverse)...'
                : 'Querying global databases (MusicBrainz, Hugging Face, GitHub, Openverse)...'}
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
                  {isRTL ? 'نتائج البحث عن:' : 'Results for:'} <strong className="text-slate-900 font-bold">"{searchMeta?.query}"</strong>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-mono">
                  {searchMeta?.detectedType}
                </span>
              </div>
              <span className="text-slate-500 font-semibold">
                {isRTL
                  ? `عرض ${filteredResults.length} من إجمالي ${results.length} نتيجة`
                  : `Showing ${filteredResults.length} of ${results.length} total results`}
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
                    ? 'جرب النقر على زر "جميع المصادر" أو كتابة اسم آخر للبحث عبر الشبكات الأخرى.'
                    : 'Try selecting "All Sources" or broadening your search terms.'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base">
              {isRTL ? '💡 اقتراحات لبدء البحث الفوري' : '💡 Try quick example searches'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
              {['Amr Diab', 'Adele', 'Basem', 'Fairuz', 'Beethoven', 'Leonardo da Vinci', 'LoRA voice'].map((example) => (
                <button
                  key={example}
                  onClick={() => handleSearch(example, 'all')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-brand-blue border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{example}</span>
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 pt-2">
              {isRTL
                ? 'يمكنك أيضاً كتابة رمز ISRC (مثل USAT21234567) أو ISWC أو رفع ملف صوتي/صورة عبر الأيقونات أعلاه.'
                : 'You can also search by ISRC code, ISWC, or upload audio/image files directly.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
