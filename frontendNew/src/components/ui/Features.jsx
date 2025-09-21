'use client';

import React, { useState, useEffect, useRef } from 'react';

// Sub-component for each step in the timeline
const TimelineStep = ({ stepNumber, badge, title, description, isLast = false }) => {
  return (
    <div className="flex">
      {/* Timeline Gutter (Icon and Line) */}
      <div className="flex flex-col items-center mr-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 border-2 border-gray-700 rounded-full">
          <span className="text-xl font-bold text-blue-400">{stepNumber}</span>
        </div>
        {!isLast && <div className="w-px h-full bg-gray-700"></div>}
      </div>
      {/* Content */}
      <div className="pb-16">
        <div className="inline-block bg-gray-800 border border-gray-700 rounded-md px-3 py-1 mb-3">
          <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">{badge}</p>
        </div>
        <h4 className="text-2xl font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default function LegalAnalysisJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  const steps = [
    {
      badge: "Document Upload",
      title: "1. Upload Your Document",
      description: "Simply drag and drop your legal document or paste text directly. We support PDF, Word, and plain text formats with enterprise-grade security.",
      visual: "📄"
    },
    {
      badge: "AI Processing",
      title: "2. AI Analysis Begins",
      description: "Our advanced AI models scan your document, identifying key clauses, terms, and potential areas of concern using natural language processing.",
      visual: "🧠"
    },
    {
      badge: "Risk Assessment",
      title: "3. Risk Identification",
      description: "The system automatically flags high-risk clauses, unusual terms, and potential compliance issues while calculating an overall risk score.",
      visual: "⚠️"
    },
    {
      badge: "Smart Insights",
      title: "4. Generate Insights",
      description: "Receive detailed analysis including clause-by-clause breakdown, plain English explanations, and actionable recommendations.",
      visual: "💡"
    },
    {
      badge: "Review & Recommendations",
      title: "5. Expert Recommendations",
      description: "Get AI-powered suggestions for contract improvements, negotiation points, and legal best practices tailored to your document type.",
      visual: "✅"
    },
    {
      badge: "Export & Share",
      title: "6. Export Results",
      description: "Download comprehensive reports, share insights with your team, or integrate findings directly into your workflow via our API.",
      visual: "📊"
    },
    {
      badge: "Continuous Learning",
      title: "7. Learn & Improve",
      description: "Our AI learns from each analysis, continuously improving accuracy and providing more nuanced insights for future documents.",
      visual: "🔄"
    },
  ];  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.step, 10);
            setActiveStep(stepIndex);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    const currentRefs = stepRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-5xl font-bold mb-4">Your Document Analysis Journey</h2>
          <h3 className="text-2xl text-gray-300">
            From Complex Legal Text to<br/>
            <em className="text-blue-400 not-italic">Clear, Actionable Insights</em>
          </h3>
          <p className="text-gray-400 mt-6 leading-relaxed">
            Experience how FineSight transforms complex legal documents into clear, understandable insights through our 7-step AI-powered analysis process.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2  gap-16">
          {/* Left Column: Timeline */}
          <div className="lg:col-span-1 border-r-2 border-gray-800 pr-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={el => stepRefs.current[index] = el}
                data-step={index}
              >
                <TimelineStep
                  stepNumber={index + 1}
                  badge={step.badge}
                  title={step.title}
                  description={step.description}
                  isLast={index === steps.length - 1}
                />
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Visual */}
          <div className="hidden mx-auto lg:block">
            <div className="sticky top-24">
              <div className="relative w-[516px] h-[458px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                      activeStep === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="text-center p-8">
                      <div className="text-8xl mb-6">{step.visual}</div>
                      <h4 className="text-2xl font-bold text-white mb-4">{step.title}</h4>
                      <p className="text-gray-400 text-lg">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
);
}