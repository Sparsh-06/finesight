"use client";

import { useEffect } from "react";
import useAuthStore from "../store/authStore";

export default function AuthProvider({ children }) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
}
