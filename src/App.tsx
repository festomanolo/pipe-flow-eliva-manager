
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const auth = localStorage.getItem('elivaAuth') === 'true';
      setIsAuthenticated(auth);
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    // Could show a loading spinner here
    return null;
  }
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <AuthRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/inventory" element={
            <AuthRoute>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/sales" element={
            <AuthRoute>
              <AppLayout>
                <Sales />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/customers" element={
            <AuthRoute>
              <AppLayout>
                <Customers />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/reports" element={
            <AuthRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/analytics" element={
            <AuthRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="/settings" element={
            <AuthRoute>
              <AppLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p className="text-muted-foreground">Application settings page is under development.</p>
                </div>
              </AppLayout>
            </AuthRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
