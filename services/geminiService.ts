import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface TaskDetails {
  cameramanName: string;
  sourcePath: string;
  destinationPath: string;
}

export async function suggestTaskDetails(prompt: string): Promise<TaskDetails | null> {
  if (!API_KEY) {
    // Return mock data if API key is not available
    console.log("Using mock data because API_KEY is not set.");
    return {
      cameramanName: "Mock User",
      sourcePath: `/mnt/sdcard/DCIM/${prompt.replace(/\s/g, '_').toUpperCase()}`,
      destinationPath: `/mnt/nas/ingest/PROJECT_X/${new Date().toISOString().split('T')[0]}`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following media project description, generate plausible details for an ingest task. Description: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cameramanName: {
              type: Type.STRING,
              description: "A plausible name for the cameraman or operator.",
            },
            sourcePath: {
              type: Type.STRING,
              description: "A realistic-looking source path on a media card (e.g., /mnt/sdcard/...).",
            },
            destinationPath: {
              type: Type.STRING,
              description: "A realistic-looking destination path on a NAS, including a project name and date (e.g., /mnt/nas/ingest/...).",
            },
          },
          required: ["cameramanName", "sourcePath", "destinationPath"],
        },
      },
    });

    const jsonString = response.text;
    if (!jsonString) return null;

    const parsed = JSON.parse(jsonString);
    return parsed as TaskDetails;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestions from Gemini API.");
  }
}
