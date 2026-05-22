import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AllocationChart from '@/components/AllocationChart';
import AddHoldingDialog from '@/components/AddHoldingDialog';
import { getCryptoColor } from '@/lib/cryptoData';

const COINGECKO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin', AVAX: 'avalanche-2',
  LINK: 'chainlink', MATIC: 'matic-network', DOT: 'polkadot', UNI: 'uniswap',
  ATOM: 'cosmos', LTC: 'litecoin', SHIB: 'shiba-inu', TRX: 'tron',
  TON: 'the-open-network', BCH: 'bitcoin-cash', NEAR: 'near', APT: 'aptos',
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(false);

  const loadHoldings = async () => {
    setLoading(true);
    const data = await base44.entities.PortfolioHolding.list();
    setHoldings(data);
    setLoading(false);
  };

  const fetchPrices = async (holdingsList) => {
    if (!holdingsList.length) return;
    setPricesLoading(true);
    const ids = [...new Set(holdingsList.map(h => COINGECKO_IDS[h.symbol]).filter(Boolean))].join(',');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await res.json();
    // Remap from coingecko id → symbol
    const mapped = {};
    for (const [sym, id] of Object.entries(COINGECKO_IDS)) {
      if (data[id]) mapped[sym] = data[id];
    }
    setPrices(mapped);
    setPricesLoading(false);
  };

  useEffect(() => { loadHoldings(); }, []);
  useEffect(() => { if (holdings.length) fetchPrices(holdings); }, [holdings]);

  const getLivePrice = (symbol) => prices[symbol]?.usd || 0;
  const get24hChange = (symbol) => prices[symbol]?.usd_24h_change || 0;
  const totalValue = holdings.reduce((sum, h) => sum + h.amount * getLivePrice(h.symbol), 0);
  const totalChange24h = holdings.reduce((sum, h) => {
    const val = h.amount * getLivePrice(h.symbol);
    return sum + val * (get24hChange(h.symbol) / 100);
  }, 0);

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
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground">Total Value (Live)</p>
          <button onClick={() => fetchPrices(holdings)} disabled={pricesLoading} className="text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${pricesLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center gap-1 mt-1">
          {totalChange24h >= 0
            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
          <span className={`text-xs font-medium ${totalChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalChange24h >= 0 ? '+' : ''}${totalChange24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} today
          </span>
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
                      ${(h.amount * getLivePrice(h.symbol)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <p className="text-xs text-muted-foreground">{h.amount} {h.symbol}</p>
                      {getLivePrice(h.symbol) > 0 && (
                        <span className={`text-[10px] font-medium ${get24hChange(h.symbol) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {get24hChange(h.symbol) >= 0 ? '+' : ''}{get24hChange(h.symbol).toFixed(2)}%
                        </span>
                      )}
                    </div>
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