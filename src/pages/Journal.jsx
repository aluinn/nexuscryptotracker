import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import JournalEntryCard from '@/components/JournalEntryCard';
import NewJournalEntryDialog from '@/components/NewJournalEntryDialog';

const tabs = ['All', 'Trades', 'Notes', 'Ideas'];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const loadEntries = async () => {
    setLoading(true);
    const data = await base44.entities.JournalEntry.list('-created_date', 50);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, []);

  const filtered = activeTab === 'All'
    ? entries
    : activeTab === 'Trades'
    ? entries.filter(e => e.type === 'buy' || e.type === 'sell')
    : activeTab === 'Notes'
    ? entries.filter(e => e.type === 'note')
    : entries.filter(e => e.type === 'idea');

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Trade Journal</h1>
        <NewJournalEntryDialog onAdded={loadEntries} />
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
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 h-24 skeleton-shimmer" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-sm text-muted-foreground">No entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start journaling your trades and research</p>
          </div>
        )}
      </div>
    </div>
  );
}