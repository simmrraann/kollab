import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const defaultData: CollabFormData = {
  brandName: "",
  platform: "Instagram",
  deliverable: "Reel + Story",
  postingDate: "",
  paymentAmount: "",
  paymentStatus: "Pending",
  paymentDueDate: "",
  onboardingReceived: false,
  notes: "",
};

export const CollabForm = ({ onClose, onSuccess, initialData }: any) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CollabFormData>(defaultData);
  const [loading, setLoading] = useState(false);

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

    const { error } = initialData 
      ? await supabase.from("collaborations").update(payload).eq("id", initialData.id)
      : await supabase.from("collaborations").insert(payload);

    if (error) {
      console.error(error);
      alert("Error saving data");
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  // Shared class for the dropdowns to keep them looking good
  const selectClass = "flex h-10 w-full rounded-md border border-input bg-secondary/20 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

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
          <Input value={formData.brandName} onChange={(e) => updateField("brandName", e.target.value)} placeholder="e.g. Nike" required className="bg-secondary/20" />
        </div>

        {/* PLATFORM DROPDOWN */}
        <div className="space-y-1.5">
          <Label>Platform</Label>
          <select 
            className={selectClass}
            value={formData.platform}
            onChange={(e) => updateField("platform", e.target.value)}
          >
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter / X</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>

        {/* DELIVERABLE DROPDOWN */}
        <div className="space-y-1.5 md:col-span-2">
          <Label>Deliverable</Label>
          <select 
            className={selectClass}
            value={formData.deliverable}
            onChange={(e) => updateField("deliverable", e.target.value)}
          >
            <option value="Reel + Story">Reel + Story</option>
            <option value="Reel Only">Reel Only</option>
            <option value="Story Only">Story Only</option>
            <option value="Carousel">Carousel</option>
            <option value="YouTube Video">YouTube Video</option>
            <option value="LinkedIn Post">LinkedIn Post</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Posting Date</Label>
          <Input type="date" value={formData.postingDate} onChange={(e) => updateField("postingDate", e.target.value)} className="bg-secondary/20" />
        </div>

        <div className="space-y-1.5">
          <Label>Payment Amount (₹)</Label>
          <Input type="number" value={formData.paymentAmount} onChange={(e) => updateField("paymentAmount", e.target.value)} className="bg-secondary/20" />
        </div>

        {/* STATUS DROPDOWN */}
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select 
            className={selectClass}
            value={formData.paymentStatus}
            onChange={(e) => updateField("paymentStatus", e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Barter">Barter</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Payment Due Date</Label>
          <Input type="date" value={formData.paymentDueDate} onChange={(e) => updateField("paymentDueDate", e.target.value)} className="bg-secondary/20" />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <Switch checked={formData.onboardingReceived} onCheckedChange={(v) => updateField("onboardingReceived", v)} />
          <Label className="cursor-pointer">Onboarding / Contract Received?</Label>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label>Notes</Label>
          <Textarea value={formData.notes} onChange={(e) => updateField("notes", e.target.value)} className="bg-secondary/20 min-h-[80px]" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Plus className="w-4 h-4 mr-2" />}
          {initialData ? "Update Collaboration" : "Add Collaboration"}
        </Button>
      </div>
    </form>
  );
};