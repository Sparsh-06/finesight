import React from "react";
import { WobbleCard } from "./wobble-card";

const Pricing = () => {
  return (
    <div className="relative z-20 py-10 lg:py-20 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Choose Your Plan
        </h4>
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Start analyzing legal documents today with plans designed for individuals and teams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full mt-12 px-8">
        {/* Free Plan */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-1 h-full bg-pink-800 min-h-[300px] lg:min-h-[350px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Starter
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Perfect for individuals getting started with document analysis
            </p>
            <div className="mt-6">
              <div className="text-4xl font-bold text-white">Free</div>
              <div className="text-sm text-neutral-300">Forever</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-neutral-200">
              <li>• 5 documents per month</li>
              <li>• Basic AI analysis</li>
              <li>• PDF support</li>
              <li>• Email support</li>
            </ul>
          </div>
        </WobbleCard>

        {/* Pro Plan */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-1 bg-blue-900 min-h-[300px] lg:min-h-[350px] xl:min-h-[400px]"
          className=""
        >
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Professional
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              For professionals who need advanced analysis and priority support
            </p>
            <div className="mt-6">
              <div className="text-4xl font-bold text-white">$29</div>
              <div className="text-sm text-neutral-300">per month</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-neutral-200">
              <li>• 100 documents per month</li>
              <li>• Advanced AI analysis</li>
              <li>• Risk assessment</li>
              <li>• Priority support</li>
              <li>• API access</li>
            </ul>
          </div>
        </WobbleCard>

        {/* Enterprise Plan */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-1 h-full bg-gradient-to-b from-slate-900 to-slate-800 min-h-[300px] lg:min-h-[350px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Enterprise
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Custom solutions for large organizations with specific needs
            </p>
            <div className="mt-6">
              <div className="text-4xl font-bold text-white">Custom</div>
              <div className="text-sm text-neutral-300">Contact sales</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-neutral-200">
              <li>• Unlimited documents</li>
              <li>• Custom integrations</li>
              <li>• Dedicated support</li>
              <li>• On-premise deployment</li>
              <li>• SLA guarantee</li>
            </ul>
          </div>
        </WobbleCard>
      </div>
    </div>
  );
};

export default Pricing;
