import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const EarningsChart = ({ data }: { data: any[] }) => {
  
  const chartData = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      
      const monthlyTotal = data
        .filter(item => {
           if (item.payment_status !== 'Paid') return false;
           const itemDate = new Date(item.posting_date || item.created_at);
           return itemDate.getMonth() === d.getMonth() && itemDate.getFullYear() === year;
        })
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      months.push({ month: monthName, earnings: monthlyTotal });
    }
    return months;
  }, [data]);

  const currentMonthEarnings = chartData[chartData.length - 1]?.earnings || 0;

  return (
    <div className="glass-card rounded-lg md:rounded-xl p-4 md:p-5 h-full flex flex-col justify-between">
      <div className="flex flex-row items-end justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm md:text-base">Monthly Earnings</h3>
          <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-xl md:text-2xl font-bold text-foreground">₹{currentMonthEarnings.toLocaleString()}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">This month</p>
        </div>
      </div>
      
      <div className="h-40 sm:h-48 md:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              dy={10}
            />
             <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              width={45}
            />
             <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '12px',
                padding: '8px'
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
              labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};