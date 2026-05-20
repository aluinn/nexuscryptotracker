import { Zap, TrendingUp, Globe, Bell, AlertCircle, Settings } from 'lucide-react';
import moment from 'moment';

const typeIcons = {
  high_impact: { icon: Zap, color: '#EF4444' },
  price_alert: { icon: TrendingUp, color: '#F59E0B' },
  news: { icon: Globe, color: '#8B5CF6' },
  new_listing: { icon: Bell, color: '#10B981' },
  whale_alert: { icon: AlertCircle, color: '#3B82F6' },
  system: { icon: Settings, color: '#6B7280' },
};

export default function AlertCard({ alert }) {
  const config = typeIcons[alert.type] || typeIcons.system;
  const Icon = config.icon;

  return (
    <div className={`glass rounded-2xl p-4 transition-all duration-200 ${alert.is_read ? 'opacity-60' : ''}`}>
      <div className="flex gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-tight">{alert.title}</h4>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {moment(alert.created_date).fromNow()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
          {alert.asset_tag && (
            <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {alert.asset_tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}