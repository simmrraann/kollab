import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, BarChart2, Sparkles, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export const Sidebar = () => {
  const location = useLocation();
  const { mode, toggleMode, theme, cycleTheme } = useTheme();

  // --- LOGIC: CHOOSE IMAGE BASED ON THEME ---
  const getLogoImage = () => {
    // These must match the exact file names in your /public folder
    if (theme === 'sage-studio') return '/logo-green.jpg';
    if (theme === 'steel-valor') return '/logo-blue.jpg';
    return '/logo-pink.jpg'; // default royal-muse
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Collaborations', path: '/collaborations' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Sparkles, label: 'AI Tools', path: '/ai-tools' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r z-50 hidden md:flex flex-col transition-colors duration-300">
      
      {/* --- CLICKABLE LOGO AREA --- */}
      <div 
        className="p-6 border-b flex items-center gap-3 group cursor-pointer" 
        onClick={cycleTheme}
        title="Click to switch theme!"
      >
        
        {/* Container */}
        <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-border shadow-sm group-hover:border-primary transition-colors bg-white">
          <img 
            key={theme} 
            src={getLogoImage()} 
            alt="Kollab Mascot"
            // Added onError to help debug if it fails again
            onError={(e) => {
              e.currentTarget.style.display = 'none'; // Hide if broken
              console.error("Image failed to load:", getLogoImage());
            }}
            className="w-full h-full object-cover object-center scale-105 hover:scale-115 transition-transform duration-500" 
          />
        </div>

        {/* Text */}
        <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Kollab
        </span>
      </div>
      {/* ---------------------------------- */}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
              
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-2 bg-card/50">
         <button 
           onClick={(e) => { e.stopPropagation(); toggleMode(); }} 
           className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border"
         >
            <span className="flex items-center gap-2">
               {mode === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
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