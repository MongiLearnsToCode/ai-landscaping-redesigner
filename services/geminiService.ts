import { GoogleGenAI, Modality } from "@google/genai";
import type { LandscapingStyle, DesignCatalog } from '../types';

// Per coding guidelines, the API key must be sourced from `process.env.API_KEY`.
// This environment variable is assumed to be pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Per coding guidelines, use 'gemini-2.5-flash-image-preview' for image editing tasks.
const model = 'gemini-2.5-flash-image-preview';

/**
 * Creates a detailed prompt for the Gemini model.
 * @param style - The desired landscaping style.
 * @param allowStructuralChanges - Whether to allow structural changes.
 * @param climateZone - The geographic area or climate zone.
 * @returns The generated prompt string.
 */
const getPrompt = (style: LandscapingStyle, allowStructuralChanges: boolean, climateZone: string): string => {
  const structuralChangeInstruction = allowStructuralChanges
    ? 'You are allowed to make structural changes. This includes adding or altering hardscapes like pergolas, decks, walls, and gates. You may also change or remove vehicles or people if necessary to improve the landscape design.'
    : 'Do not make any structural changes. This means you cannot add walls or gates, and you must not alter, add, or remove existing people or vehicles. Focus ONLY on changing plants, ground cover, outdoor furniture, and minor decorative elements.';
  
  const climateInstruction = climateZone
    ? `All plants, trees, and materials MUST be suitable for the '${climateZone}' climate/region.`
    : 'Select plants and materials that are generally appropriate for the visual context of the image.';

  // Explicitly define the JSON structure in the prompt to guide the model's output.
  const jsonSchemaString = JSON.stringify({
    plants: [{ name: "string", species: "string" }],
    features: [{ name: "string", description: "string" }],
  }, null, 2);

  return `
**Critical Constraint: Climate Suitability**
If a climate zone is specified, you MUST ensure that every single plant in the redesign and in the JSON catalog is suitable for that zone. This is a non-negotiable rule.

**Primary Task: Image Redesign**
Your primary task is to generate a new image. Redesign the landscaping in the provided image to a '${style}' style.
- The house itself must not be changed.
- ${structuralChangeInstruction}
- ${climateInstruction}
- The output image must be a photorealistic redesign.

**Secondary Task: JSON Catalog**
After generating the image, you MUST provide a single, valid JSON object detailing the new elements you added.
- The JSON output must be a valid JSON object and nothing else. Do not add any introductory text, explanations, or markdown formatting.
- The JSON object must follow this exact schema:
${jsonSchemaString}
- For plants, list the common name and species. Ensure these plants are suitable for the specified climate zone. For features, list the name and a brief description.
- If a category is empty, provide an empty list [].
`;
};


/**
 * Extracts a JSON object from a string that may contain other text.
 * @param text - The string to search for a JSON object.
 * @returns The parsed DesignCatalog object or null if not found/invalid.
 */
const parseDesignCatalog = (text: string): DesignCatalog | null => {
    try {
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
            return JSON.parse(jsonString) as DesignCatalog;
        }
        return null;
    } catch (e) {
        console.error("Failed to parse JSON from model response:", e);
        console.error("Received text:", text);
        return null;
    }
}


/**
 * Calls the Gemini API to redesign an outdoor space image.
 * @param base64Image - The base64 encoded source image.
 * @param mimeType - The MIME type of the source image.
 * @param style - The landscaping style to apply.
 * @param allowStructuralChanges - Flag to allow structural modifications.
 * @param climateZone - The geographic area or climate zone.
 * @returns An object containing the new image and design catalog.
 */
export const redesignOutdoorSpace = async (
  base64Image: string,
  mimeType: string,
  style: LandscapingStyle,
  allowStructuralChanges: boolean,
  climateZone: string
): Promise<{ base64ImageBytes: string; mimeType: string; catalog: DesignCatalog }> => {
  const prompt = getPrompt(style, allowStructuralChanges, climateZone);

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, textPart],
      },
      // Per guidelines, responseModalities is required for image editing to get both image and text back.
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let redesignedImage: { base64ImageBytes: string; mimeType: string } | null = null;
    let designCatalog: DesignCatalog | null = null;
    
    // Per guidelines, process the response parts to find the image and text.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          redesignedImage = {
            base64ImageBytes: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        } else if (part.text) {
          designCatalog = parseDesignCatalog(part.text);
        }
      }
    }

    if (!redesignedImage) {
      throw new Error('The model did not return a redesigned image.');
    }

    return {
      base64ImageBytes: redesignedImage.base64ImageBytes,
      mimeType: redesignedImage.mimeType,
      catalog: designCatalog || { plants: [], features: [] },
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the Gemini API.');
  }
};