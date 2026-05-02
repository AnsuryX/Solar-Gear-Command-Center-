import { generateAIResponse } from './aiService';

export interface WeeklyPost {
  day: string;
  platform: 'linkedin' | 'instagram';
  strategy: string;
  content: string;
  imagePrompt: string;
  date: string;
}

export const generateWeeklyStrategy = async (brandContext: string): Promise<WeeklyPost[]> => {
  const systemPrompt = "You are a Strategic Marketing Director for SolaGear Kenya. Develop technical but visually appealing solar energy strategies.";
  
  const prompt = `
    Develop a 7-day social media strategy and content for LinkedIn and Instagram.
    
    Brand Context: ${brandContext}
    
    Rules:
    1. LinkedIn content: Professional, technical, ROI focused.
    2. Instagram content: Visual, lifestyle, sustainability aesthetics.
    3. Suggest a detailed "imagePrompt" for each post (e.g., "A wide shot of a commercial solar installation in Nairobi during a golden sunset, focusing on the crystalline panels").
    4. Generate 7 specific posts total.
    
    Return ONLY a JSON array of objects with keys: 
    "day", "platform" ("linkedin" | "instagram"), "strategy", "content", "imagePrompt", "date" (YYYY-MM-DD).
  `;

  try {
    const text = await generateAIResponse(prompt, systemPrompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Failed to parse AI strategy");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const generateAdCampaigns = async (context: string) => {
  const prompt = `Based on this solar context: ${context}, create 3 Google Ads campaign concepts. 
    Return a JSON array of objects: { name, budget, estimatedReach, status: 'Active', roi: '...', imageVibe: 'Visual concept description for the ad' }`;
    
  const text = await generateAIResponse(prompt);
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
};

export const generateVisionNarrative = async (imageAnalysis: string) => {
  const prompt = `Based on this vision analysis: ${imageAnalysis}, write three distinct social media posts: 
    1. LinkedIn (Executive Case Study)
    2. Instagram (Visual Journey)
    3. Google Business (Local Update)
    
    Return a JSON object with keys: linkedin, instagram, gmb.`;
    
  const text = await generateAIResponse(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
};
