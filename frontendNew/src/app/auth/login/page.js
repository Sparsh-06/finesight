"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "../../../store/authStore";
import Navbar from "@/components/ui/Navbar";

function LoginContent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [creatingDemo, setCreatingDemo] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();

  const demoCredentials = {
    email: "demo@finesight.com",
    password: "demo123",
    username: "Demo User",
  };

  // Auto-login with demo if URL has ?demo=true
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      loginWithDemo();
    }
  }, [searchParams]);

  const createDemoAccount = async () => {
    setCreatingDemo(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/create-test-account`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (res.ok) {
        setFormData({
          email: demoCredentials.email,
          password: demoCredentials.password,
        });
        clearError();
      }
    } catch (err) {
      console.error("Error creating demo account:", err);
    } finally {
      setCreatingDemo(false);
    }
  };

  const loginWithDemo = async () => {
    await createDemoAccount();
    const result = await login({ 
      email: demoCredentials.email, 
      password: demoCredentials.password 
    });
    if (result.success) router.push("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ 
      email: formData.email, 
      password: formData.password 
    });
    if (result.success) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your FineSight account</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-2xl text-white">
            {/* Demo Access */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Demo Access for Judges</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Click below to instantly access the platform with a pre-loaded demo account
                </p>
                <button
                  type="button"
                  onClick={loginWithDemo}
                  disabled={creatingDemo || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingDemo || isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up demo...
                    </div>
                  ) : (
                    "Login as Demo User"
                  )}
                </button>
                <div className="mt-3 text-xs text-gray-400">
                  <strong>Demo Credentials:</strong> demo@finesight.com / demo123
                </div>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-gray-400">Or sign in manually</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-800 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-800 text-white placeholder-gray-400 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
