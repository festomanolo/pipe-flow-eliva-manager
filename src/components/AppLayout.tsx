
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ChartPie, ShoppingCart, Settings, Package, Users, FileText, 
  ChartBar, Menu, X, LogOut 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
      "nav-link",
      active && "active"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const links = [
    { to: "/", icon: <ChartPie size={20} />, label: "Dashboard" },
    { to: "/inventory", icon: <Package size={20} />, label: "Inventory" },
    { to: "/sales", icon: <ShoppingCart size={20} />, label: "Sales" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/analytics", icon: <ChartBar size={20} />, label: "Analytics" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
    { to: "/about", icon: <Users size={20} />, label: "About" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-eliva-background transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar h-full flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-white/10 transition-all",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden md:w-20"
        )}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h1 
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-eliva-accent to-eliva-purple bg-clip-text text-transparent", 
              !isSidebarOpen && "md:hidden"
            )}
          >
            Eliva Hardware
          </h1>
          {isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="p-4 flex justify-center hidden md:block"
          >
            <Menu size={20} className="text-sidebar-foreground" />
          </button>
        )}
        
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={location.pathname === link.to}
            />
          ))}
        </nav>
        
        <div className="p-3 border-t border-white/10">
          <button className="nav-link w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-eliva-purple flex items-center justify-center text-white font-medium">
                A
              </div>
              {isSidebarOpen && <span>Admin User</span>}
            </div>
            {isSidebarOpen && <LogOut size={18} />}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center px-4 bg-white/50 dark:bg-sidebar/50 backdrop-blur-md">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground md:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold">
              {links.find(link => link.to === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="glass-button text-sm">
              <ShoppingCart size={16} className="mr-2 inline" />
              New Sale
            </button>
          </div>
        </header>
        
        {/* Content Area with Background Pattern */}
        <div 
          className="flex-1 overflow-y-auto scrollbar-none p-6 dark:bg-mesh-pattern light:bg-light-mesh-pattern bg-opacity-5 dark:bg-opacity-5 transition-colors duration-300"
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
