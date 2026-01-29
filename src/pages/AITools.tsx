import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SmartExtractor } from '@/components/ai/SmartExtractor';
import { PaymentDetector } from '@/components/ai/PaymentDetector';
import { FollowUpGenerator } from '@/components/ai/FollowUpGenerator';
import { PitchGenerator } from '@/components/ai/PitchGenerator';
import { MediaKit } from '@/components/pro/MediaKit';
import { InvoiceGenerator } from '@/components/pro/InvoiceGenerator';
import { EmailSync } from '@/components/pro/EmailSync';
import { Sparkles, Send, DollarSign, UserCircle } from 'lucide-react';

const AITools = () => {
  const [activeTab, setActiveTab] = useState('outreach');

  return (
    <AppLayout title="AI Tools" subtitle="Intelligent features to streamline your workflow.">
      
      {/* 1. The Tab Navigation */}
      <div className="flex space-x-2 mb-8 border-b border-border pb-1 overflow-x-auto">
        <TabButton 
          id="outreach" 
          label="Outreach & Deals" 
          icon={<Send className="w-4 h-4" />} 
          active={activeTab} 
          onClick={setActiveTab} 
        />
        <TabButton 
          id="finance" 
          label="Finance & Payments" 
          icon={<DollarSign className="w-4 h-4" />} 
          active={activeTab} 
          onClick={setActiveTab} 
        />
        <TabButton 
          id="brand" 
          label="My Brand" 
          icon={<UserCircle className="w-4 h-4" />} 
          active={activeTab} 
          onClick={setActiveTab} 
        />
      </div>

      {/* 2. The Content Area (Changes based on Tab) */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* OUTREACH TAB */}
        {activeTab === 'outreach' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
               <PitchGenerator />
            </div>
            <div className="lg:col-span-2">
               <FollowUpGenerator />
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartExtractor />
            <PaymentDetector />
            <div className="lg:col-span-2">
               <InvoiceGenerator />
            </div>
          </div>
        )}

        {/* BRAND TAB */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
             <MediaKit />
             <EmailSync />
          </div>
        )}

      </div>
    </AppLayout>
  );
};

// Simple Helper Component for the Buttons
const TabButton = ({ id, label, icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
      active === id 
        ? 'border-primary text-primary bg-primary/5' 
        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default AITools;