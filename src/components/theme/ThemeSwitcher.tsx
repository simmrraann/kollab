import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Crown, Shield, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes: { id: Theme; name: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'royal-muse',
    name: 'Royal Muse',
    icon: <Crown className="w-4 h-4" />,
    description: 'Elegant & luxurious',
  },
  {
    id: 'steel-valor',
    name: 'Steel Valor',
    icon: <Shield className="w-4 h-4" />,
    description: 'Bold & powerful',
  },
  {
    id: 'sage-studio',
    name: 'Sage Studio',
    icon: <Leaf className="w-4 h-4" />,
    description: 'Calm & grounded',
  },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 p-1 rounded-lg bg-muted/50">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
            theme === t.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.name}</span>
        </button>
      ))}
    </div>
  );
};
