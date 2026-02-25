import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Palette, BarChart2, Search, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onSearch?: (term: string) => void;
}

export const AppLayout = ({ children, title, subtitle, onSearch }: AppLayoutProps) => {
  const location = useLocation();

  const mobileNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Briefcase, label: 'Collabs', path: '/collaborations' },
    { icon: Palette, label: 'Studio', path: '/studio' }, // Center item
    { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
    { icon: BarChart2, label: 'Stats', path: '/analytics' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0 transition-all duration-300">
        
        {/* Header (Desktop & Mobile) */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Top Row: Title + Mobile Settings Icon */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title || 'Kollab'}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            {/* ⚙️ MOBILE SETTINGS ICON (Hidden on Desktop) */}
            <Link 
              to="/settings" 
              className="md:hidden p-2.5 bg-secondary/50 hover:bg-secondary rounded-full transition-colors flex items-center justify-center shadow-sm"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </Link>
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-secondary/50 border border-transparent focus:border-primary rounded-full py-2 pl-9 pr-4 text-sm outline-none transition-all"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
          {children}
        </div>
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION (Visible only on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-1">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {/* Special styling for Studio (Center) icon */}
                {item.label === 'Studio' ? (
                   <div className={cn(
                     "p-2 rounded-full -mt-6 shadow-lg border-4 border-background transition-all",
                     isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                   )}>
                      <item.icon className="w-6 h-6" />
                   </div>
                ) : (
                   <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                )}
                
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};