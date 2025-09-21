import React from 'react';

interface ClimateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClimateSelector: React.FC<ClimateSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="climate-zone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Location or Climate Zone
      </label>
      <input
        type="text"
        id="climate-zone"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Southern California, USDA Zone 9b"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
      />
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Helps the AI choose appropriate plants.
      </p>
    </div>
  );
};