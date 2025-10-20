// FIX: Removed extraneous file markers.
import { GoogleGenAI, Type } from '@google/genai';
import { Item } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const findSimilarProductsFromImage = async (base64Image: string, mimeType: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: "Based on the image, describe the main item. Provide a response in JSON format including a 'itemName' (string), 'category' (string, e.g., 'electronics', 'apparel', 'furniture'), and a brief 'description' (string).",
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        itemName: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze image with Gemini.");
    }
};