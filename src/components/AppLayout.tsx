
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { 
  ChartPie, ShoppingCart, Settings, Package, Users, FileText, 
  ChartBar, Menu, X, LogOut 
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "nav-link relative overflow-hidden",
      active && "active"
    )}
  >
    <span className="z-10 relative flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </span>
    
    {/* Hover effect */}
    <span className="absolute inset-0 bg-sidebar-accent opacity-0 transform scale-x-0 origin-left transition-all duration-300 hover:opacity-100 hover:scale-x-100"></span>
  </Link>
);

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pageTransition, setPageTransition] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Trigger page transition animation when route changes
    if (currentPath !== location.pathname) {
      setPageTransition(true);
      const timer = setTimeout(() => {
        setPageTransition(false);
      }, 300); // Reduced from 500ms for smoother transitions
      setCurrentPath(location.pathname);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const links = [
    { to: "/", icon: <ChartPie size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Dashboard" },
    { to: "/inventory", icon: <Package size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Inventory" },
    { to: "/sales", icon: <ShoppingCart size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Sales" },
    { to: "/customers", icon: <Users size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Customers" },
    { to: "/reports", icon: <FileText size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Reports" },
    { to: "/analytics", icon: <ChartBar size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Analytics" },
    { to: "/settings", icon: <Settings size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-eliva-background dark:bg-eliva-background light:bg-eliva-light-background transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar h-full flex-shrink-0 flex flex-col border-r border-white/10 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden md:w-20"
        )}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h1 
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-eliva-accent to-eliva-purple bg-clip-text text-transparent transition-all duration-300", 
              !isSidebarOpen && "md:hidden"
            )}
          >
            Eliva Hardware
          </h1>
          {isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors duration-200"
            >
              <X size={18} className="transition-transform duration-200 hover:rotate-90" />
            </button>
          )}
        </div>
        
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="p-4 flex justify-center hidden md:block"
          >
            <Menu size={20} className="text-sidebar-foreground transition-transform duration-200 hover:rotate-180" />
          </button>
        )}
        
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
          {links.map((link, index) => (
            <div
              key={link.to}
              className="group transition-transform ease-in-out"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                transitionDelay: `${index * 0.03}s`
              }}
            >
              <SidebarLink
                to={link.to}
                icon={link.icon}
                label={link.label}
                active={location.pathname === link.to}
              />
            </div>
          ))}
        </nav>
        
        <div className="p-3 border-t border-white/10">
          <button className="nav-link w-full justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-eliva-purple flex items-center justify-center text-white font-medium transition-all duration-300 group-hover:scale-110">
                A
              </div>
              {isSidebarOpen && <span>Admin User</span>}
            </div>
            {isSidebarOpen && <LogOut size={18} className="transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 flex items-center px-4 bg-sidebar/50 backdrop-blur-md transition-all duration-300">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors duration-200 md:hidden"
          >
            <Menu size={20} className="transition-transform duration-200 hover:rotate-90" />
          </button>
          
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold transition-opacity duration-200 ease-in-out">
              {links.find(link => link.to === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <button className="glass-button text-sm group overflow-hidden relative">
              <span className="relative z-10 flex items-center">
                <ShoppingCart size={16} className="mr-2 inline transition-transform duration-300 group-hover:rotate-12" />
                New Sale
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-eliva-purple/40 to-eliva-accent/40 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
            </button>
          </div>
        </header>
        
        {/* Content Area with Background Pattern */}
        <div 
          className={cn(
            "flex-1 overflow-y-auto scrollbar-none p-6 bg-mesh-pattern dark:bg-mesh-pattern light:bg-light-mesh-pattern bg-opacity-5 transition-all duration-500 ease-in-out",
            pageTransition ? "opacity-50 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          <div className="transition-all duration-300 ease-in-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
