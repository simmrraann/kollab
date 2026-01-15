import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, X } from 'lucide-react';

interface CollabFormData {
  brandName: string;
  platform: string;
  deliverable: string;
  recordingDate: string;
  postingDate: string;
  paymentAmount: string;
  paymentStatus: string;
  paymentDueDate: string;
  onboardingReceived: boolean;
  referralLinks: string;
  notes: string;
}

const initialFormData: CollabFormData = {
  brandName: '',
  platform: '',
  deliverable: '',
  recordingDate: '',
  postingDate: '',
  paymentAmount: '',
  paymentStatus: 'pending',
  paymentDueDate: '',
  onboardingReceived: false,
  referralLinks: '',
  notes: '',
};

interface CollabFormProps {
  onClose?: () => void;
  onSubmit?: (data: CollabFormData) => void;
}

export const CollabForm = ({ onClose, onSubmit }: CollabFormProps) => {
  const [formData, setFormData] = useState<CollabFormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData(initialFormData);
  };

  const updateField = (field: keyof CollabFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Add New Collaboration</h3>
        {onClose && (
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Brand Name */}
        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-sm font-medium">
            Brand Name
          </Label>
          <Input
            id="brandName"
            placeholder="e.g., Glossier"
            value={formData.brandName}
            onChange={(e) => updateField('brandName', e.target.value)}
            className="soft-input"
          />
        </div>

        {/* Platform */}
        <div className="space-y-2">
          <Label htmlFor="platform" className="text-sm font-medium">
            Platform
          </Label>
          <Select value={formData.platform} onValueChange={(v) => updateField('platform', v)}>
            <SelectTrigger className="soft-input">
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

        {/* Deliverable */}
        <div className="space-y-2">
          <Label htmlFor="deliverable" className="text-sm font-medium">
            Deliverables
          </Label>
          <Select value={formData.deliverable} onValueChange={(v) => updateField('deliverable', v)}>
            <SelectTrigger className="soft-input">
              <SelectValue placeholder="Select deliverable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
              <SelectItem value="video">YouTube Video</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recording Date */}
        <div className="space-y-2">
          <Label htmlFor="recordingDate" className="text-sm font-medium">
            Recording Date
          </Label>
          <Input
            id="recordingDate"
            type="date"
            value={formData.recordingDate}
            onChange={(e) => updateField('recordingDate', e.target.value)}
            className="soft-input"
          />
        </div>

        {/* Posting Date */}
        <div className="space-y-2">
          <Label htmlFor="postingDate" className="text-sm font-medium">
            Posting Date
          </Label>
          <Input
            id="postingDate"
            type="date"
            value={formData.postingDate}
            onChange={(e) => updateField('postingDate', e.target.value)}
            className="soft-input"
          />
        </div>

        {/* Payment Amount */}
        <div className="space-y-2">
          <Label htmlFor="paymentAmount" className="text-sm font-medium">
            Payment Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="paymentAmount"
              type="number"
              placeholder="0.00"
              value={formData.paymentAmount}
              onChange={(e) => updateField('paymentAmount', e.target.value)}
              className="soft-input pl-7"
            />
          </div>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <Label htmlFor="paymentStatus" className="text-sm font-medium">
            Payment Status
          </Label>
          <Select value={formData.paymentStatus} onValueChange={(v) => updateField('paymentStatus', v)}>
            <SelectTrigger className="soft-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Due Date */}
        <div className="space-y-2">
          <Label htmlFor="paymentDueDate" className="text-sm font-medium">
            Payment Due Date
          </Label>
          <Input
            id="paymentDueDate"
            type="date"
            value={formData.paymentDueDate}
            onChange={(e) => updateField('paymentDueDate', e.target.value)}
            className="soft-input"
          />
        </div>

        {/* Onboarding Form */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Onboarding Form Received</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch
              checked={formData.onboardingReceived}
              onCheckedChange={(checked) => updateField('onboardingReceived', checked)}
            />
            <span className="text-sm text-muted-foreground">
              {formData.onboardingReceived ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="referralLinks" className="text-sm font-medium">
            Referral / Reference Links
          </Label>
          <Input
            id="referralLinks"
            placeholder="Add any relevant links..."
            value={formData.referralLinks}
            onChange={(e) => updateField('referralLinks', e.target.value)}
            className="soft-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Additional notes about this collaboration..."
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="soft-input min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="btn-calm">
          <Plus className="w-4 h-4 mr-2" />
          Add Collaboration
        </Button>
      </div>
    </form>
  );
};
