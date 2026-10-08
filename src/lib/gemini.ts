import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client
// Note: In a real production app, you'd want to call a backend endpoint
// to avoid exposing your API key in the frontend.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export interface GeneratedProduct {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  category: string;
  suggestedTags: string[];
}

export const generateProductContent = async (prompt: string): Promise<GeneratedProduct | null> => {
  if (!aiClient) {
    console.error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
    return null;
  }

  try {
    const systemInstruction = `You are an expert copywriter for a baby clothing store named "Pequeñitos". 
You generate product details in Spanish based on the user's prompt. 
Return ONLY a valid JSON object without markdown formatting, with the following keys:
- name: (string) A catchy product name
- shortDescription: (string) Max 100 characters
- description: (string) A detailed, persuasive description of the product and its benefits
- price: (number) A reasonable price in Colombian Pesos (COP) like 45900
- category: (string) One of: mamelucos, conjuntos, accesorios, regalos
- suggestedTags: (string[]) 3-5 descriptive tags`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text();
    if (!text) return null;
    
    return JSON.parse(text) as GeneratedProduct;
  } catch (error) {
    console.error('Error generating product with Gemini:', error);
    return null;
  }
};
