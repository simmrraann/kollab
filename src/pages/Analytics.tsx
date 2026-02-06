import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    uniqueBrands: 0,
    avgPerCollab: 0,
    completionRate: 0
  });
  const [allCollabs, setAllCollabs] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: collabs } = await supabase
        .from('collaborations')
        .select('*');

      const items = collabs || [];
      setAllCollabs(items);

      // --- CALCULATIONS ---
      
      // 1. Total Earnings (Paid Only)
      const paidItems = items.filter(c => c.payment_status === 'Paid');
      const totalEarnings = paidItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // 2. Unique Brands
      const uniqueBrands = new Set(items.map(c => c.brand_name?.toLowerCase().trim())).size;

      // 3. Avg per Collab
      const avgPerCollab = paidItems.length > 0 ? Math.round(totalEarnings / paidItems.length) : 0;

      // 4. Completion Rate
      const completionRate = items.length > 0 
        ? Math.round((paidItems.length / items.length) * 100) 
        : 0;

      setStats({
        totalEarnings,
        uniqueBrands,
        avgPerCollab,
        completionRate
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Analytics" subtitle="Deep dive into your collaboration performance.">
      <div className="space-y-6">
        
        {/* 1. Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            subtitle="Lifetime earnings"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Brand Partners"
            value={stats.uniqueBrands}
            subtitle="Unique brands"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Avg. Per Collab"
            value={`₹${stats.avgPerCollab.toLocaleString()}`}
            subtitle="Based on paid collabs"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle="Paid vs Total"
            icon={<Target className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* 2. Charts Section (Full Width - No Sidebar) */}
        <AnalyticsCharts data={allCollabs} />

      </div>
    </AppLayout>
  );
};

export default Analytics;