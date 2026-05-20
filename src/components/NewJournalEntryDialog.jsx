import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const types = [
  { value: 'buy', label: 'Buy', color: '#10B981' },
  { value: 'sell', label: 'Sell', color: '#EF4444' },
  { value: 'note', label: 'Note', color: '#8B5CF6' },
  { value: 'idea', label: 'Idea', color: '#F59E0B' },
];

export default function NewJournalEntryDialog({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('buy');
  const [asset, setAsset] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!asset) return;
    setSaving(true);
    await base44.entities.JournalEntry.create({
      type,
      asset: asset.toUpperCase(),
      price: price ? parseFloat(price) : undefined,
      amount: amount ? parseFloat(amount) : undefined,
      date: new Date().toISOString().split('T')[0],
      notes: notes || undefined,
    });
    setSaving(false);
    setOpen(false);
    setType('buy');
    setAsset('');
    setPrice('');
    setAmount('');
    setNotes('');
    onAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Type</Label>
            <div className="flex gap-2">
              {types.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: type === t.value ? `${t.color}20` : 'transparent',
                    color: type === t.value ? t.color : 'hsl(215 16% 55%)',
                    border: type === t.value ? `1px solid ${t.color}40` : '1px solid transparent',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Asset</Label>
            <Input placeholder="e.g. BTC" value={asset} onChange={e => setAsset(e.target.value)} className="bg-muted border-border/50 mt-1" />
          </div>
          {(type === 'buy' || type === 'sell') && (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Price (USD)</Label>
                <Input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} className="bg-muted border-border/50 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="bg-muted border-border/50 mt-1" />
              </div>
            </>
          )}
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea placeholder="Your thoughts..." value={notes} onChange={e => setNotes(e.target.value)} className="bg-muted border-border/50 mt-1 min-h-[80px]" />
          </div>
          <Button onClick={handleSave} disabled={!asset || saving} className="w-full bg-primary hover:bg-primary/90">
            {saving ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}