import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { CRYPTO_LIST } from '@/lib/cryptoData';
import CryptoChip from './CryptoChip';

export default function AddHoldingDialog({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selected || !amount) return;
    setSaving(true);
    await base44.entities.PortfolioHolding.create({
      asset_name: selected.name,
      symbol: selected.symbol,
      amount: parseFloat(amount),
      average_buy_price: 0,
    });
    setSaving(false);
    setOpen(false);
    setSelected(null);
    setAmount('');
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
          <div>
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted border-border/50 mt-1"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!selected || !amount || saving}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {saving ? 'Adding...' : 'Add to Portfolio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}