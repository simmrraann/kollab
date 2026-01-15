import { AppLayout } from '@/components/layout/AppLayout';
import { CollabCalendar } from '@/components/calendar/CollabCalendar';

const Calendar = () => {
  return (
    <AppLayout title="Calendar" subtitle="Visualize your collaboration timeline.">
      <CollabCalendar />
    </AppLayout>
  );
};

export default Calendar;
