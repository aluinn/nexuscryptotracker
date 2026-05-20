import { getCryptoColor } from '@/lib/cryptoData';

export default function CryptoChip({ symbol, name, selected, onClick, size = 'md' }) {
  const color = getCryptoColor(symbol);
  const sizeClasses = size === 'lg'
    ? 'w-20 h-20'
    : size === 'sm'
    ? 'w-8 h-8'
    : 'w-12 h-12';

  const textSize = size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
        selected ? 'scale-105' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center font-bold ${textSize} transition-all duration-200`}
        style={{
          background: selected
            ? `linear-gradient(135deg, ${color}, ${color}88)`
            : `${color}20`,
          color: selected ? '#fff' : color,
          boxShadow: selected ? `0 0 20px ${color}40` : 'none',
          border: selected ? `2px solid ${color}` : '2px solid transparent',
        }}
      >
        {symbol}
      </div>
      {name && (
        <span className={`text-[10px] font-medium ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
          {name}
        </span>
      )}
    </button>
  );
}