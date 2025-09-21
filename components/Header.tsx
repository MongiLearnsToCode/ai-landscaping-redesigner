import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { useApp } from '../contexts/AppContext';

export const Header: React.FC = () => {
  const { navigateTo, page } = useApp();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigateTo('main')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('main') }}
          aria-label="Go to main designer page"
        >
            <LeafIcon className="h-10 w-10 text-emerald-600 mr-3" />
            <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Landscaping Redesigner</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transform your outdoor space with the power of AI</p>
            </div>
        </div>
        <nav className="flex items-center space-x-2">
            <button 
                onClick={() => navigateTo('main')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${page === 'main' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                Designer
            </button>
            <button 
                onClick={() => navigateTo('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${page === 'history' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                History
            </button>
        </nav>
      </div>
    </header>
  );
};
