
'use client';

import React from 'react';
import { HistoryCard } from '../src/components/HistoryCard';
import { useHistory } from '../src/contexts/HistoryContext';

const HistoryPage: React.FC = () => {
  const { history, pinItem, deleteItem, viewFromHistory } = useHistory();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Redesign History</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pinned designs are saved indefinitely. Others are removed after 7 days.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M3 14h18M10 3v18M14 3v18" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">No History Yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a new redesign, and it will show up here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map(item => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={viewFromHistory}
              onPin={pinItem}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const dynamic = 'force-dynamic';

export async function getServerSideProps() {
  return { props: {} };
}

export default HistoryPage;
