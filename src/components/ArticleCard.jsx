import { Globe, Bookmark, BookmarkCheck, ExternalLink, Clock } from 'lucide-react';
import { getCryptoColor } from '@/lib/cryptoData';

export default function ArticleCard({ article, onSave, isSaved }) {
  return (
    <div className="glass rounded-2xl p-4 space-y-3 transition-all duration-200 hover:border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">{article.source}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-[11px]">{article.time_ago || 'recently'}</span>
        </div>
      </div>

      <h3 className="font-semibold text-sm leading-snug text-foreground">
        {article.title}
      </h3>

      {article.summary && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {article.asset_tag && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${getCryptoColor(article.asset_tag)}15`,
                color: getCryptoColor(article.asset_tag),
              }}
            >
              {article.asset_tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {onSave && (
            <button
              onClick={() => onSave(article)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-primary"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}