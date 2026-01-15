import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

// Monthly earnings data
const monthlyData = [
  { month: 'Aug', earnings: 12400, collabs: 4 },
  { month: 'Sep', earnings: 15800, collabs: 5 },
  { month: 'Oct', earnings: 18200, collabs: 6 },
  { month: 'Nov', earnings: 22500, collabs: 7 },
  { month: 'Dec', earnings: 19800, collabs: 5 },
  { month: 'Jan', earnings: 28600, collabs: 8 },
];

// Payment status data
const paymentStatusData = [
  { name: 'Paid', value: 45600, count: 12 },
  { name: 'Pending', value: 18300, count: 6 },
  { name: 'Delayed', value: 8200, count: 3 },
];

// Brand distribution
const brandData = [
  { brand: 'Glossier', amount: 8500 },
  { brand: 'Nike', amount: 16000 },
  { brand: 'Notion', amount: 5400 },
  { brand: 'Skillshare', amount: 10500 },
  { brand: 'Figma', amount: 6600 },
  { brand: 'Adobe', amount: 12000 },
];

// Payment delay patterns
const delayPatternData = [
  { month: 'Aug', onTime: 3, delayed: 1 },
  { month: 'Sep', onTime: 4, delayed: 1 },
  { month: 'Oct', onTime: 5, delayed: 1 },
  { month: 'Nov', onTime: 5, delayed: 2 },
  { month: 'Dec', onTime: 4, delayed: 1 },
  { month: 'Jan', onTime: 6, delayed: 2 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 12px hsl(var(--foreground) / 0.05)',
};

export const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Earnings Bar Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Monthly Earnings</h3>
        <p className="text-sm text-muted-foreground mb-4">Revenue over the last 6 months</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
              />
              <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status Pie Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Payment Status</h3>
        <p className="text-sm text-muted-foreground mb-4">Pending vs received payments</p>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brand Distribution */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Top Brands</h3>
        <p className="text-sm text-muted-foreground mb-4">Earnings by brand partner</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="brand"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                width={70}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
              />
              <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Delay Patterns */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Payment Patterns</h3>
        <p className="text-sm text-muted-foreground mb-4">On-time vs delayed payments</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={delayPatternData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground capitalize">{value === 'onTime' ? 'On Time' : value}</span>}
              />
              <Line
                type="monotone"
                dataKey="onTime"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="delayed"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
