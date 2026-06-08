import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { getCryptoColor } from '@/lib/cryptoData';

export default function SwipeableHoldingCard({ holding, livePrice, change24h, currencyInfo, onDelete }) {
  const [offsetX, setOffsetX] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(null);

  const THRESHOLD = 80;

  const startDrag = (clientX) => {
    startX.current = clientX;
    setDragging(true);
  };

  const moveDrag = (clientX) => {
    if (startX.current === null) return;
    const delta = clientX - startX.current;
    if (delta < 0) setOffsetX(Math.max(delta, -120));
  };

  const endDrag = (currentOffset) => {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (currentOffset < -THRESHOLD) {
      setOffsetX(-100);
      setConfirming(true);
    } else {
      setOffsetX(0);
      setConfirming(false);
    }
  };

  // Touch handlers
  const onTouchStart = (e) => startDrag(e.touches[0].clientX);
  const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
  const onTouchEnd = () => endDrag(offsetX);

  // Mouse handlers
  const onMouseDown = (e) => startDrag(e.clientX);
  const onMouseMove = (e) => moveDrag(e.clientX);
  const onMouseUp = () => endDrag(offsetX);
  const onMouseLeave = () => { if (startX.current !== null) endDrag(offsetX); };

  const handleCancel = () => {
    setOffsetX(0);
    setConfirming(false);
  };

  const currentValue = holding.amount * livePrice;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <div className="absolute inset-0 flex items-center justify-end pr-5 bg-red-500/20 rounded-2xl">
        <Trash2 className="w-5 h-5 text-red-400" />
      </div>

      {/* Card */}
      <div
        className="glass rounded-2xl p-4 flex items-center justify-between relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? 'none' : 'transform 0.2s ease',
          userSelect: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${getCryptoColor(holding.symbol)}, ${getCryptoColor(holding.symbol)}88)` }}
          >
            {holding.symbol}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{holding.asset_name}</p>
            <p className="text-xs text-muted-foreground">{holding.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {currencyInfo.symbol}{currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-end gap-1">
            <p className="text-xs text-muted-foreground">{holding.amount} {holding.symbol}</p>
            {livePrice > 0 && (
              <span className={`text-[10px] font-medium ${change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Confirm overlay */}
      {confirming && (
        <div className="absolute inset-0 flex items-center justify-between px-4 bg-card/95 backdrop-blur-sm rounded-2xl border border-red-500/30 z-10">
          <p className="text-sm text-foreground font-medium">Remove <span className="text-primary">{holding.symbol}</span>?</p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-xl text-xs font-medium glass text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(holding.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}