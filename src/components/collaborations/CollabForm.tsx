import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext"; // Use your context!

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

// Matches your DB column names exactly for easier saving
interface CollabFormData {
  brandName: string;
  platform: string;
  deliverable: string;
  postingDate: string;
  paymentAmount: string;
  paymentStatus: string;
  paymentDueDate: string;
  onboardingReceived: boolean;
  notes: string;
}

const initialFormData: CollabFormData = {
  brandName: "",
  platform: "",
  deliverable: "",
  postingDate: "",
  paymentAmount: "",
  paymentStatus: "Pending", // Match the DB default case
  paymentDueDate: "",
  onboardingReceived: false,
  notes: "",
};

interface CollabFormProps {
  onClose: () => void;
  onSuccess: () => void; // New prop to trigger refresh
}

export const CollabForm = ({ onClose, onSuccess }: CollabFormProps) => {
  const { user } = useAuth(); // Get user from context
  const [formData, setFormData] = useState<CollabFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CollabFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("You must be logged in to add a collaboration.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("collaborations").insert({
      user_id: user.id,
      brand_name: formData.brandName,
      platform: formData.platform,
      deliverable: formData.deliverable,
      amount: formData.paymentAmount ? Number(formData.paymentAmount) : 0,
      payment_status: formData.paymentStatus,
      posting_date: formData.postingDate || null,
      payment_due_date: formData.paymentDueDate || null,
      onboarding_received: formData.onboardingReceived,
      notes: formData.notes,
    });

    if (error) {
      console.error("Supabase Error:", error.message);
      alert(`Error saving: ${error.message}`); // Show real error
      setLoading(false);
      return;
    }

    // Success!
    setLoading(false);
    onSuccess(); // Tell parent to refresh
    onClose();   // Close modal
  };

  return (
    // Keep your existing JSX layout exactly as is
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-6">
       {/* ... (Your existing header code) ... */}
       <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Add New Collaboration</h3>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ... (Keep all your existing Inputs/Selects exactly the same) ... */}
        {/* Just showing the first one as example, keep the rest! */}
        <div>
          <Label>Brand Name</Label>
          <Input
            value={formData.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
            required
          />
        </div>
        
        {/* ... Paste the rest of your form fields here ... */}
        <div>
          <Label>Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(v) => updateField("platform", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Deliverable</Label>
           <Input 
             value={formData.deliverable}
             onChange={(e) => updateField("deliverable", e.target.value)}
             placeholder="e.g. Reel + Story"
           />
        </div>

        <div>
          <Label>Posting Date</Label>
          <Input
            type="date"
            value={formData.postingDate}
            onChange={(e) => updateField("postingDate", e.target.value)}
          />
        </div>

        <div>
          <Label>Payment Amount (₹)</Label>
          <Input
            type="number"
            value={formData.paymentAmount}
            onChange={(e) => updateField("paymentAmount", e.target.value)}
          />
        </div>

        <div>
          <Label>Payment Status</Label>
          <Select
            value={formData.paymentStatus}
            onValueChange={(v) => updateField("paymentStatus", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Payment Due Date</Label>
          <Input
            type="date"
            value={formData.paymentDueDate}
            onChange={(e) => updateField("paymentDueDate", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            checked={formData.onboardingReceived}
            onCheckedChange={(v) => updateField("onboardingReceived", v)}
          />
          <span>Onboarding Received</span>
        </div>
      </div>
      
       {/* Notes */}
      <div className="mt-4">
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Add Collaboration"}
        </Button>
      </div>
    </form>
  );
};