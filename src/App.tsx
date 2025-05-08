
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
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";

// Create a new query client with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/inventory" element={
              <AppLayout>
                <Inventory />
              </AppLayout>
            } />
            <Route path="/sales" element={
              <AppLayout>
                <Sales />
              </AppLayout>
            } />
            <Route path="/customers" element={
              <AppLayout>
                <Customers />
              </AppLayout>
            } />
            <Route path="/reports" element={
              <AppLayout>
                <Reports />
              </AppLayout>
            } />
            <Route path="/analytics" element={
              <AppLayout>
                <Analytics />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p className="text-muted-foreground">Application settings page is under development.</p>
                </div>
              </AppLayout>
            } />
            <Route path="/about" element={
              <AppLayout>
                <About />
              </AppLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
