import OpenAI from 'openai';

// Inisialisasi OpenAI client dengan OpenRouter endpoint
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY as string,
  defaultHeaders: {
    'HTTP-Referer': 'https://trash2cash.io', // Site URL untuk ranking di openrouter.ai
    'X-Title': 'Trash2Cash', // Site title untuk ranking di openrouter.ai
  },
  dangerouslyAllowBrowser:true
});

// Interface untuk hasil deteksi sampah
export interface DetectedTrashItem {
  name: string;
  confidence: number;
  category: "plastic" | "paper" | "metal" | "glass" | "organic" | "other";
  tokenValue: number;
}

/**
 * Menganalisis gambar sampah menggunakan OpenRouter AI
 * @param imageBase64 - Base64 string dari gambar yang akan dianalisis
 * @returns Promise<DetectedTrashItem[]> - Array item sampah yang terdeteksi
 */
export async function analyzeTrashImage(imageBase64: string): Promise<DetectedTrashItem[]> {
  try {
    // Hapus prefix data:image/jpeg;base64, jika ada
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    // Buat prompt untuk AI
    const prompt = `
    You are an AI specialized in identifying recyclable waste items from images. 
    Analyze the image and identify all recyclable items visible.
    
    For each item, provide:
    1. The name of the item
    2. A confidence score (0.0-1.0)
    3. The category (must be one of: plastic, paper, metal, glass, organic, other)
    4. A token value (1-10) based on recyclability value
    
    Format your response as a valid JSON array with objects containing these fields:
    [
      {
        "name": "item name",
        "confidence": 0.95,
        "category": "plastic",
        "tokenValue": 5
      },
      ...
    ]
    
    Only include items you can identify with reasonable confidence (>0.6).
    Respond ONLY with the JSON array, no other text.
    `;

    // Panggil OpenRouter API
    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-scout:free', // Model yang powerful untuk analisis gambar
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ],
        },
      ],
      temperature: 0.2, // Rendah untuk hasil yang lebih deterministik
    });

    // Parse hasil JSON dari respons AI
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON dari respons
    const detectedItems = JSON.parse(content) as DetectedTrashItem[];
    return detectedItems;
  } catch (error) {
    console.error('Error analyzing image with OpenRouter:', error);
    throw error;
  }
}
