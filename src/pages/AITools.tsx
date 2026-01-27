import { AppLayout } from '@/components/layout/AppLayout';
import { SmartExtractor } from '@/components/ai/SmartExtractor';
import { PaymentDetector } from '@/components/ai/PaymentDetector';
import { FollowUpGenerator } from '@/components/ai/FollowUpGenerator';
import { Sparkles } from 'lucide-react';
// 👇 FIXED: Added curly braces {} because we changed the component to a named export
import { PitchGenerator } from '../components/ai/PitchGenerator'; 

const AITools = () => {
  return (
    <AppLayout title="AI Tools" subtitle="Intelligent features to streamline your workflow.">
      <div className="space-y-6">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-Powered Features</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Extractor */}
          <SmartExtractor />

          {/* Payment Detector */}
          <PaymentDetector />

          {/* ✨ NEW: Pitch Generator ✨ */}
          <div className="lg:col-span-2">
            <PitchGenerator />
          </div>

          {/* Follow-Up Generator - Full Width */}
          <div className="lg:col-span-2">
            <FollowUpGenerator />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AITools;