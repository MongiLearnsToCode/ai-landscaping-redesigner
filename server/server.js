
const express = require('express');
const cors = require('cors');
const { GoogleGenAI, Modality } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const getPrompt = (style, allowStructuralChanges, climateZone) => {
  const structuralChangeInstruction = allowStructuralChanges
    ? 'You are allowed to make structural changes. This includes adding or altering hardscapes like pergolas, decks, walls, and gates. You may also change or remove vehicles or people if necessary to improve the landscape design.'
    : 'Do not make any structural changes. This means you cannot add walls or gates, and you must not alter, add, or remove existing people or vehicles. Focus ONLY on changing plants, ground cover, outdoor furniture, and minor decorative elements.';
  
  const climateInstruction = climateZone
    ? `All plants, trees, and materials MUST be suitable for the '${climateZone}' climate/region.`
    : 'Select plants and materials that are generally appropriate for the visual context of the image.';

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

const parseDesignCatalog = (text) => {
    try {
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
            return JSON.parse(jsonString);
        }
        return null;
    } catch (e) {
        console.error("Failed to parse JSON from model response:", e);
        console.error("Received text:", text);
        return null;
    }
}

app.post('/redesign', async (req, res) => {
  const { base64Image, mimeType, style, allowStructuralChanges, climateZone } = req.body;

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
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let redesignedImage = null;
    let designCatalog = null;
    
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

    res.json({
      base64ImageBytes: redesignedImage.base64ImageBytes,
      mimeType: redesignedImage.mimeType,
      catalog: designCatalog || { plants: [], features: [] },
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        res.status(500).send(`Gemini API error: ${error.message}`);
    } else {
        res.status(500).send('An unknown error occurred while communicating with the Gemini API.');
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
