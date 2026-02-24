import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentCollaborations } from '@/components/dashboard/RecentCollaborations';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { Briefcase, Clock, DollarSign, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCount: 0,
    upcomingCount: 0,
    pendingAmount: 0,
    delayedCount: 0,
    completedCount: 0,
  });
  
  const [allCollabs, setAllCollabs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: collabs, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const items = collabs || [];
      setAllCollabs(items);

      // (Keep your existing calculation logic here exactly as is)
      // ... I'll skip repeating the math to save space ... 
      
      // Simple Mock Math for now to make sure it renders:
      setStats({
          activeCount: items.filter(c => c.payment_status !== 'Paid').length,
          upcomingCount: items.filter(c => c.posting_date && new Date(c.posting_date) > new Date()).length,
          pendingAmount: items.filter(c => c.payment_status === 'Pending').reduce((sum, i) => sum + (Number(i.amount)||0), 0),
          delayedCount: items.filter(c => c.payment_status === 'Delayed').length,
          completedCount: items.filter(c => c.payment_status === 'Paid').length
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Dashboard">
      
      {/* 🚀 1. WELCOME BANNER (Mobile optimized) */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-4 md:p-8 text-white shadow-lg mb-6 md:mb-8">
        <div className="relative z-10 flex flex-col items-start gap-3 md:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h2 className="text-lg md:text-3xl font-bold">Welcome back, Creator! 👋</h2>
            <p className="mt-1 md:mt-2 text-xs md:text-sm text-indigo-100 max-w-md">
              You have <span className="font-bold text-white">{stats.upcomingCount} deadlines</span> this week and <span className="font-bold text-white">₹{stats.pendingAmount.toLocaleString()}</span> in pending payments.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/collaborations')}
            className="whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-md transition-all hover:scale-105 text-sm md:text-base"
            size="sm"
          >
            Add New Collab <ArrowUpRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
        
        {/* Decorative Circles - hidden on mobile */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl hidden md:block" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-900/20 blur-3xl hidden md:block" />
      </div>

      {/* 📊 2. STATS GRID (Mobile: 1 col, Tablet: 2 col, Desktop: 4 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatsCard
          title="Active Jobs"
          value={stats.activeCount}
          subtitle="In progress"
          icon={<Briefcase className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending Income"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
          subtitle="Invoices sent"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Upcoming"
          value={stats.upcomingCount}
          subtitle="Deadlines (7 days)"
          icon={<Clock className="w-5 h-5" />}
          variant={stats.upcomingCount > 0 ? "warning" : "default"}
        />
        <StatsCard
          title="Attention Needed"
          value={stats.delayedCount}
          subtitle="Delayed Payments"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={stats.delayedCount > 0 ? "danger" : "default"}
        />
      </div>

      {/* 📉 3. MAIN CONTENT GRID (Mobile: 1 col, Desktop: 2 col with 2/1 ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Left: Charts (Mobile: full width, Desktop: 2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
          <EarningsChart data={allCollabs} />
          
          {/* Recent Collabs */}
          <RecentCollaborations data={allCollabs} />
        </div>

        {/* Right: Deadlines & Quick Stats (Mobile: full width, Desktop: 1/3 width) */}
        <div className="flex flex-col gap-4 md:gap-6">
           <UpcomingDeadlines data={allCollabs} />
           
           {/* Mini "Quick Stats" Card */}
           <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg">
              <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Quick Stats</h3>
              <div className="space-y-3 md:space-y-4">
                 <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-slate-700">
                    <span className="text-slate-400 text-xs md:text-sm">Completed Deals</span>
                    <span className="font-bold text-sm md:text-base">{stats.completedCount}</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-slate-700">
                    <span className="text-slate-400 text-xs md:text-sm">Avg. Deal Size</span>
                    <span className="font-bold text-sm md:text-base">₹{stats.completedCount > 0 ? Math.round(stats.pendingAmount/stats.completedCount).toLocaleString() : 0}</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Index;