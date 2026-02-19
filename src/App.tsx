import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GetStarted from "./pages/GetStarted";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";
import ChooseSubdomain from "./pages/ChooseSubdomain";
import Dashboard from "./pages/Dashboard";
import SectionEditor from "./pages/SectionEditor";
import RequireAuth from "./components/RequireAuth";
import ResetPassword from "./pages/ResetPassword";
import GuestOnly from "./components/GuestOnly";
import Profile from "./pages/Profile";
import SelectLanguageMode from "./pages/SelectLanguageMode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/choose-subdomain" element={<ChooseSubdomain />} />
              <Route path="/select-language-mode" element={<RequireAuth><SelectLanguageMode /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/section/:sectionName/editor" element={<RequireAuth><SectionEditor /></RequireAuth>} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
