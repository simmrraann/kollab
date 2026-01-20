import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentCollaborations } from '@/components/dashboard/RecentCollaborations';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { Briefcase, Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCount: 0,
    upcomingCount: 0,
    pendingAmount: 0,
    delayedCount: 0,
    completedCount: 0,
  });
  
  // We will pass this raw data to the charts/lists later
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

      // --- CALCULATE STATS ---
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      // 1. Active: Anything not Paid (assuming Paid = Done)
      const activeCount = items.filter(c => c.payment_status !== 'Paid').length;

      // 2. Completed: Paid items
      const completedCount = items.filter(c => c.payment_status === 'Paid').length;

      // 3. Delayed: Explicitly marked 'Delayed'
      const delayedCount = items.filter(c => c.payment_status === 'Delayed').length;

      // 4. Pending Money: Sum of 'Pending' amounts
      const pendingAmount = items
        .filter(c => c.payment_status === 'Pending')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // 5. Upcoming: Posting date is within next 7 days
      const upcomingCount = items.filter(c => {
        if (!c.posting_date) return false;
        const pDate = new Date(c.posting_date);
        return pDate >= now && pDate <= nextWeek;
      }).length;

      setStats({
        activeCount,
        upcomingCount,
        pendingAmount,
        delayedCount,
        completedCount
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Dashboard" subtitle="Welcome back! Here's your collaboration overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Active Collaborations"
          value={stats.activeCount}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-5 h-5" />}
        />

        <StatsCard
          title="Upcoming Deadlines"
          value={stats.upcomingCount}
          subtitle="Next 7 days"
          icon={<Clock className="w-5 h-5" />}
          variant={stats.upcomingCount > 0 ? "warning" : "default"}
        />

        <StatsCard
          title="Pending Payments"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
          subtitle="Invoices pending"
          icon={<DollarSign className="w-5 h-5" />}
        />

        <StatsCard
          title="Delayed Payments"
          value={stats.delayedCount}
          subtitle="Needs follow-up"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={stats.delayedCount > 0 ? "danger" : "default"}
        />

        <StatsCard
          title="Completed"
          value={stats.completedCount}
          subtitle="Total paid collabs"
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* We pass the real data down as props (we will update these components next) */}
          <EarningsChart data={allCollabs} />
          <RecentCollaborations data={allCollabs} />
        </div>

        <div>
          <UpcomingDeadlines data={allCollabs} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;