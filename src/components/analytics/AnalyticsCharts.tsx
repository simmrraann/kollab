import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- COLORS ---
const COLORS = {
  paid: '#22c55e',   // Green
  pending: '#eab308', // Yellow
  delayed: '#ef4444', // Red
  primary: '#3b82f6', // Blue (for bars)
};

export const AnalyticsCharts = ({ data }: { data: any[] }) => {

  // 1. Calculate Monthly Earnings (Last 6 Months)
  const monthlyData = useMemo(() => {
    const today = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();

      // Sum only "Paid" amounts for this month
      const total = data
        .filter(item => {
          if (item.payment_status !== 'Paid') return false;
          const itemDate = new Date(item.posting_date || item.created_at);
          return itemDate.getMonth() === d.getMonth() && itemDate.getFullYear() === year;
        })
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      months.push({ name: monthName, value: total });
    }
    return months;
  }, [data]);

  // 2. Calculate Payment Status (Pie Chart)
  const pieData = useMemo(() => {
    const paid = data.filter(c => c.payment_status === 'Paid').length;
    const pending = data.filter(c => c.payment_status === 'Pending').length;
    const delayed = data.filter(c => c.payment_status === 'Delayed').length;

    // Only show segments that have data > 0
    return [
      { name: 'Paid', value: paid, color: COLORS.paid },
      { name: 'Pending', value: pending, color: COLORS.pending },
      { name: 'Delayed', value: delayed, color: COLORS.delayed },
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* --- CHART 1: Monthly Earnings --- */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-1">Monthly Earnings</h3>
        <p className="text-sm text-muted-foreground mb-6">Revenue over last 6 months</p>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(value) => `₹${value/1000}k`} 
              />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
              />
              <Bar 
                dataKey="value" 
                fill={COLORS.primary} 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 2: Payment Status --- */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-1">Payment Status</h3>
        <p className="text-sm text-muted-foreground mb-6">Pending vs Received vs Delayed</p>

        <div className="h-[300px] w-full flex items-center justify-center">
          {pieData.length === 0 ? (
             <div className="text-sm text-muted-foreground">No data to display yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [value, 'Collaborations']}
                   contentStyle={{ borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};