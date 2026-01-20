import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Import the guard we just created

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
                {/* --- PUBLIC ROUTES --- */}
                {/* Accessible to anyone. If they are already logged in, 
                    the Auth page logic should ideally redirect them to "/" automatically */}
                <Route path="/auth" element={<Auth />} />

                {/* --- PRIVATE ROUTES (LOCKED) --- */}
                {/* The ProtectedRoute wrapper checks for a session. 
                    If no session, it forces a redirect to /auth */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/collaborations" element={<Collaborations />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ai-tools" element={<AITools />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Catch all - Redirects 404s to Dashboard (which will then redirect to Auth if needed) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;