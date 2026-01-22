'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];

/**
 * AuthenticatedLayout Component
 * Wraps the app content and handles authentication-based rendering
 * - Shows loading spinner while checking auth state
 * - Shows Sidebar + content for authenticated users
 * - Shows only content (no sidebar) for public routes like /login
 */
export default function AuthenticatedLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">
          <Loader2 size={40} className="auth-spinner" />
          <p>Chargement...</p>
        </div>
        <style jsx>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
          }
          .auth-loading-content {
            text-align: center;
            color: var(--text-secondary);
          }
          .auth-loading-content p {
            margin-top: 1rem;
          }
          :global(.auth-spinner) {
            animation: spin 1s linear infinite;
            color: var(--accent-primary);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Public routes (like /login) - render without sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected routes - render with sidebar if authenticated
  // If not authenticated, the page component should redirect to /login
  if (!isAuthenticated) {
    // For development, show content anyway since we mock the auth
    // In production, you would redirect to /login here
    // return <Navigate to="/login" />
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
