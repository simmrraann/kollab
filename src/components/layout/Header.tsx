import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (term: string) => void;
}

export const Header = ({ title, subtitle, onSearch }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* 🔒 FIXED: Only show Search Bar if the page requests it (has onSearch) */}
        {onSearch && (
          <div className="relative hidden md:block animate-in fade-in zoom-in-95 duration-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-64 bg-muted/50 border-transparent focus:border-primary/30 soft-input"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </header>
  );
};