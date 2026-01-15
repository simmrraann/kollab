import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Palette, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout title="Settings" subtitle="Manage your preferences and account.">
      <div className="max-w-3xl space-y-8">
        {/* Profile Section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Your personal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input defaultValue="Content Creator" className="soft-input" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="creator@example.com" className="soft-input" />
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Theme Style</Label>
              <ThemeSwitcher />
            </div>
            <p className="text-sm text-muted-foreground">
              Choose between Royal Muse (elegant & luxurious), Steel Valor (bold & powerful), or Sage Studio (calm & grounded).
            </p>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage your alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about upcoming payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Deadline Alerts</p>
                <p className="text-sm text-muted-foreground">Reminders for posting deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Overdue Payments</p>
                <p className="text-sm text-muted-foreground">Alerts for delayed payments</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Data & Storage</h2>
              <p className="text-sm text-muted-foreground">Manage your data</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline">Import Data</Button>
          </div>
        </section>

        {/* Security Section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>
          </div>

          <Button variant="outline">Change Password</Button>
        </section>
      </div>
    </AppLayout>
  );
};

export default Settings;
