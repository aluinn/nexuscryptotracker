import { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import AlertCard from '@/components/AlertCard';
import { RefreshCw } from 'lucide-react';

const tabs = ['All', 'Alerts', 'News', 'System'];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const pullStartY = useRef(null);
  const containerRef = useRef(null);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await base44.functions.invoke('generateAlerts', {});
    await loadAlerts();
    setRefreshing(false);
  }, [refreshing]);

  // Pull-to-refresh touch handlers
  const onTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const onTouchEnd = (e) => {
    if (pullStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - pullStartY.current;
    if (delta > 60) handleRefresh();
    pullStartY.current = null;
  };

  useEffect(() => {
    initAlerts();
  }, []);

  const initAlerts = async () => {
    setLoading(true);
    await base44.functions.invoke('generateAlerts', {});
    const data = await base44.entities.Alert.list('-created_date', 50);
    setAlerts(data);
    setLoading(false);
  };

  const loadAlerts = async () => {
    setLoading(true);
    const data = await base44.entities.Alert.list('-created_date', 50);
    setAlerts(data);
    setLoading(false);
  };

  const filtered = activeTab === 'All'
    ? alerts
    : activeTab === 'Alerts'
    ? alerts.filter(a => ['high_impact', 'price_alert', 'whale_alert'].includes(a.type))
    : activeTab === 'News'
    ? alerts.filter(a => a.type === 'news' || a.type === 'new_listing')
    : alerts.filter(a => a.type === 'system');

  return (
    <div ref={containerRef} className="px-4 pt-6 space-y-5" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-2 rounded-xl glass hover:border-white/10 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing || loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 h-20 skeleton-shimmer" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">You'll receive personalized alerts based on your assets</p>
          </div>
        )}
      </div>
    </div>
  );
}