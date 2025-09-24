import React from 'react';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
    return (
        <Link href={href} className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
            {children}
        </Link>
    );
};

export const Footer: React.FC = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
                <FooterLink href="/PricingPage">Pricing</FooterLink>
                <FooterLink href="/ContactPage">Contact</FooterLink>
                <FooterLink href="/TermsPage">Terms of Service</FooterLink>
                <FooterLink href="/PrivacyPage">Privacy Policy</FooterLink>
                {user && <button onClick={() => supabase.auth.signOut()} className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Sign Out</button>}
            </div>
            <div className="flex items-center gap-4">
              <a href={process.env.NEXT_PUBLIC_POLAR_PROJECT_URL || '#'} target="_blank" rel="noopener noreferrer">
                <img src="https://polar.sh/embed/fund-us.svg" alt="Fund us on Polar" />
              </a>
              <a
                href="mailto:feedback@example.com?subject=Feedback%20for%20AI%20Landscaping%20Redesigner"
                className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-emerald-500"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Provide Feedback
              </a>
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} AI Landscaping Redesigner. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};