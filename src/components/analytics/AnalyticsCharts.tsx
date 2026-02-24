import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Instagram, Youtube, Globe, Smartphone } from 'lucide-react';

export const AnalyticsCharts = ({ data }: { data: any[] }) => {
  const { mode } = useTheme();
  
  // Theme Variables
  const getVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const primaryColor = `hsl(${getVar('--primary')})`;
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
      { name: 'Pending', value: pending, color: '#eab308' },
      { name: 'Delayed', value: delayed, color: '#ef4444' },
    ].filter(i => i.value > 0);
  }, [data, primaryColor]);

  // Platform Stats Calculation
  const platformStats = useMemo(() => {
      const totals = data.reduce((acc: any, item: any) => {
          if (item.payment_status === 'Paid') {
            const p = item.platform || 'Other';
            acc[p] = (acc[p] || 0) + Number(item.amount);
          }
          return acc;
      }, {});
      const totalPaid = Object.values(totals).reduce((a: any, b: any) => a + b, 0) as number;
      return Object.entries(totals)
        .map(([name, amount]: any) => ({
            name,
            amount,
            percentage: totalPaid > 0 ? Math.round((amount / totalPaid) * 100) : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 4);
  }, [data]);

  const getPlatformIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (n.includes('youtube')) return <Youtube className="w-4 h-4 text-red-600" />;
    if (n.includes('tiktok')) return <Smartphone className="w-4 h-4 text-foreground" />;
    return <Globe className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TOP ROW: Revenue Trend & Paid vs Pending */}
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
                 <Tooltip contentStyle={{backgroundColor: mode === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: '1px solid #334155'}} />
                 <Area type="monotone" dataKey="paid" stroke={primaryColor} fillOpacity={1} fill="url(#colorPaid)" strokeWidth={3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

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
                 <Bar dataKey="paid" name="Paid" fill={primaryColor} radius={[4, 4, 0, 0]} />
                 <Bar dataKey="pending" name="Pending" fill={mode === 'dark' ? '#475569' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* BOTTOM ROW: Revenue by Platform (Left) + Donut (Right) */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           
           {/* LEFT: Revenue List */}
           <div>
               <h3 className="font-bold text-lg mb-6">Revenue by Platform</h3>
               <div className="space-y-5">
                   {platformStats.length === 0 ? (
                       <p className="text-muted-foreground text-sm">No revenue data available yet.</p>
                   ) : (
                       platformStats.map((p) => (
                           <div key={p.name} className="space-y-2">
                               <div className="flex justify-between text-sm">
                                   <div className="flex items-center gap-2 font-medium">
                                       {getPlatformIcon(p.name)}
                                       <span className="capitalize">{p.name}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <span className="font-bold">₹{p.amount.toLocaleString()}</span>
                                       <span className="text-xs text-muted-foreground">({p.percentage}%)</span>
                                   </div>
                               </div>
                               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                   <div 
                                       className="h-full bg-primary rounded-full transition-all duration-1000" 
                                       style={{ width: `${p.percentage}%`, opacity: 0.8 }} 
                                   />
                               </div>
                           </div>
                       ))
                   )}
               </div>
           </div>

           {/* RIGHT: Donut Chart */}
           <div className="h-[250px] w-full flex justify-center items-center relative">
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
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                 <div className="text-center">
                     <span className="text-2xl font-bold">{data.length}</span>
                     <p className="text-xs text-muted-foreground">Total Deals</p>
                 </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};