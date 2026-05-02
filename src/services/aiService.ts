import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Load config from localStorage if available
const getAIConfig = () => {
    if (typeof window === 'undefined') return { provider: 'gemini', modelId: 'gemini-1.5-flash', apiKey: '' };
    
    return {
        provider: localStorage.getItem('ai_provider') || 'gemini',
        modelId: localStorage.getItem('ai_model_id') || 'gemini-1.5-flash',
        apiKey: localStorage.getItem('openrouter_key') || ''
    };
};

export const generateAIResponse = async (prompt: string, systemInstruction?: string) => {
    const config = getAIConfig();

    if (config.provider === 'openrouter') {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: config.modelId,
            messages: [
                { role: 'system', content: systemInstruction || 'You are a strategic marketing assistant.' },
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'SolaGear Nexus'
            }
        });
        return response.data.choices[0].message.content;
    } else {
        const response = await genAI.models.generateContent({
            model: config.modelId,
            contents: [
                { role: 'user', parts: [{ text: (systemInstruction ? systemInstruction + "\n\n" : "") + prompt }] }
            ]
        });
        return response.text || '';
    }
};
