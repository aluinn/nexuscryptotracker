import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getCryptoColor } from '@/lib/cryptoData';

export default function AllocationChart({ holdings }) {
  if (!holdings || holdings.length === 0) return null;

  const data = holdings.map(h => ({
    name: h.symbol,
    value: h.amount * h.average_buy_price,
    color: getCryptoColor(h.symbol),
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Allocation</h3>
      <div className="flex items-center gap-6">
        <div className="w-28 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={52}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-foreground font-medium">{item.name}</span>
              </div>
              <span className="text-muted-foreground">
                {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}