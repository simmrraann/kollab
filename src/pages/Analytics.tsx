import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const Analytics = () => {
  return (
    <AppLayout title="Analytics" subtitle="Deep dive into your collaboration performance.">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Earnings"
            value="$117.3k"
            subtitle="Last 6 months"
            icon={<DollarSign className="w-5 h-5" />}
            trend={{ value: 32, isPositive: true }}
          />
          <StatsCard
            title="Brand Partners"
            value={18}
            subtitle="Unique brands"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Avg. Per Collab"
            value="$3.4k"
            subtitle="Average earnings"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Completion Rate"
            value="94%"
            subtitle="On-time delivery"
            icon={<Target className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* Charts */}
        <AnalyticsCharts />
      </div>
    </AppLayout>
  );
};

export default Analytics;
