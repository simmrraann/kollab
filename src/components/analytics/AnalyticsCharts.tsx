import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export const AnalyticsCharts = ({ data }: { data: any[] }) => {
  const { mode } = useTheme();
  
  // Use CSS Variables so charts follow the theme automatically
  const getVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const primaryColor = `hsl(${getVar('--primary')})`;
  const secondaryColor = `hsl(${getVar('--muted')})`; 
  const textColor = mode === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = mode === 'dark' ? '#334155' : '#e2e8f0';

  // --- DATA PROCESSING ---
  const monthlyData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      
      const paid = data.filter(item => {
          if (item.payment_status !== 'Paid') return false;
          const itemDate = new Date(item.posting_date || item.created_at);
          return itemDate.getMonth() === d.getMonth() && itemDate.getFullYear() === year;
      }).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      
      const pending = data.filter(item => {
          if (item.payment_status !== 'Pending') return false;
          const itemDate = new Date(item.posting_date || item.created_at);
          return itemDate.getMonth() === d.getMonth() && itemDate.getFullYear() === year;
      }).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      months.push({ name: monthName, paid, pending });
    }
    return months;
  }, [data]);

  const pieData = useMemo(() => {
    const paid = data.filter(c => c.payment_status === 'Paid').length;
    const pending = data.filter(c => c.payment_status === 'Pending').length;
    const delayed = data.filter(c => c.payment_status === 'Delayed').length;
    return [
      { name: 'Paid', value: paid, color: primaryColor },
      { name: 'Pending', value: pending, color: '#eab308' }, // Yellow fixed for warning
      { name: 'Delayed', value: delayed, color: '#ef4444' }, // Red fixed for danger
    ].filter(i => i.value > 0);
  }, [data, primaryColor]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: CLEAN Area Chart */}
        <div className="glass-card p-6 rounded-2xl">
           <h3 className="font-bold text-lg mb-4">Revenue Trend</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={monthlyData}>
                 <defs>
                   <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                 <XAxis dataKey="name" tick={{fill: textColor}} axisLine={false} tickLine={false} />
                 <YAxis tick={{fill: textColor}} axisLine={false} tickLine={false} tickFormatter={(val)=>`₹${val/1000}k`}/>
                 <Tooltip 
                    contentStyle={{backgroundColor: mode === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: '1px solid #334155'}} 
                 />
                 <Area type="monotone" dataKey="paid" stroke={primaryColor} fillOpacity={1} fill="url(#colorPaid)" strokeWidth={3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* CHART 2: CLEAN Bar Chart (Side by Side) */}
        <div className="glass-card p-6 rounded-2xl">
           <h3 className="font-bold text-lg mb-4">Paid vs Pending</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={monthlyData} barGap={4}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                 <XAxis dataKey="name" tick={{fill: textColor}} axisLine={false} tickLine={false} />
                 <YAxis tick={{fill: textColor}} axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{backgroundColor: mode === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px'}} />
                 <Legend />
                 {/* Primary Theme Color for Paid */}
                 <Bar dataKey="paid" name="Paid" fill={primaryColor} radius={[4, 4, 0, 0]} />
                 {/* Grey/Muted for Pending to differentiate */}
                 <Bar dataKey="pending" name="Pending" fill={mode === 'dark' ? '#475569' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* CHART 3: Donut Chart */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 flex flex-col md:flex-row items-center justify-around">
           <div className="mb-6 md:mb-0">
               <h3 className="font-bold text-lg mb-2">Payment Status</h3>
               <p className="text-sm text-muted-foreground">Distribution of your payments</p>
           </div>
           <div className="h-[250px] w-[300px]">
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
                     <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};