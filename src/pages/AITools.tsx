import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SmartExtractor } from '@/components/ai/SmartExtractor';
import { PaymentDetector } from '@/components/ai/PaymentDetector';
import { FollowUpGenerator } from '@/components/ai/FollowUpGenerator';
import { PitchGenerator } from '@/components/ai/PitchGenerator';
import { InvoiceGenerator } from '@/components/pro/InvoiceGenerator';
import { NotesGenerator } from '@/components/notes/NotesGenerator';
import { Send, DollarSign, BookOpen } from 'lucide-react';

const AITools = () => {
  const [activeTab, setActiveTab] = useState('study');

  return (
    <AppLayout title="AI Tools" subtitle="Intelligent features to streamline your workflow.">

      {/* 1. The Tab Navigation (Mobile optimized) */}
      <div className="flex space-x-2 mb-6 md:mb-8 border-b border-border pb-1 overflow-x-auto">
        <TabButton
          id="study"
          label="Study"
          icon={<BookOpen className="w-4 h-4" />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          id="outreach"
          label="Outreach"
          icon={<Send className="w-4 h-4" />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          id="finance"
          label="Finance"
          icon={<DollarSign className="w-4 h-4" />}
          active={activeTab}
          onClick={setActiveTab}
        />
      </div>

      {/* 2. The Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* STUDY TAB */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="col-span-1">
              <NotesGenerator />
            </div>
          </div>
        )}

        {/* OUTREACH TAB */}
        {activeTab === 'outreach' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <SmartExtractor />
            <PaymentDetector />
            <div className="lg:col-span-2">
              <InvoiceGenerator />
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

// Simple Helper Component for the Buttons - Mobile optimized
const TabButton = ({ id, label, icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap ${active === id
        ? 'border-primary text-primary bg-primary/5'
        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default AITools;