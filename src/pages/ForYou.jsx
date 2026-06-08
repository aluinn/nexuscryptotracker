import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/ArticleCard';
import { toast } from 'sonner';
import CryptoChip from '@/components/CryptoChip';
import SkeletonCard from '@/components/SkeletonCard';

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() / 1000) - timestamp);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ForYou() {
  const { user } = useOutletContext();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('top');
  const [savedIds, setSavedIds] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(6);

  const cryptos = user?.selected_cryptos || ['BTC', 'ETH'];

  useEffect(() => {
    fetchNews();
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const saved = await base44.entities.SavedArticle.list();
      setSavedIds(new Set(saved.map(s => s.title)));
    } catch (e) { /* ignore */ }
  };

  const RSS_SOURCES = [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss' },
    { name: 'Decrypt', url: 'https://decrypt.co/feed' },
    { name: 'The Block', url: 'https://www.theblock.co/rss.xml' },
    { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/.rss/full/' },
    { name: 'The Defiant', url: 'https://thedefiant.io/feed' },
    { name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/' },
    { name: 'BeInCrypto', url: 'https://beincrypto.com/feed/' },
    { name: 'CryptoBriefing', url: 'https://cryptobriefing.com/feed/' },
  ];

  const SYMBOL_KEYWORDS = {
    BTC: ['bitcoin', 'btc'],
    ETH: ['ethereum', 'eth', 'ether'],
    SOL: ['solana', 'sol'],
    BNB: ['bnb', 'binance'],
    XRP: ['xrp', 'ripple'],
    ADA: ['cardano', 'ada'],
    DOGE: ['dogecoin', 'doge'],
    AVAX: ['avalanche', 'avax'],
    LINK: ['chainlink', 'link'],
    MATIC: ['polygon', 'matic'],
    DOT: ['polkadot', 'dot'],
  };

  const detectAssetTag = (text) => {
    const lower = (text || '').toLowerCase();
    for (const [symbol, keywords] of Object.entries(SYMBOL_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) return symbol;
    }
    return 'CRYPTO';
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        RSS_SOURCES.map(source =>
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=10`)
            .then(r => r.json())
            .then(data => (data.items || []).map(item => ({
              title: item.title,
              source: source.name,
              summary: item.description?.replace(/<[^>]*>/g, '').slice(0, 160) + '…',
              asset_tag: detectAssetTag(item.title + ' ' + item.description),
              url: item.link,
              time_ago: timeAgo(Math.floor(new Date(item.pubDate).getTime() / 1000)),
              pubDate: new Date(item.pubDate).getTime(),
            })))
        )
      );
      const all = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .sort(() => Math.random() - 0.5)
        .slice(0, 80);
      setArticles(all);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const FREE_SAVE_LIMIT = 20;

  const handleSave = async (article) => {
    if (savedIds.has(article.title)) return;
    const isPro = user?.plan === 'pro';
    if (!isPro && savedIds.size >= FREE_SAVE_LIMIT) {
      toast.error(`Free plan limit reached (${FREE_SAVE_LIMIT} articles). Upgrade to Pro for unlimited saves.`);
      return;
    }
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
  const visible = filtered.slice(0, visibleCount);

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
        ) : visible.length > 0 ? (
          <>
            {visible.map((article, i) => (
              <ArticleCard
                key={i}
                article={article}
                onSave={handleSave}
                isSaved={savedIds.has(article.title)}
              />
            ))}
            {visibleCount < filtered.length && (
              <button
                onClick={() => setVisibleCount(v => v + 6)}
                className="w-full py-3 rounded-2xl glass text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/10 transition-all"
              >
                Load more articles
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No articles found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}