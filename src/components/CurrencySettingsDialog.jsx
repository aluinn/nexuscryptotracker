import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { CURRENCIES, getDefaultCurrency, saveCurrency } from '@/lib/currencies';

export default function CurrencySettingsDialog({ onChanged }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(getDefaultCurrency());

  const handleSelect = (code) => {
    setSelected(code);
    saveCurrency(code);
    onChanged?.(code);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-xl glass hover:border-white/10 transition-all">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50 max-w-sm max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground">Display Currency</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">Choose your preferred fiat currency for portfolio values.</p>
        <div className="overflow-y-auto space-y-1 mt-2">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                selected === c.code
                  ? 'bg-primary/20 border border-primary/30 text-primary'
                  : 'hover:bg-white/5 text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-bold text-sm">{c.symbol}</span>
                <div>
                  <p className="text-sm font-medium">{c.code}</p>
                  <p className="text-xs text-muted-foreground">{c.name}</p>
                </div>
              </div>
              {selected === c.code && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}