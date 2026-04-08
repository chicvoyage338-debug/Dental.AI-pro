import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DentalAnalysis {
  findings: string;
  diagnosis: string;
  treatmentPlan: string;
  symptoms?: string[];
  severity: 'Low' | 'Medium' | 'High';
  radiographicNotes?: {
    boneLoss: string;
    caries: string;
    periapical: string;
  };
}

export async function analyzeDentalImage(base64Image: string, mimeType: string): Promise<DentalAnalysis> {
  const prompt = `
    You are an elite Maxillofacial Radiologist and Dental AI Specialist. 
    Analyze the provided dental image (X-ray, Intraoral Photo, or OPG).
    
    Perform a systematic review:
    1. Hard Tissues: Identify interproximal/occlusal caries, recurrent decay under existing restorations.
    2. Periodontium: Evaluate alveolar bone levels (horizontal/vertical loss), widening of PDL space, calculus deposits.
    3. Periapical Region: Look for radiolucencies (abscess, cyst, granuloma).
    4. Soft Tissues: Identify any visible lesions, ulcers, or suspicious masses.
    5. Anomalies: Impacted teeth, supernumerary teeth, or missing teeth.

    Provide a structured response in JSON format:
    {
      "findings": "Detailed clinical observations including specific tooth numbers (Universal System) if possible.",
      "diagnosis": "Primary clinical diagnosis.",
      "treatmentPlan": "Evidence-based treatment recommendations (e.g., SRP, Class II Composite, RCT, Referral to Oral Surgeon).",
      "symptoms": ["List of expected symptoms"],
      "severity": "Low | Medium | High",
      "radiographicNotes": {
        "boneLoss": "Description of bone levels",
        "caries": "Location and depth of caries",
        "periapical": "Status of periapical tissues"
      }
    }
    
    Maintain a high level of clinical accuracy.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text || '{}') as DentalAnalysis;
  } catch (error) {
    console.error("Failed to parse dental analysis:", error);
    throw new Error("Analysis failed to produce structured data.");
  }
}
