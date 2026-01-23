import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext'; // Import this!
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext'; // Import theme hook

const Settings = () => {
  const { user } = useAuth(); // Get real user
  const navigate = useNavigate();
  const { theme, setTheme, mode, toggleMode } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast.success("Signed out successfully");
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        
        {/* Profile Section - NOW REAL */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profile
          </h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border">
                <div>
                    <span className="block text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Account</span>
                    <span className="text-base font-medium">{user?.email || "Loading..."}</span>
                </div>
                <div className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-200">
                    Active
                </div>
             </div>
          </div>
        </Card>

        {/* Theme & Appearance Section */}
        <Card className="p-6">
           <h3 className="text-lg font-semibold mb-4">Appearance</h3>
           
           {/* Dark Mode Toggle */}
           <div className="flex items-center justify-between mb-6">
              <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Switch between light and dark themes</div>
              </div>
              <Button variant="outline" size="icon" onClick={toggleMode} className="rounded-full">
                  {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
           </div>

           {/* Theme Selection */}
           <div className="space-y-3">
               <div className="font-medium">Color Theme</div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <button 
                     onClick={() => setTheme('royal-muse')}
                     className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${theme === 'royal-muse' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-transparent bg-secondary/50'}`}
                   >
                       <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                       <span className="text-sm font-medium">Royal Muse</span>
                   </button>
                   
                   <button 
                     onClick={() => setTheme('steel-valor')}
                     className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${theme === 'steel-valor' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-secondary/50'}`}
                   >
                       <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                       <span className="text-sm font-medium">Steel Valor</span>
                   </button>

                   <button 
                     onClick={() => setTheme('sage-studio')}
                     className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${theme === 'sage-studio' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent bg-secondary/50'}`}
                   >
                       <div className="w-4 h-4 rounded-full bg-green-500"></div>
                       <span className="text-sm font-medium">Sage Studio</span>
                   </button>
               </div>
           </div>
        </Card>

        <div className="flex justify-end">
            <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
        </div>

      </div>
    </AppLayout>
  );
};

export default Settings;