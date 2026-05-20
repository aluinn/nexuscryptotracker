import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/ArticleCard';
import CryptoChip from '@/components/CryptoChip';
import SkeletonCard from '@/components/SkeletonCard';

export default function ForYou() {
  const { user } = useOutletContext();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('top');
  const [savedIds, setSavedIds] = useState(new Set());

  const cryptos = user?.selected_cryptos || ['BTC', 'ETH'];

  useEffect(() => {
    fetchNews();
    loadSaved();
  }, []);

  const loadSaved = async () => {
    const saved = await base44.entities.SavedArticle.list();
    setSavedIds(new Set(saved.map(s => s.title)));
  };

  const fetchNews = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Find the latest important cryptocurrency news and articles relevant to these assets: ${cryptos.join(', ')}. 
      
Return 8-10 real, recent news articles from reputable sources like CoinDesk, The Block, Decrypt, Bloomberg, Reuters, CoinTelegraph, Messari, or Bankless. 

For each article, provide:
- title: the actual headline
- source: the publication name
- summary: a brief 1-2 sentence summary
- asset_tag: the most relevant crypto ticker (BTC, ETH, SOL, etc.)
- url: the actual URL to the article (must be a real, working URL)
- time_ago: approximate time since publication (e.g. "2h ago", "5h ago", "1d ago")
- relevance: "high" or "medium"

Focus on market-moving stories, regulatory news, ecosystem developments, and macro events. Only include verified, factual news from reputable sources.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          articles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                source: { type: 'string' },
                summary: { type: 'string' },
                asset_tag: { type: 'string' },
                url: { type: 'string' },
                time_ago: { type: 'string' },
                relevance: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setArticles(result.articles || []);
    setLoading(false);
  };

  const handleSave = async (article) => {
    if (savedIds.has(article.title)) return;
    await base44.entities.SavedArticle.create({
      title: article.title,
      source: article.source,
      url: article.url,
      summary: article.summary,
      asset_tag: article.asset_tag,
    });
    setSavedIds(prev => new Set([...prev, article.title]));
  };

  const filtered = activeFilter === 'all'
    ? articles
    : articles.filter(a => a.asset_tag === activeFilter);

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">For You</h1>
          <p className="text-xs text-muted-foreground mt-0.5">News related to your assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNews}
            className="p-2 rounded-xl glass hover:border-white/10 transition-all"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 rounded-xl glass hover:border-white/10 transition-all">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'glass text-muted-foreground'
          }`}
        >
          ALL
        </button>
        {cryptos.map(symbol => (
          <CryptoChip
            key={symbol}
            symbol={symbol}
            selected={activeFilter === symbol}
            onClick={() => setActiveFilter(symbol === activeFilter ? 'all' : symbol)}
            size="sm"
          />
        ))}
      </div>

      <div className="flex gap-4 border-b border-border/50 pb-0">
        {['Top Stories', 'Latest'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab === 'Top Stories' ? 'top' : 'latest')}
            className={`pb-2.5 text-sm font-medium transition-all relative ${
              (tab === 'Top Stories' ? 'top' : 'latest') === activeTab
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {tab}
            {(tab === 'Top Stories' ? 'top' : 'latest') === activeTab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3 pb-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map((article, i) => (
            <ArticleCard
              key={i}
              article={article}
              onSave={handleSave}
              isSaved={savedIds.has(article.title)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No articles found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}