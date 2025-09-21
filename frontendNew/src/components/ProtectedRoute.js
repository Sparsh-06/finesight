"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, accessToken, refreshToken, initializeAuth, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Initialize auth state from localStorage
      await initializeAuth();
      setIsChecking(false);
    };

    checkAuthentication();
  }, [initializeAuth]);

  useEffect(() => {
    // Check if we have valid authentication data after initialization
    if (!isChecking) {
      const hasValidAuth = checkAuth();

      if (!hasValidAuth) {
        router.push("/auth/login");
      }
    }
  }, [isChecking, isAuthenticated, user, accessToken, refreshToken, router, checkAuth]);

  // Show loading while checking authentication
  if (isChecking || (!isAuthenticated || !user || !accessToken || !refreshToken)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
}