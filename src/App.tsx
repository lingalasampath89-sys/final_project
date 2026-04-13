import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider, useAuth } from "@/lib/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Features from "./pages/Features";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BackgroundVideo from "@/components/BackgroundVideo";
import Footer from "@/components/Footer";
import Docs from "./pages/Docs";
import SchemaLibrary from "./pages/SchemaLibrary";
import ApiReference from "./pages/ApiReference";
import Support from "./pages/Support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Services from "./pages/Services";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const publicPages = [
    "/", "/features", "/services", "/about", 
    "/docs", "/schema-library", "/api-reference", 
    "/support", "/privacy-policy", "/terms"
  ];
  const showFooter = publicPages.includes(location.pathname) || location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col relative bg-transparent">
      <BackgroundVideo />
      <Navbar />
      <main className="flex-grow relative z-10 bg-transparent">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/features" element={<Features />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          
          {/* New Footer Pages */}
          <Route path="/docs" element={<Docs />} />
          <Route path="/schema-library" element={<SchemaLibrary />} />
          <Route path="/api-reference" element={<ApiReference />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId="517246536021-4sq6b9qknaoethgglfveh9hsvliaft21.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;