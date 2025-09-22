
import type { LandscapingStyle, DesignCatalog } from '../../types';

export const redesignOutdoorSpace = async (
  base64Image: string,
  mimeType: string,
  style: LandscapingStyle,
  allowStructuralChanges: boolean,
  climateZone: string
): Promise<{ base64ImageBytes: string; mimeType: string; catalog: DesignCatalog }> => {
  const response = await fetch('/api/redesign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Image,
      mimeType,
      style,
      allowStructuralChanges,
      climateZone,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to redesign outdoor space: ${errorText}`);
  }

  return response.json();
};
