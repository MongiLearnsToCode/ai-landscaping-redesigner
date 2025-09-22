import React, { useState, useEffect } from 'react';
import type { HistoryItem } from '../../types';
import { PinIcon } from './icons/PinIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ImageWithLoader } from './ImageWithLoader';
import * as imageDB from '../services/imageDB';

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onView, onPin, onDelete }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setIsLoading(true);
      const imageData = await imageDB.getImage(item.redesignedImageInfo.id);
      if (isMounted && imageData) {
        setImageUrl(`data:${imageData.type};base64,${imageData.base64}`);
      }
      // You could add error handling here if image is not found
      setIsLoading(false);
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [item.redesignedImageInfo.id]);

  const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700">
        {imageUrl ? (
            <ImageWithLoader src={imageUrl} alt={`Redesign in ${item.style} style`} />
        ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex flex-col justify-end">
            <h4 className="text-white font-bold capitalize">{item.style}</h4>
            <p className="text-xs text-gray-300">{formattedDate}</p>
        </div>
        {item.isPinned && (
            <div className="absolute top-2 right-2 bg-amber-400 p-1.5 rounded-full shadow-md">
                <PinIcon className="h-4 w-4 text-white" filled />
            </div>
        )}
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex-grow flex flex-col justify-between">
         <div className="flex items-center justify-between space-x-2">
            <button
                onClick={() => onView(item)}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-md transition-colors"
            >
                View
            </button>
            <button
                onClick={() => onPin(item.id)}
                title={item.isPinned ? 'Unpin' : 'Pin'}
                className={`p-2 rounded-md transition-colors ${item.isPinned ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-800 dark:hover:bg-amber-700' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'}`}
                aria-label={item.isPinned ? 'Unpin item' : 'Pin item'}
            >
                <PinIcon className={`h-5 w-5 ${item.isPinned ? 'text-amber-500 dark:text-amber-300' : 'text-gray-600 dark:text-gray-300'}`} filled={item.isPinned} />
            </button>
             <button
                onClick={() => onDelete(item.id)}
                title="Delete"
                className="p-2 rounded-md bg-gray-200 hover:bg-red-200 dark:bg-gray-600 dark:hover:bg-red-800 transition-colors"
                aria-label="Delete item"
            >
                <TrashIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </button>
         </div>
      </div>
    </div>
  );
};