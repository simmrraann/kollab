import { MobileNav } from './MobileNav';

// Example usage component
export const MobileNavExample = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Collaborations', href: '/collaborations' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'AI Tools', href: '/ai-tools' },
    { label: 'Settings', href: '/settings' },
  ];

  // Optional: Custom logo component
  const customLogo = (
    <div className="flex items-center">
      <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        Kollab
      </span>
    </div>
  );

  return (
    <div>
      <MobileNav logo={customLogo} navItems={navItems} />
      
      {/* Your page content goes here */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Welcome to Your App</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Resize your browser to see the mobile menu in action!
        </p>
      </main>
    </div>
  );
};
