"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "../../../store/authStore";

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef([]);
  
  const { verifyOTP, resendOTP, isLoading, error, clearError } = useAuthStore();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    clearError();

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, 6).split("");
    
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6 && /^\d$/.test(digit)) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);
    
    // Focus last filled input or next empty one
    const lastFilledIndex = newOtp.findLastIndex(digit => digit !== "");
    const nextEmptyIndex = newOtp.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(lastFilledIndex + 1, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    const result = await verifyOTP(email, otpString);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
    // Error is handled automatically by the store
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(60);
    const result = await resendOTP(email);
    
    if (result.success) {
      setOtp(["", "", "", "", "", ""]);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
            <p className="text-gray-400 mb-6">
              Your email has been successfully verified. 
              You can now sign in to your account.
            </p>
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-400">Redirecting to login...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-white">
              FineSight
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify your email</h1>
            <p className="text-gray-400 mb-2">
              We sent a 6-digit code to
            </p>
            <p className="text-white font-semibold">{email}</p>
          </div>

          {/* OTP Form */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors bg-gray-800 text-white"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {(error || otpError) && (
                <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-300 text-sm">{error || otpError}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className={`w-full btn-primary py-3 text-lg font-semibold ${
                  isLoading || otp.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0}
                  className={`text-blue-400 hover:text-blue-300 font-semibold text-sm ${
                    resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s` 
                    : "Resend code"
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Back to Register */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Wrong email address?{" "}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold">
                Go back to registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function VerifyOTPLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-white">
              FineSight
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Loading Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
            <p className="text-gray-400">Preparing verification page</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<VerifyOTPLoading />}>
      <VerifyOTPContent />
    </Suspense>
  );
}
