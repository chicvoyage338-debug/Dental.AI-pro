import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DentalAnalysis {
  findings: string;
  diagnosis: string;
  severity: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

export async function analyzeDentalImage(base64Image: string): Promise<DentalAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "You are a professional dental AI assistant. Analyze this dental image (X-ray or photo) and provide findings, diagnosis, severity, and recommendations." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          findings: { type: Type.STRING, description: "Detailed clinical findings from the image" },
          diagnosis: { type: Type.STRING, description: "Professional diagnosis based on findings" },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of recommended next steps or treatments"
          }
        },
        required: ["findings", "diagnosis", "severity", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as DentalAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("AI analysis failed to produce valid data.");
  }
}
