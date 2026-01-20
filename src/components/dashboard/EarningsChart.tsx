import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const EarningsChart = ({ data }: { data: any[] }) => {
  
  // Calculate Last 6 Months Data dynamically
  const chartData = useMemo(() => {
    const today = new Date();
    const months = [];
    
    // 1. Generate last 6 months labels (e.g., "Aug", "Sep"...)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      
      // 2. Sum earnings for this specific month/year
      const monthlyTotal = data
        .filter(item => {
           if (item.payment_status !== 'Paid') return false;
           // If no posting_date, fallback to created_at
           const itemDate = new Date(item.posting_date || item.created_at);
           return itemDate.getMonth() === d.getMonth() && itemDate.getFullYear() === year;
        })
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      months.push({ month: monthName, earnings: monthlyTotal });
    }
    return months;
  }, [data]);

  // Calculate current month's total for the big display
  const currentMonthEarnings = chartData[chartData.length - 1]?.earnings || 0;

  return (
    <div className="glass-card rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Monthly Earnings</h3>
          <p className="text-sm text-muted-foreground">Last 6 months overview</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">₹{currentMonthEarnings.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
             <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
             <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px hsl(var(--foreground) / 0.05)',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
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