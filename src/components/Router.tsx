import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

// Pages
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import AssessmentPage from '@/components/pages/AssessmentPage';
import GapAnalysisPage from '@/components/pages/GapAnalysisPage';
import RoadmapPage from '@/components/pages/RoadmapPage';
import ProgressPage from '@/components/pages/ProgressPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute>
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your dashboard">
            <DashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "assessment",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to take the skill assessment">
            <AssessmentPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "gap-analysis",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your skill gap analysis">
            <GapAnalysisPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "roadmap",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your learning roadmap">
            <RoadmapPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "progress",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to track your progress">
            <ProgressPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
