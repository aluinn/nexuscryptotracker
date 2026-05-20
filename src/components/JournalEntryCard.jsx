import { getCryptoColor } from '@/lib/cryptoData';
import moment from 'moment';

const typeConfig = {
  buy: { label: 'BUY', color: '#10B981' },
  sell: { label: 'SELL', color: '#EF4444' },
  note: { label: 'NOTE', color: '#8B5CF6' },
  idea: { label: 'IDEA', color: '#F59E0B' },
};

export default function JournalEntryCard({ entry }) {
  const config = typeConfig[entry.type] || typeConfig.note;

  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {moment(entry.date).format('MMM D, YYYY')}
          </span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${config.color}20`,
            color: config.color,
          }}
        >
          {config.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${getCryptoColor(entry.asset)}15`,
              color: getCryptoColor(entry.asset),
            }}
          >
            {entry.asset}
          </span>
          {entry.price && (
            <span className="text-sm font-semibold text-foreground">
              @ ${entry.price?.toLocaleString()}
            </span>
          )}
        </div>
        {entry.amount && (
          <span className="text-xs text-muted-foreground">
            Size: {entry.amount}
          </span>
        )}
      </div>

      {entry.notes && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {entry.notes}
        </p>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {entry.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}