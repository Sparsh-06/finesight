"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import HeroSectionOne from "@/components/hero-section-demo-1";
import Features from "@/components/ui/Features";
import Pricing from "@/components/ui/Pricing";
import Testimonials from "@/components/ui/Testimonials";
import Footer from "@/components/ui/Footer";
import JourneySteps from "@/components/ui/Features";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "LegalDoc AI saved me thousands in legal fees. I finally understand my contracts!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      content:
        "The risk analysis feature caught clauses that could have cost us our business.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Consultant",
      content:
        "Now I can review client contracts confidently without hiring a lawyer every time.",
      avatar: "ER",
    },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
    <div className="bg-black min-h-screen">
      {/* Demo Banner for Judges */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-4 text-center relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm sm:text-base">Demo Available for Judges & Testers</span>
          </div>
          <Link
            href="/auth/login?demo=true"
            className="bg-white text-blue-600 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-xs sm:text-sm"
          >
            Try Demo Now →
          </Link>
        </div>
      </div>
      
      <div className="min-h-screen w-full bg-black relative">
        {/* Dark Noise Colored Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
          }}
        />
        
        {/* Main Content */}
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <JourneySteps />
          <Testimonials />
          <Pricing />
          <Footer />
        </div>
      </div>
    </div>
    </ReactLenis>
  );
}
