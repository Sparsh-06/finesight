"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextGenerateEffect } from "./text-generate-effect";
import { motion } from "motion/react";
import { FollowerPointerCard } from "./following-pointer";
const words = `Revolutionize your workflow with AI-powered document processing. Welcome to FineSight
`;

export function Hero() {
  const router = useRouter();
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoadingDemo(true);
    try {
      // Create demo account
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/auth/create-test-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Redirect to login page with demo flag
        router.push("/auth/login?demo=true");
      }
    } catch (error) {
      console.error("Error setting up demo:", error);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="mx-auto max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] flex flex-col items-center justify-center overflow-hidden rounded-md relative mt-10 sm:mt-20 lg:mt-40 z-10 px-4 sm:px-6">
      <h2 className="text-center">
        <span className="text-4xl sm:text-6xl lg:text-8xl text-white font-extrabold leading-tight">
          FineSight
        </span>
      </h2>
      <div className="w-full max-w-[90vw] sm:max-w-[70vw] lg:w-[40rem] text-center mb-6 sm:mb-8 lg:mb-10 z-10">
        <TextGenerateEffect words={words} />
      </div>

      {/* Demo Badge for Judges */}
      <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
        <span className="text-blue-300 text-sm font-medium">
          Demo Available for Judges & Testers
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto items-center">
        <button
          onClick={handleDemoLogin}
          disabled={isLoadingDemo}
          className="relative inline-flex h-12 w-full sm:w-auto overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {isLoadingDemo ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Setting up...
              </div>
            ) : (
              <>🚀 Try Demo</>
            )}
          </span>
        </button>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2 w-full sm:w-auto rounded-md border border-neutral-600 text-white hover:bg-gray-100 hover:text-black transition duration-200 text-sm font-medium"
        >
          Sign In
        </button>
      </div>
      {/* Hide image and pointer animation on mobile screens */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 1.2,
        }}
        className="relative z-10 mt-10 sm:mt-15 lg:mt-20 w-full max-w-8xl rounded-2xl sm:rounded-3xl border border-neutral-200 bg-neutral-100 p-2 sm:p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 hidden sm:block"
      >
        <div className="relative box-content max-h-[90vh] aspect-[1.7761332099907492] py-10 w-full">
          <iframe
            src="https://app.supademo.com/embed/cmftt9mz715at10k85dbv7x66?embed_v=2&utm_source=embed"
            loading="lazy"
            title="Finesight"
            allow="clipboard-write"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}