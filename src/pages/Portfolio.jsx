import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AllocationChart from '@/components/AllocationChart';
import AddHoldingDialog from '@/components/AddHoldingDialog';
import { getCryptoColor } from '@/lib/cryptoData';

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHoldings = async () => {
    setLoading(true);
    const data = await base44.entities.PortfolioHolding.list();
    setHoldings(data);
    setLoading(false);
  };

  useEffect(() => { loadHoldings(); }, []);

  const totalValue = holdings.reduce((sum, h) => sum + h.amount * h.average_buy_price, 0);

  const handleDelete = async (id) => {
    await base44.entities.PortfolioHolding.delete(id);
    loadHoldings();
  };

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
        <button className="p-2 rounded-xl glass hover:border-white/10 transition-all">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="glass rounded-2xl p-5 glow-purple">
        <p className="text-xs text-muted-foreground mb-1">Total Value</p>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Portfolio tracked at buy price</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['1D', '7D', '1M', '3M', '1Y', 'ALL'].map(range => (
          <button
            key={range}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground glass hover:text-foreground transition-all flex-shrink-0"
          >
            {range}
          </button>
        ))}
      </div>

      <AllocationChart holdings={holdings} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Holdings</h3>
          <AddHoldingDialog onAdded={loadHoldings} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-4 h-16 skeleton-shimmer" />
            ))}
          </div>
        ) : holdings.length > 0 ? (
          <div className="space-y-2">
            {holdings.map(h => {
              const value = h.amount * h.average_buy_price;
              return (
                <div
                  key={h.id}
                  className="glass rounded-2xl p-4 flex items-center justify-between"
                  onClick={() => {}}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${getCryptoColor(h.symbol)}, ${getCryptoColor(h.symbol)}88)` }}
                    >
                      {h.symbol}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{h.asset_name}</p>
                      <p className="text-xs text-muted-foreground">{h.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{h.amount} {h.symbol}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-sm text-muted-foreground">No holdings yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your first asset to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}