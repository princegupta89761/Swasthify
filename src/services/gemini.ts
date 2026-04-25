import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface HealthData {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  bloodPressure?: string;
  glucoseLevel?: number;
  symptoms?: string;
  activityLevel?: string;
  sleepHours?: number;
}

export async function analyzeHealthRisk(data: HealthData, language: string = "en") {
  const prompt = `
    You are a professional medical AI assistant specializing in preventive healthcare.
    Analyze the following patient data and provide:
    1. Potential health risks (early predictions).
    2. Personalized lifestyle suggestions (diet, exercise, sleep).
    3. Recommended next steps (e.g., "Consult a cardiologist", "Monitor blood sugar for 7 days").
    4. A "Health Score" from 1-100.

    Patient Data:
    - Age: ${data.age || 'Not provided'}
    - Gender: ${data.gender || 'Not provided'}
    - Weight: ${data.weight || 'Not provided'} kg
    - Height: ${data.height || 'Not provided'} cm
    - Blood Pressure: ${data.bloodPressure || 'Not provided'}
    - Glucose Level: ${data.glucoseLevel || 'Not provided'} mg/dL
    - Symptoms: ${data.symptoms || 'None'}
    - Activity Level: ${data.activityLevel || 'Not provided'}
    - Sleep: ${data.sleepHours || 'Not provided'} hours/day

    IMPORTANT: Provide the entire response in the following language: ${language}.
    Include a disclaimer that this is an AI prediction and not a formal medical diagnosis.
    Format the response in clear Markdown with sections.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing health risk:", error);
    throw new Error("Failed to analyze health data. Please try again later.");
  }
}
