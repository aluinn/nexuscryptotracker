import { Newspaper, TrendingUp, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const typeIcons = {
  top_stories: { icon: Newspaper, color: '#8B5CF6' },
  portfolio: { icon: TrendingUp, color: '#F59E0B' },
  system: { icon: Settings, color: '#6B7280' },
};

const navTargets = {
  top_stories: '/',
  portfolio: '/portfolio',
};

export default function AlertCard({ alert }) {
  const config = typeIcons[alert.type] || typeIcons.system;
  const Icon = config.icon;
  const navigate = useNavigate();
  const target = navTargets[alert.type];

  return (
    <div
      onClick={target ? () => navigate(target) : undefined}
      className={`glass rounded-2xl p-4 transition-all duration-200 ${alert.is_read ? 'opacity-60' : ''} ${target ? 'cursor-pointer hover:border-white/10 active:scale-[0.99]' : ''}`}
    >
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