import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (term: string) => void;
}

export const Header = ({ title, subtitle, onSearch }: HeaderProps) => {
  return (
    <header className="w-full flex-shrink-0 h-auto md:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3 md:py-0 gap-4 md:gap-0">
      {/* Title Section */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-lg font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>

      {/* Search Bar */}
      {onSearch && (
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-full md:w-64 pl-9 bg-muted/50 border-transparent focus:border-primary/30 text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}
    </header>
  );
};