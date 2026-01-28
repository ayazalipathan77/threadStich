import { GoogleGenAI } from "@google/genai";
import { TechPack, Fabric, RuleResult } from "../types";

const getClient = () => {
    // In a real app, strict error handling for missing key
    const key = process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey: key });
};

export const getAIExplanation = async (
    rule: RuleResult,
    techPack: TechPack,
    fabric: Fabric
): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "AI Explanation unavailable: Missing API Key.";
        }

        const ai = getClient();
        const modelId = "gemini-3-flash-preview"; 

        const prompt = `
        You are an expert apparel production manager in a garment factory.
        
        Context:
        - Garment: ${techPack.garmentType} (${techPack.gender})
        - Fabric: ${fabric.name} (${fabric.gsm} GSM, ${fabric.composition})
        - Construction: ${techPack.construction.stitchType}, SPI ${techPack.construction.spi}
        
        A rule failed validation:
        - Rule Message: "${rule.message}"
        - Severity: ${rule.severity}
        
        Task:
        Explain WHY this is a problem in simple factory language and suggest a specific fix. 
        Keep it under 30 words. Be direct.
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "Could not generate explanation.";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Unable to connect to AI service for explanation.";
    }
};

export const parseTechPackAI = async (fileBase64: string): Promise<Partial<TechPack> | null> => {
    // This is a placeholder for actual PDF/Image parsing logic using Gemini 2.0 Flash
    // We simulate the latency here, but in production, we'd send the image.
    
    // For this demo, we just simulate a delay as we are using "Auto-detected" mock data 
    // to ensure the application flow works perfectly for the user.
    await new Promise(resolve => setTimeout(resolve, 2000));
    return null; 
};
