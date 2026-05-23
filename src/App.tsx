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
import PackageDetail from "./pages/PackageDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GetStarted from "./pages/GetStarted";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";
import ChooseSubdomain from "./pages/ChooseSubdomain";
import Dashboard from "./pages/Dashboard";
import SectionEditor from "./pages/SectionEditor";
import RequireAuth from "./components/RequireAuth";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import GuestOnly from "./components/GuestOnly";
import Profile from "./pages/Profile";
import SelectLanguageMode from "./pages/SelectLanguageMode";
import SelectSubscription from "./pages/SelectSubscription";
import TemplateSelector from "./pages/TemplateSelector";
import PublicTemplates from "./pages/PublicTemplates";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentStatusRedirect from "./components/payment/PaymentStatusRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PaymentStatusRedirect />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/pricing/:packageId" element={<PackageDetail />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/choose-subdomain" element={<ChooseSubdomain />} />
              <Route path="/select-subscription" element={<RequireAuth><SelectSubscription /></RequireAuth>} />
              <Route path="/select-language-mode" element={<RequireAuth><SelectLanguageMode /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/templates" element={<PublicTemplates />} />
              <Route path="/template-selector" element={<RequireAuth><TemplateSelector /></RequireAuth>} />
              <Route path="/section/:sectionName/editor" element={<RequireAuth><SectionEditor /></RequireAuth>} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
