import React from 'react';
import { LANDSCAPING_STYLES } from '../../constants';
import type { LandscapingStyle } from '../../types';

interface StyleSelectorProps {
  selectedStyle: LandscapingStyle;
  onStyleSelect: (style: LandscapingStyle) => void;
  allowStructuralChanges: boolean;
  onAllowStructuralChanges: (allow: boolean) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  allowStructuralChanges,
  onAllowStructuralChanges,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LANDSCAPING_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-emerald-500 ${
              selectedStyle === style.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-pressed={selectedStyle === style.id}
          >
            {style.name}
          </button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={allowStructuralChanges}
            onChange={(e) => onAllowStructuralChanges(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            Allow structural changes
          </span>
        </label>
         <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-7">
            E.g., adding walls, gates, decks, or altering vehicles.
        </p>
      </div>
    </div>
  );
};