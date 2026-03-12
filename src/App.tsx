import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { RequireAuth, AuthProvider } from "@/hooks/useAuth";
import { CustomCursor } from "@/components/CustomCursor";
import AdminGuard from "@/components/AdminGuard";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPrep from "./pages/InterviewPrep";
import Roadmaps from "./pages/Roadmaps";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AIRoadmap from "./pages/AIRoadmap";
import MyAIRoadmaps from "./pages/MyAIRoadmaps";
import Certificates from "./pages/Certificates";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AICoursePlayer from "./pages/AICoursePlayer";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoadmaps from "./pages/admin/AdminRoadmaps";
import AdminInterviews from "./pages/admin/AdminInterviews";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {

  const location = useLocation();

  return (

    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={<RequireAuth><Dashboard /></RequireAuth>}
        />

        <Route
          path="/interview-history"
          element={<RequireAuth><InterviewHistory /></RequireAuth>}
        />

        <Route
          path="/resume-builder"
          element={<RequireAuth><ResumeBuilder /></RequireAuth>}
        />

        <Route
          path="/interview-prep"
          element={<RequireAuth><InterviewPrep /></RequireAuth>}
        />

        <Route
          path="/roadmaps"
          element={<RequireAuth><Roadmaps /></RequireAuth>}
        />

        <Route
          path="/profile"
          element={<RequireAuth><Profile /></RequireAuth>}
        />

        <Route
          path="/ai-roadmap"
          element={<RequireAuth><AIRoadmap /></RequireAuth>}
        />

        <Route
          path="/my-ai-roadmaps"
          element={<RequireAuth><MyAIRoadmaps /></RequireAuth>}
        />

        <Route
          path="/certifications"
          element={<RequireAuth><Certificates /></RequireAuth>}
        />

        <Route
          path="/ai-course-player"
          element={<RequireAuth><AICoursePlayer /></RequireAuth>}
        />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >

          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<AdminUsers />} />

          <Route path="roadmaps" element={<AdminRoadmaps />} />

          <Route path="interviews" element={<AdminInterviews />} />

        </Route>

        {/* 404 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </AnimatePresence>

  );

};

const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <AuthProvider>

        <BrowserRouter>

          <CustomCursor />

          <AnimatedRoutes />

        </BrowserRouter>

      </AuthProvider>

    </TooltipProvider>

  </QueryClientProvider>

);

export default App;