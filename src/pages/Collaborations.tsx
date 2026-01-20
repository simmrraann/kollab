import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollabForm } from '@/components/collaborations/CollabForm';
import { CollabTable } from '@/components/collaborations/CollabTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Collaborations = () => {
  const [showForm, setShowForm] = useState(false);
  // 1. This "Key" controls the table refresh
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    console.log("Form saved! Refreshing table...");
    // 2. Change the key, which forces the table to re-fetch data
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
  };

  return (
    <AppLayout title="Collaborations" subtitle="Manage all your brand partnerships in one place.">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Track deliverables, payments, and deadlines
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="btn-calm">
            <Plus className="w-4 h-4 mr-2" />
            Add Collaboration
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <CollabForm
            onClose={() => setShowForm(false)}
            onSuccess={handleSuccess} // 3. Pass the success handler here
          />
        )}

        {/* Table */}
        <CollabTable keyProp={refreshKey} /> 
      </div>
    </AppLayout>
  );
};

export default Collaborations;