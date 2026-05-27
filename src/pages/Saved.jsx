import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/ArticleCard';

export default function Saved() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Articles');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  useEffect(() => {
    loadSaved();
  }, []);

  const FREE_SAVE_LIMIT = 20;

  const loadSaved = async () => {
    setLoading(true);
    const data = await base44.entities.SavedArticle.list('-created_date', 50);
    setArticles(data);
    setLoading(false);
  };

  const handleUnsave = async (article) => {
    const found = articles.find(a => a.title === article.title);
    if (found) {
      await base44.entities.SavedArticle.delete(found.id);
      loadSaved();
    }
  };

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.source?.toLowerCase().includes(search.toLowerCase()) ||
    a.asset_tag?.toLowerCase().includes(search.toLowerCase())
  );

  const collections = [...new Set(articles.map(a => a.collection).filter(Boolean))];

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Saved</h1>
        {user?.plan !== 'pro' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{Math.min(articles.length, FREE_SAVE_LIMIT)}/{FREE_SAVE_LIMIT}</span>
            <Link to="/pricing" className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-semibold text-primary">
              <Zap className="w-2.5 h-2.5" />
              Pro
            </Link>
          </div>
        )}
      </div>

      <div className="flex gap-4 border-b border-border/50">
        {['Articles', 'Collections'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 text-sm font-medium transition-all relative ${
              activeTab === tab ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search saved articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-muted border-border/50 rounded-xl"
        />
      </div>

      {activeTab === 'Articles' ? (
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 h-24 skeleton-shimmer" />
            ))
          ) : filtered.length > 0 ? (
            filtered.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onSave={handleUnsave}
                isSaved={true}
              />
            ))
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <p className="text-sm text-muted-foreground">No saved articles</p>
              <p className="text-xs text-muted-foreground mt-1">Save articles from your feed to build your library</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {collections.length > 0 ? (
            collections.map(col => (
              <div key={col} className="glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-foreground">{col}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {articles.filter(a => a.collection === col).length} articles
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <p className="text-sm text-muted-foreground">No collections yet</p>
              <p className="text-xs text-muted-foreground mt-1">Organize your saved articles into collections</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}