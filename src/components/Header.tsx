import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Header: React.FC = () => {
  const router = useRouter();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center cursor-pointer">
          <LeafIcon className="h-8 w-8 md:h-10 md:w-10 text-emerald-600 mr-2 md:mr-3" />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">AI Landscaping Redesigner</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Transform your outdoor space with the power of AI</p>
          </div>
        </Link>
        <nav className="flex items-center space-x-2">
          <Link href="/" className={`px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${router.pathname === '/' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            Designer
          </Link>
          <Link href="/HistoryPage" className={`px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${router.pathname === '/HistoryPage' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            History
          </Link>
        </nav>
      </div>
    </header>
  );
};