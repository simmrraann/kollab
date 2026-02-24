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
      <div className="max-w-2xl space-y-4 md:space-y-6">
        
        {/* Profile Section - NOW REAL */}
        <Card className="p-3 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <User className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Profile
          </h3>
          <div className="space-y-4">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 bg-secondary/30 rounded-lg md:rounded-xl border">
                <div className="flex-1">
                    <span className="block text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Account</span>
                    <span className="text-sm md:text-base font-medium truncate">{user?.email || "Loading..."}</span>
                </div>
                <div className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-200 whitespace-nowrap">
                    Active
                </div>
             </div>
          </div>
        </Card>

        {/* Theme & Appearance Section */}
        <Card className="p-3 md:p-6">
           <h3 className="text-base md:text-lg font-semibold mb-4">Appearance</h3>
           
           {/* Dark Mode Toggle */}
           <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">Dark Mode</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Switch between light and dark themes</div>
              </div>
              <Button variant="outline" size="icon" onClick={toggleMode} className="rounded-full flex-shrink-0">
                  {mode === 'dark' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
              </Button>
           </div>

           {/* Theme Selection */}
           <div className="space-y-3">
               <div className="font-medium text-sm md:text-base">Color Theme</div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                   <button 
                     onClick={() => setTheme('royal-muse')}
                     className={`p-2 md:p-3 rounded-lg md:rounded-xl border-2 flex flex-col md:flex-row md:items-center md:gap-2 transition-all`}
                     style={{
                       borderColor: theme === 'royal-muse' ? 'rgb(168, 85, 247)' : 'transparent',
                       backgroundColor: theme === 'royal-muse' ? 'rgba(168, 85, 247, 0.1)' : 'hsl(var(--secondary) / 0.5)'
                     }}
                   >
                       <div className="w-4 h-4 rounded-full bg-purple-500 mx-auto md:mx-0"></div>
                       <span className="text-xs md:text-sm font-medium text-center md:text-left">Royal Muse</span>
                   </button>
                   
                   <button 
                     onClick={() => setTheme('steel-valor')}
                     className={`p-2 md:p-3 rounded-lg md:rounded-xl border-2 flex flex-col md:flex-row md:items-center md:gap-2 transition-all`}
                     style={{
                       borderColor: theme === 'steel-valor' ? 'rgb(59, 130, 246)' : 'transparent',
                       backgroundColor: theme === 'steel-valor' ? 'rgba(59, 130, 246, 0.1)' : 'hsl(var(--secondary) / 0.5)'
                     }}
                   >
                       <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto md:mx-0"></div>
                       <span className="text-xs md:text-sm font-medium text-center md:text-left">Steel Valor</span>
                   </button>

                   <button 
                     onClick={() => setTheme('sage-studio')}
                     className={`p-2 md:p-3 rounded-lg md:rounded-xl border-2 flex flex-col md:flex-row md:items-center md:gap-2 transition-all`}
                     style={{
                       borderColor: theme === 'sage-studio' ? 'rgb(34, 197, 94)' : 'transparent',
                       backgroundColor: theme === 'sage-studio' ? 'rgba(34, 197, 94, 0.1)' : 'hsl(var(--secondary) / 0.5)'
                     }}
                   >
                       <div className="w-4 h-4 rounded-full bg-green-500 mx-auto md:mx-0"></div>
                       <span className="text-xs md:text-sm font-medium text-center md:text-left">Sage Studio</span>
                   </button>
               </div>
           </div>
        </Card>

        <div className="flex justify-end">
            <Button variant="destructive" onClick={handleLogout} size="sm" className="md:size-auto">
                <LogOut className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Log Out</span><span className="md:hidden">Logout</span>
            </Button>
        </div>

      </div>
    </AppLayout>
  );
};

export default Settings;