import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onSearch?: (term: string) => void; // 1. Allow pages to pass a search function
}

export const AppLayout = ({ children, title, subtitle, onSearch }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        {/* 2. Pass the function to the Header */}
        <Header title={title} subtitle={subtitle} onSearch={onSearch} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};