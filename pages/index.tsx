
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from '../src/components/ImageUploader';
import { StyleSelector } from '../src/components/StyleSelector';
import { ClimateSelector } from '../src/components/ClimateSelector';
import { ResultDisplay } from '../src/components/ResultDisplay';
import { redesignOutdoorSpace } from '../src/services/geminiService';
import { LANDSCAPING_STYLES } from '../constants';
import type { LandscapingStyle, ImageFile, DesignCatalog, HydratedHistoryItem } from '../types';
import { useApp } from '../src/contexts/AppContext';
import { useHistory } from '../src/contexts/HistoryContext';
import { useToast } from '../src/contexts/ToastContext';

// Define the shape of the state we want to persist
interface DesignerState {
  originalImage: ImageFile | null;
  selectedStyle: LandscapingStyle;
  allowStructuralChanges: boolean;
  climateZone: string;
}

const getInitialState = (): DesignerState => {
  return {
    originalImage: null,
    selectedStyle: LANDSCAPING_STYLES[0].id,
    allowStructuralChanges: false,
    climateZone: '',
  };
};

const DesignerPage: React.FC = () => {
  const { itemToLoad, onItemLoaded } = useApp();
  const { saveNewRedesign } = useHistory();
  const { addToast } = useToast();

  const [designerState, setDesignerState] = useState<DesignerState>(getInitialState);
  const { originalImage, selectedStyle, allowStructuralChanges, climateZone } = designerState;

  const [redesignedImage, setRedesignedImage] = useState<string | null>(null);
  const [designCatalog, setDesignCatalog] = useState<DesignCatalog | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Persist state to localStorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem('designerSession', JSON.stringify(designerState));
  // }, [designerState]);
  
  // Load item from history
  useEffect(() => {
    if (itemToLoad) {
      const newState: DesignerState = {
        originalImage: itemToLoad.originalImage,
        selectedStyle: itemToLoad.style,
        allowStructuralChanges: false, // This is not saved in history, default to false
        climateZone: itemToLoad.climateZone,
      };
      setDesignerState(newState);
      setRedesignedImage(itemToLoad.redesignedImage);
      setDesignCatalog(itemToLoad.designCatalog);
      setError(null);
      onItemLoaded();
    }
  }, [itemToLoad, onItemLoaded]);

  const updateState = (updates: Partial<DesignerState>) => {
    setDesignerState(prevState => ({ ...prevState, ...updates }));
  };

  const handleImageUpload = (file: ImageFile | null) => {
    updateState({ originalImage: file });
    setRedesignedImage(null);
    setDesignCatalog(null);
    setError(null);
  };

  const handleGenerateRedesign = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRedesignedImage(null);
    setDesignCatalog(null);

    try {
      const result = await redesignOutdoorSpace(
        originalImage.base64,
        originalImage.type,
        selectedStyle,
        allowStructuralChanges,
        climateZone
      );
      
      await saveNewRedesign({
        originalImage: originalImage,
        redesignedImage: { base64: result.base64ImageBytes, type: result.mimeType },
        catalog: result.catalog,
        style: selectedStyle,
        climateZone: climateZone,
      });

      setRedesignedImage(`data:${result.mimeType};base64,${result.base64ImageBytes}`);
      setDesignCatalog(result.catalog);

      // Clear session so a refresh doesn't show the old inputs
      // localStorage.removeItem('designerSession');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Redesign failed:", errorMessage);
      setError(`Failed to generate redesign. ${errorMessage}.`);
      addToast(`Redesign failed: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle, allowStructuralChanges, climateZone, saveNewRedesign, addToast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">1. Upload Your Space</h2>
        <ImageUploader onImageUpload={handleImageUpload} initialImage={originalImage} />

        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-8 mb-4">2. Select a Style</h2>
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={(style) => updateState({ selectedStyle: style })}
          allowStructuralChanges={allowStructuralChanges}
          onAllowStructuralChanges={(allow) => updateState({ allowStructuralChanges: allow })}
        />

        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-8 mb-4">3. Specify Climate <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
        <ClimateSelector value={climateZone} onChange={(val) => updateState({ climateZone: val })} />

        <button
          onClick={handleGenerateRedesign}
          disabled={!originalImage || isLoading}
          className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redesigning...
            </>
          ) : (
            'Generate Redesign'
          )}
        </button>
         {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>

      <div className="lg:col-span-8">
        <ResultDisplay
          originalImageFile={originalImage}
          redesignedImage={redesignedImage}
          designCatalog={designCatalog}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export async function getServerSideProps() {
  return { props: {} };
}

export default DesignerPage;
