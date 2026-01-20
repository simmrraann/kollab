import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Collaborations from "./pages/Collaborations";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import AITools from "./pages/AITools";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth/Auth";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth */}
                <Route path="/auth" element={<Auth />} />

                {/* App */}
                <Route path="/" element={<Index />} />
                <Route path="/collaborations" element={<Collaborations />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
