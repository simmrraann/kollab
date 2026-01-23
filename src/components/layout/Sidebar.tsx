import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, BarChart2, Sparkles, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext'; // Import theme hook

export const Sidebar = () => {
  const location = useLocation();
  const { mode, toggleMode } = useTheme();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Collaborations', path: '/collaborations' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Sparkles, label: 'AI Tools', path: '/ai-tools' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r z-50 hidden md:flex flex-col">
      {/* Logo Area */}
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
           K
        </div>
        <span className="font-bold text-xl tracking-tight">Kollab</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-2">
         {/* Dark Mode Toggle (Mini) */}
         <button 
           onClick={toggleMode}
           className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
         >
            <span className="flex items-center gap-2">
               {mode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
               {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
         </button>

         <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            location.pathname === '/settings' 
              ? "bg-secondary text-foreground" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
};