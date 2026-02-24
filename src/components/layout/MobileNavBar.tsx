import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Briefcase, Calendar, BarChart2, Sparkles, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mode, toggleMode, theme, cycleTheme } = useTheme();

  const getLogoImage = () => {
    if (theme === 'sage-studio') return '/logo-green.jpg';
    if (theme === 'steel-valor') return '/logo-blue.jpg';
    return '/logo-pink.jpg';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Collaborations', path: '/collaborations' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Sparkles, label: 'AI Tools', path: '/ai-tools' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={cycleTheme}
          title="Click to switch theme!"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-white">
            <img 
              key={theme} 
              src={getLogoImage()} 
              alt="Kollab Mascot"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full h-full object-cover object-center" 
            />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Kollab
          </span>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bottom-0 w-full bg-card border-r border-border transform transition-all duration-300 z-50 overflow-y-auto",
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
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

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2 mt-4">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleMode();
            }} 
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border"
          >
            <span className="flex items-center gap-2">
              {mode === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
              {mode === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>

          <Link
            to="/settings"
            onClick={handleNavClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
};
