import React, { useState, useCallback } from 'react';
import type { DesignCatalog as DesignCatalogType } from '../../types';
import { PlantIcon } from './icons/PlantIcon';
import { FeatureIcon } from './icons/FeatureIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { useToast } from '../contexts/ToastContext';

interface DesignCatalogProps {
  catalog: DesignCatalogType | null;
}

export const DesignCatalog: React.FC<DesignCatalogProps> = ({ catalog }) => {
  const { addToast } = useToast();
  
  const hasPlants = catalog?.plants && catalog.plants.length > 0;
  const hasFeatures = catalog?.features && catalog.features.length > 0;

  const handleCopy = useCallback(() => {
    if (!catalog) return;

    let textToCopy = "Design Elements:\n\n";

    if (hasPlants) {
      textToCopy += "Plants & Flora:\n";
      catalog.plants.forEach(p => {
        textToCopy += `- ${p.name} (${p.species})\n`;
      });
      textToCopy += "\n";
    }

    if (hasFeatures) {
      textToCopy += "Furniture & Features:\n";
      catalog.features.forEach(f => {
        textToCopy += `- ${f.name}: ${f.description}\n`;
      });
    }

    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
      addToast("Design elements copied to clipboard!", "success");
    }).catch(err => {
      addToast("Failed to copy list.", "error");
    });
  }, [catalog, hasPlants, hasFeatures, addToast]);

  if (!hasPlants && !hasFeatures) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">Design Elements</h4>
        <button 
          onClick={handleCopy}
          className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
        >
          <ClipboardIcon className="h-4 w-4 mr-2" />
          Copy List
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {hasPlants && (
          <div className="space-y-3">
            <h5 className="flex items-center text-md font-semibold text-gray-600 dark:text-gray-400">
              <PlantIcon className="h-5 w-5 mr-2 text-emerald-500" />
              Plants & Flora
            </h5>
            <ul className="space-y-2 pl-1">
              {catalog.plants.map((plant, index) => (
                <li key={index} className="p-2 rounded-md bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{plant.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{plant.species}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasFeatures && (
          <div className="space-y-3">
            <h5 className="flex items-center text-md font-semibold text-gray-600 dark:text-gray-400">
              <FeatureIcon className="h-5 w-5 mr-2 text-sky-500" />
              Furniture & Features
            </h5>
            <ul className="space-y-2 pl-1">
              {catalog.features.map((feature, index) => (
                <li key={index} className="p-2 rounded-md bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50">
                   <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{feature.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
