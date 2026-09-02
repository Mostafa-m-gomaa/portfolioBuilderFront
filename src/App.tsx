import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from "@/lib/googleAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RequireAuth from "./components/RequireAuth";
import GuestOnly from "./components/GuestOnly";
import PaymentStatusRedirect from "./components/payment/PaymentStatusRedirect";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import CommentExitGate from "./components/auth/CommentExitGate";
import MetaPixelTracker from "./components/MetaPixelTracker";
import PageSkeleton from "./components/PageSkeleton";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PackageDetail = lazy(() => import("./pages/PackageDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const GoogleSignUpComplete = lazy(() => import("./pages/GoogleSignUpComplete"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ChooseSubdomain = lazy(() => import("./pages/ChooseSubdomain"));
const SetupSiteContent = lazy(() => import("./pages/SetupSiteContent"));
const SiteReady = lazy(() => import("./pages/SiteReady"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const QuickStart = lazy(() => import("./pages/QuickStart"));
const SectionEditor = lazy(() => import("./pages/SectionEditor"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const SelectSubscription = lazy(() => import("./pages/SelectSubscription"));
const TemplateSelector = lazy(() => import("./pages/TemplateSelector"));
const PublicTemplates = lazy(() => import("./pages/PublicTemplates"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

const queryClient = new QueryClient();

const AppShell = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MetaPixelTracker />
            <PaymentStatusRedirect />
            <WhatsAppFloatingButton />
            <CommentExitGate />
            <div className="relative min-h-screen overflow-x-clip">
              <Suspense fallback={<PageSkeleton />}>
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
                  <Route
                    path="/signup/google"
                    element={<GuestOnly><GoogleSignUpComplete /></GuestOnly>}
                  />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/quickstart" element={<QuickStart />} />
                  <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/choose-subdomain" element={<ChooseSubdomain />} />
                  <Route path="/setup-site-content" element={<RequireAuth><SetupSiteContent /></RequireAuth>} />
                  <Route path="/site-ready" element={<RequireAuth><SiteReady /></RequireAuth>} />
                  <Route path="/select-subscription" element={<RequireAuth><SelectSubscription /></RequireAuth>} />
                  <Route path="/select-language-mode" element={<Navigate to="/dashboard" replace />} />
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
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const App = () =>
  isGoogleAuthConfigured() ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppShell />
    </GoogleOAuthProvider>
  ) : (
    <AppShell />
  );

export default App;
