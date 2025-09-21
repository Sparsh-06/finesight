import React from "react";
import { AnimatedTestimonials } from "./animated-testimonials";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      designation: "Small Business Owner",
      quote: "FineSight saved me thousands in legal fees. I finally understand my contracts and can make informed decisions without calling my lawyer every time. The AI explanations are clear and actionable.",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Michael Chen",
      designation: "Startup Founder",
      quote: "The risk analysis feature caught clauses that could have cost us our business. This tool is essential for any entrepreneur dealing with contracts. The accuracy is impressive.",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Emily Rodriguez",
      designation: "Freelance Consultant",
      quote: "Now I can review client contracts confidently without hiring a lawyer every time. The platform has revolutionized how I handle document review and client communications.",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "David Park",
      designation: "Legal Assistant",
      quote: "This tool has transformed our legal workflow. What used to take hours now takes minutes. The enterprise features and custom integrations work perfectly with our existing systems.",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jennifer Lee",
      designation: "Real Estate Agent",
      quote: "Contract analysis has never been easier. I can quickly identify potential issues and explain them clearly to my clients. The AI-powered insights give me confidence in every deal.",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ];

  return (
    <div className="relative z-20 py-10 lg:py-20">
      <div className="px-8 mb-12">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Trusted by Professionals
        </h4>
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          See how legal professionals are transforming their workflow with AI-powered document analysis
        </p>
      </div>
      
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
};

export default Testimonials;
