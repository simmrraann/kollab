import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
  paymentStatus: "pending",
  paymentDueDate: "",
  onboardingReceived: false,
  notes: "",
};

interface CollabFormProps {
  onClose?: () => void;
}

export const CollabForm = ({ onClose }: CollabFormProps) => {
  const [formData, setFormData] = useState<CollabFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CollabFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔐 Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      alert("Please login again");
      setLoading(false);
      return;
    }

    // 📦 Insert into Supabase
    const { error } = await supabase.from("collaborations").insert({
      user_id: user.id,
      brand_name: formData.brandName,
      platform: formData.platform,
      deliverable: formData.deliverable,
      amount: Number(formData.paymentAmount),
      payment_status: formData.paymentStatus,
      posting_date: formData.postingDate || null,
      payment_due_date: formData.paymentDueDate || null,
      onboarding_received: formData.onboardingReceived,
      notes: formData.notes,
    });

    if (error) {
      console.error(error);
      alert("Error saving collaboration");
      setLoading(false);
      return;
    }

    // ✅ Success
    setFormData(initialFormData);
    setLoading(false);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Add New Collaboration</h3>
        {onClose && (
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label>Brand Name</Label>
          <Input
            value={formData.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
          />
        </div>

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
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Deliverable</Label>
          <Select
            value={formData.deliverable}
            onValueChange={(v) => updateField("deliverable", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select deliverable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
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

        <div className="flex items-center gap-3">
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
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Add Collaboration"}
        </Button>
      </div>
    </form>
  );
};
