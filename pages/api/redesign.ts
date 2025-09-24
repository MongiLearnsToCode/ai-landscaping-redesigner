import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { v2 as cloudinary } from 'cloudinary';
import type { DesignCatalog } from '../../types';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getPrompt = (style: string, allowStructuralChanges: boolean, climateZone: string) => {
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

const parseDesignCatalog = (text: string): DesignCatalog | null => {
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
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { original_image_url, style, allowStructuralChanges, climateZone } = req.body;

  if (!original_image_url || !style) {
    return res.status(400).json({ error: 'Missing required fields: original_image_url, style' });
  }

  const prompt = getPrompt(style, allowStructuralChanges, climateZone);
  console.log('Generated prompt for OpenRouter:', prompt);

  try {
    const imageResponse = await fetch(original_image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from URL: ${original_image_url}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    console.log('Sending request to OpenRouter...');
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "X-Title": "AI Landscaping Redesigner",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL_ID,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `data:${mimeType};base64,${imageBase64}`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      const errorBody = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorBody);
      return res.status(openRouterResponse.status).json({ error: `OpenRouter API request failed: ${errorBody}` });
    }

    const result = await openRouterResponse.json();
    console.log('Received response from OpenRouter:', result);

    const messageContent = result.choices[0]?.message?.content;

    if (!messageContent) {
      throw new Error('Invalid response from OpenRouter model.');
    }

    const redesigned_image_url_from_model = result.choices[0]?.message?.content.match(/https:\/\/[^\s]+\.png/g)[0];
    const design_catalog = parseDesignCatalog(messageContent);
    console.log('Parsed design catalog:', design_catalog);

    console.log('Uploading redesigned image to Cloudinary...');
    const uploadedImage = await cloudinary.uploader.upload(redesigned_image_url_from_model, {
      folder: `redesigns/${session.user.id}`,
      transformation: { width: 1200, height: 900, crop: 'limit' }
    });
    console.log('Image uploaded to Cloudinary:', uploadedImage.secure_url);

    console.log('Inserting new design record into Supabase...');
    const { data: newRecord, error: dbError } = await supabase
      .from('designs')
      .insert({
        user_id: session.user.id,
        original_image_url,
        redesigned_image_url: uploadedImage.secure_url,
        style,
        climate_zone: climateZone,
        design_catalog,
        is_pinned: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      throw dbError;
    }

    console.log('Successfully inserted new record:', newRecord);
    res.status(200).json(newRecord);
  } catch (error) {
    console.error('Redesign handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    res.status(500).json({ error: errorMessage });
  }
}