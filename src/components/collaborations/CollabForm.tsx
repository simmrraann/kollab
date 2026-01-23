import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Loader2 } from "lucide-react";

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

// 🆕 Updated Defaults
const defaultData: CollabFormData = {
  brandName: "",
  platform: "Instagram", // Default 1
  deliverable: "Reel + Story", // Default 2
  postingDate: "",
  paymentAmount: "",
  paymentStatus: "Pending",
  paymentDueDate: "",
  onboardingReceived: false,
  notes: "",
};

interface CollabFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any | null; // Optional prop for Edit Mode
}

export const CollabForm = ({ onClose, onSuccess, initialData }: CollabFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CollabFormData>(defaultData);
  const [loading, setLoading] = useState(false);

  // 🆕 Load data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        brandName: initialData.brand_name || "",
        platform: initialData.platform || "Instagram",
        deliverable: initialData.deliverable || "Reel + Story",
        postingDate: initialData.posting_date || "",
        paymentAmount: initialData.amount ? String(initialData.amount) : "",
        paymentStatus: initialData.payment_status || "Pending",
        paymentDueDate: initialData.payment_due_date || "",
        onboardingReceived: initialData.onboarding_received || false,
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const updateField = (field: keyof CollabFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const payload = {
      user_id: user.id,
      brand_name: formData.brandName,
      platform: formData.platform,
      deliverable: formData.deliverable,
      amount: Number(formData.paymentAmount) || 0,
      payment_status: formData.paymentStatus,
      posting_date: formData.postingDate || null,
      payment_due_date: formData.paymentDueDate || null,
      onboarding_received: formData.onboardingReceived,
      notes: formData.notes,
    };

    let error;

    if (initialData) {
      // 🆕 EDIT MODE: Update existing row
      const { error: updateError } = await supabase
        .from("collaborations")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      // ADD MODE: Create new row
      const { error: insertError } = await supabase
        .from("collaborations")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      console.error(error);
      alert("Error saving data");
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-background border shadow-2xl rounded-xl p-6 w-full animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          {initialData ? "Edit Collaboration" : "Add New Collaboration"}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label>Brand Name</Label>
          <Input
            value={formData.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
            placeholder="e.g. Nike"
            required
            className="bg-secondary/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(v) => updateField("platform", v)}
          >
            <SelectTrigger className="bg-secondary/20">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Website">Website/Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Deliverable</Label>
          {/* 🆕 Using an Input but with Datalist behavior or just free text with suggestions via placeholder */}
          <div className="relative">
             <Input
                value={formData.deliverable}
                onChange={(e) => updateField("deliverable", e.target.value)}
                placeholder="Reel + Story"
                className="bg-secondary/20"
                list="deliverable-options" // HTML5 Datalist
             />
             {/* Suggestions that appear when typing */}
             <datalist id="deliverable-options">
               <option value="Reel" />
               <option value="Story" />
               <option value="Reel + Story" />
               <option value="Carousel" />
               <option value="Dedicated Video" />
             </datalist>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Posting Date</Label>
          <Input
            type="date"
            value={formData.postingDate}
            onChange={(e) => updateField("postingDate", e.target.value)}
            className="bg-secondary/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Payment Amount (₹)</Label>
          <Input
            type="number"
            value={formData.paymentAmount}
            onChange={(e) => updateField("paymentAmount", e.target.value)}
            className="bg-secondary/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={formData.paymentStatus}
            onValueChange={(v) => updateField("paymentStatus", v)}
          >
            <SelectTrigger className="bg-secondary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Payment Due Date</Label>
          <Input
            type="date"
            value={formData.paymentDueDate}
            onChange={(e) => updateField("paymentDueDate", e.target.value)}
            className="bg-secondary/20"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <Switch
            checked={formData.onboardingReceived}
            onCheckedChange={(v) => updateField("onboardingReceived", v)}
          />
          <Label className="cursor-pointer" onClick={() => updateField("onboardingReceived", !formData.onboardingReceived)}>
             Onboarding / Contract Received?
          </Label>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="bg-secondary/20 min-h-[80px]"
            placeholder="Any specific details..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Plus className="w-4 h-4 mr-2" />}
          {initialData ? "Update Collaboration" : "Add Collaboration"}
        </Button>
      </div>
    </form>
  );
};