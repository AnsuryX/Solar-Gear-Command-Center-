import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface WeeklyPost {
  day: string;
  platform: 'linkedin' | 'instagram';
  strategy: string;
  content: string;
  date: string;
}

export const generateWeeklyStrategy = async (brandContext: string): Promise<WeeklyPost[]> => {
  const prompt = `
    You are a Strategic Marketing Director for SolaGear Kenya. 
    Develop a 7-day social media strategy and content for LinkedIn and Instagram.
    
    Brand Context: ${brandContext}
    
    Rules:
    1. LinkedIn content should be professional, technical, and data-driven (Solar installation ROI, engineering excellence).
    2. Instagram content should be visual, lifestyle-oriented, and "green energy" aesthetics (Sustainable living, Kenyan sunsets, installation progress).
    3. Generate 7 specific posts total (alternate between platforms).
    
    Return ONLY a JSON array of objects with these keys: 
    "day" (e.g., "Monday"), "platform" ("linkedin" or "instagram"), "strategy", "content" (the actual post), "date" (YYYY-MM-DD starting from next Monday).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || '';
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Failed to parse AI strategy");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateVisionNarrative = async (imageAnalysis: string) => {
  const prompt = `Based on this vision analysis: ${imageAnalysis}, write three distinct social media posts: 
    1. LinkedIn (Executive Case Study)
    2. Instagram (Visual Journey)
    3. Google Business (Local Update)
    
    Return a JSON object with keys: linkedin, instagram, gmb.`;
    
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  const text = response.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
};
