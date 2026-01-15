import { AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DelayedPayment {
  id: string;
  brand: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

const mockDelayedPayments: DelayedPayment[] = [
  { id: '1', brand: 'Notion', amount: 1800, dueDate: 'Jan 10', daysOverdue: 10 },
  { id: '2', brand: 'Canva', amount: 3200, dueDate: 'Jan 5', daysOverdue: 15 },
  { id: '3', brand: 'Stripe', amount: 4500, dueDate: 'Dec 28', daysOverdue: 23 },
];

export const PaymentDetector = () => {
  const totalOverdue = mockDelayedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Payment Delay Detector</h3>
          <p className="text-sm text-muted-foreground">
            AI-flagged overdue payments requiring attention
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-foreground">Total Overdue</span>
          </div>
          <span className="text-xl font-bold text-destructive">${totalOverdue.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {mockDelayedPayments.length} payments need follow-up
        </p>
      </div>

      {/* Delayed Payments List */}
      <div className="space-y-2">
        {mockDelayedPayments.map((payment, index) => (
          <div
            key={payment.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg bg-muted/30 animate-fade-in',
              payment.daysOverdue > 14 && 'border border-destructive/30'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div>
              <p className="font-medium text-foreground">{payment.brand}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Due: {payment.dueDate}</span>
                <span className="text-destructive font-medium">
                  {payment.daysOverdue} days overdue
                </span>
              </div>
            </div>
            <span className="font-semibold text-foreground">${payment.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
