import React, { useState, useEffect } from 'react';
import type { HistoryItem } from '../../types';
import { Pin, Trash2 } from 'lucide-react';
import { ImageWithLoader } from './ImageWithLoader';

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onView, onPin, onDelete }) => {
  const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700">
        <ImageWithLoader src={item.redesigned_image_url} alt={`Redesign in ${item.style} style`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex flex-col justify-end">
            <h4 className="text-white font-bold capitalize">{item.style}</h4>
            <p className="text-xs text-gray-300">{formattedDate}</p>
        </div>
        {item.is_pinned && (
            <div className="absolute top-2 right-2 bg-amber-400 p-1.5 rounded-full shadow-md">
                <Pin className="h-4 w-4 text-white" fill="currentColor" />
            </div>
        )}
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex-grow flex flex-col justify-between">
         <div className="flex items-center justify-between space-x-2">
             <button
                 onClick={() => onView(item)}
                 className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold px-2 md:px-3 py-2 rounded-md transition-colors"
             >
                 View
             </button>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <button onClick={(e) => { e.stopPropagation(); onPin(item.id); }} className="p-1.5 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200">
            <Pin className={`h-5 w-5 ${item.is_pinned ? 'text-amber-500 dark:text-amber-300' : 'text-gray-600 dark:text-gray-300'}`} fill={item.is_pinned ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-1.5 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200 group">
            <Trash2 className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </button>
        </div>
         </div>
      </div>
    </div>
  );
};