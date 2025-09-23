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

// Represents the metadata stored in the database
export interface HistoryItem {
    id: string;
    user_id: string;
    design_catalog: DesignCatalog;
    style: LandscapingStyle;
    climate_zone: string;
    created_at: string;
    is_pinned: boolean;
    original_image_url: string;
    redesigned_image_url: string;
}

// Represents a fully loaded history item for display
export interface HydratedHistoryItem extends HistoryItem {
    originalImage: string;
    redesignedImage: string;
}


export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};