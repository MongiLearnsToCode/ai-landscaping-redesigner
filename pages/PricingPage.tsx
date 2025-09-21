import React, { useState } from 'react';
// FIX: The 'Page' type is exported from AppContext, not App.
import type { Page } from '../contexts/AppContext';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

type BillingCycle = 'monthly' | 'annual';

const PlanCard: React.FC<{
  plan: string;
  price: string;
  pricePer: string;
  monthlyBreakdown?: string;
  savings?: string;
  imageCount: string;
  description: string;
  cta: string;
  isPopular?: boolean;
  ribbonText?: string;
}> = ({ plan, price, pricePer, monthlyBreakdown, savings, imageCount, description, cta, isPopular, ribbonText }) => {
  const cardClasses = isPopular
    ? 'border-emerald-500 dark:border-emerald-400 border-2 transform md:scale-105 shadow-2xl'
    : 'border-gray-200 dark:border-gray-700 border';

  const buttonClasses = isPopular
    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
    : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col ${cardClasses} transition-transform duration-300`}>
      {isPopular && ribbonText && (
        <div className="absolute top-0 right-0 mr-4 -mt-3">
          <div className="bg-amber-400 text-white text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 shadow-md">
            {ribbonText}
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{plan}</h3>
      <div className="mt-4 min-h-[90px]">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{price}</span>
          <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">{pricePer}</span>
        </div>
        {monthlyBreakdown && <p className="text-gray-500 dark:text-gray-400 mt-1">{monthlyBreakdown}</p>}
        {savings && <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">{savings}</p>}
      </div>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{imageCount}</p>
      
      <div className="my-8 h-px bg-gray-200 dark:bg-gray-700"></div>

      <p className="text-center text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
      
      <a href="#" className={`w-full mt-8 block text-center font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${buttonClasses}`}>
        {cta}
      </a>
    </div>
  );
};


export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
          Choose the plan that's right for you
        </h2>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Start for free, then unlock more features and designs as you grow.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center items-center my-10">
        <span className={`px-4 py-2 font-medium transition ${billingCycle === 'monthly' ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'}`}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
          aria-label={`Switch to ${billingCycle === 'monthly' ? 'annual' : 'monthly'} billing`}
        >
          <span
            className={`${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </button>
        <span className={`px-4 py-2 font-medium transition ${billingCycle === 'annual' ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'}`}>
          Annual
          <span className="ml-2 text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 rounded-full px-2 py-0.5">Save up to 33%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PlanCard 
            plan="Personal"
            price={billingCycle === 'monthly' ? "$12" : "$120"}
            pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
            monthlyBreakdown={billingCycle === 'annual' ? '($10/month)' : undefined}
            savings={billingCycle === 'annual' ? 'Save $24 (17%)' : undefined}
            imageCount="50 images"
            description="For casual users or hobbyists"
            cta="Get Personal"
        />
        <PlanCard 
            plan="Creator"
            price={billingCycle === 'monthly' ? "$29" : "$240"}
            pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
            monthlyBreakdown={billingCycle === 'annual' ? '($20/month)' : undefined}
            savings={billingCycle === 'annual' ? 'Save $108 (31%)' : undefined}
            imageCount="200 images"
            description="Best for regular creators & freelancers"
            cta="Choose Creator"
            isPopular={true}
            ribbonText={billingCycle === 'annual' ? 'Most Valuable' : 'Most Popular'}
        />
        <PlanCard 
            plan="Business"
            price={billingCycle === 'monthly' ? "$60" : "$480"}
            pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
            monthlyBreakdown={billingCycle === 'annual' ? '($40/month)' : undefined}
            savings={billingCycle === 'annual' ? 'Save $240 (33%)' : undefined}
            imageCount="Unlimited* images"
            description="For teams, agencies & power users"
            cta="Go Business"
        />
      </div>

      <div className="mt-12 pt-8 text-center border-t border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 dark:text-gray-300">
            Want to try it out first? Get 5 images free →
            <button
                onClick={() => onNavigate('main')}
                className="ml-2 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
                Start Free
            </button>
        </p>
      </div>

      <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * 'Unlimited' is subject to a fair use policy to prevent abuse.
          </p>
      </div>
    </div>
  );
};