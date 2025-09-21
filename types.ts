import type { DesignCatalog as DesignCatalogType } from './types';
// FIX: Removed conflicting self-import of 'ImageFile'.
export interface ImageFile {
  name: string;
  type: string;
  base64: string;
}

export type LandscapingStyle = 'modern' | 'minimalist' | 'rustic' | 'mediterranean' | 'japanese' | 'tropical';

export interface StyleOption {
    id: LandscapingStyle;
    name: string;
}

export interface Plant {
    name: string;
    species: string;
}

export interface Feature {
    name: string;
    description: string;
}

export interface DesignCatalog {
    plants: Plant[];
    features: Feature[];
}

// Represents the metadata stored in localStorage (without large image data)
export interface HistoryItem {
    id: string;
    designCatalog: DesignCatalog;
    style: LandscapingStyle;
    climateZone: string;
    timestamp: number;
    isPinned: boolean;
    originalImageInfo: { id: string; name: string; type: string };
    redesignedImageInfo: { id: string; type: string };
}

// Represents a fully loaded history item, with image data fetched from IndexedDB
export interface HydratedHistoryItem extends HistoryItem {
    originalImage: ImageFile;
    redesignedImage: string; // This will be the full data URL for the component
}


export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};