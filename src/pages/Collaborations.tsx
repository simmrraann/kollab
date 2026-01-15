import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollabForm } from '@/components/collaborations/CollabForm';
import { CollabTable } from '@/components/collaborations/CollabTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Collaborations = () => {
  const [showForm, setShowForm] = useState(false);

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
            onSubmit={(data) => {
              console.log('New collaboration:', data);
              setShowForm(false);
            }}
          />
        )}

        {/* Table */}
        <CollabTable />
      </div>
    </AppLayout>
  );
};

export default Collaborations;
