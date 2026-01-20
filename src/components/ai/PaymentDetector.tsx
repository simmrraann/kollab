import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PaymentDetector = () => {
  const [loading, setLoading] = useState(true);
  const [overdueItems, setOverdueItems] = useState<any[]>([]);
  const [totalOverdue, setTotalOverdue] = useState(0);

  useEffect(() => {
    checkOverduePayments();
  }, []);

  const checkOverduePayments = async () => {
    try {
      // 1. Fetch anything that isn't paid
      const { data } = await supabase
        .from('collaborations')
        .select('*')
        .neq('payment_status', 'Paid');

      if (!data) return;

      const today = new Date();
      let total = 0;
      const overdueList: any[] = [];

      // 2. Filter for dates in the past
      data.forEach(item => {
        if (item.payment_due_date) {
          const dueDate = new Date(item.payment_due_date);
          if (dueDate < today) {
            // It's overdue!
            const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
            overdueList.push({ ...item, daysLate });
            total += Number(item.amount) || 0;
          }
        }
      });

      setOverdueItems(overdueList);
      setTotalOverdue(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-medium mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Payment Delay Detector</span>
          </div>
          <p className="text-sm text-muted-foreground">AI-flagged overdue payments requiring attention</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">Total Overdue</p>
        <div className="text-3xl font-bold text-red-600">₹{totalOverdue.toLocaleString()}</div>
        <p className="text-xs text-red-500 font-medium mt-1">
          {overdueItems.length} payments need follow-up
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-muted-foreground">Scanning database...</div>
        ) : overdueItems.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>No overdue payments! Great job.</span>
          </div>
        ) : (
          overdueItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-lg border shadow-sm">
              <div>
                <div className="font-medium text-sm">{item.brand_name}</div>
                <div className="text-xs text-red-500 font-medium">Due: {item.payment_due_date} • {item.daysLate} days late</div>
              </div>
              <div className="font-bold text-sm">₹{item.amount.toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};