import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentCollaborations } from '@/components/dashboard/RecentCollaborations';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { Briefcase, Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';

const Index = () => {
  return (
    <AppLayout title="Dashboard" subtitle="Welcome back! Here's your collaboration overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Active Collaborations"
          value={8}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={5}
          subtitle="Next 7 days"
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
        <StatsCard
          title="Pending Payments"
<<<<<<< HEAD
          value="$18.3k"
=======
          value="₹18,300"
>>>>>>> 6ab6321 (inital kollab setup with Supabase Backend)
          subtitle="6 invoices pending"
          icon={<DollarSign className="w-5 h-5" />}
          variant="default"
        />
        <StatsCard
          title="Delayed Payments"
          value={3}
          subtitle="Needs follow-up"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="danger"
        />
        <StatsCard
          title="Completed"
          value={24}
          subtitle="This quarter"
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart + Recent */}
        <div className="lg:col-span-2 space-y-6">
          <EarningsChart />
          <RecentCollaborations />
        </div>

        {/* Right Column - Deadlines */}
        <div>
          <UpcomingDeadlines />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
