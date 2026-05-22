import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { CRYPTO_LIST } from '@/lib/cryptoData';
import { CURRENCIES, getDefaultCurrency } from '@/lib/currencies';
import CryptoChip from './CryptoChip';

const COINGECKO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin', AVAX: 'avalanche-2',
  LINK: 'chainlink', MATIC: 'matic-network', DOT: 'polkadot', UNI: 'uniswap',
  ATOM: 'cosmos', LTC: 'litecoin', AAVE: 'aave', ARB: 'arbitrum',
  OP: 'optimism', NEAR: 'near', APT: 'aptos', SUI: 'sui', FIL: 'filecoin',
};

export default function AddHoldingDialog({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency] = useState(getDefaultCurrency());
  const [livePrice, setLivePrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  useEffect(() => {
    if (selected && open) fetchLivePrice(selected.symbol, currency);
  }, [selected, currency, open]);

  const fetchLivePrice = async (symbol, curr) => {
    const id = COINGECKO_IDS[symbol];
    if (!id) return;
    setPriceLoading(true);
    setLivePrice(null);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${curr.toLowerCase()}`
    );
    const data = await res.json();
    setLivePrice(data[id]?.[curr.toLowerCase()] || null);
    setPriceLoading(false);
  };

  const cryptoAmount = livePrice && fiatAmount ? parseFloat(fiatAmount) / livePrice : null;

  const handleSave = async () => {
    if (!selected || !fiatAmount || !cryptoAmount) return;
    setSaving(true);
    await base44.entities.PortfolioHolding.create({
      asset_name: selected.name,
      symbol: selected.symbol,
      amount: cryptoAmount,
      average_buy_price: livePrice || 0,
      fiat_paid: parseFloat(fiatAmount),
      fiat_currency: currency,
    });
    setSaving(false);
    setOpen(false);
    setSelected(null);
    setFiatAmount('');
    setLivePrice(null);
    onAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30 border-0">
          <Plus className="w-4 h-4 mr-1" /> Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Holding</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">

          {/* Asset selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Select Asset</Label>
            <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto">
              {CRYPTO_LIST.map(c => (
                <CryptoChip
                  key={c.symbol}
                  symbol={c.symbol}
                  selected={selected?.symbol === c.symbol}
                  onClick={() => setSelected(c)}
                  size="sm"
                />
              ))}
            </div>
          </div>



          {/* Fiat amount input */}
          <div>
            <Label className="text-xs text-muted-foreground">Amount Paid ({currency})</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                {currencyInfo.symbol}
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="bg-muted border-border/50 pl-8"
              />
            </div>
          </div>

          {/* Live price + conversion preview */}
          {selected && (
            <div className="glass rounded-xl p-3 space-y-1">
              {priceLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" /> Fetching live price…
                </div>
              ) : livePrice ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    1 {selected.symbol} = {currencyInfo.symbol}{livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
                  </p>
                  {cryptoAmount && (
                    <p className="text-sm font-semibold text-foreground">
                      ≈ {cryptoAmount < 0.001
                        ? cryptoAmount.toExponential(4)
                        : cryptoAmount.toFixed(6)} {selected.symbol}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Price unavailable for {selected.symbol}</p>
              )}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={!selected || !fiatAmount || !cryptoAmount || saving}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {saving ? 'Adding…' : 'Add to Portfolio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}