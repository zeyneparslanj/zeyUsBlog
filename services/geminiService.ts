import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  isAvailable: !!ai,

  generateSummary: async (content: string): Promise<string> => {
    if (!ai) throw new Error("API Key eksik.");

    try {
      const model = 'gemini-2.5-flash';
      const prompt = `Aşağıdaki blog yazısı içeriği için SEO uyumlu, dikkat çekici ve 2-3 cümleden oluşan kısa bir özet (excerpt) yaz. Türkçe yanıt ver:\n\n${content.substring(0, 3000)}`;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text || '';
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  },

  fixGrammar: async (content: string): Promise<string> => {
    if (!ai) throw new Error("API Key eksik.");

    try {
      const model = 'gemini-2.5-flash';
      const prompt = `Aşağıdaki metni bir teknoloji bloğu için profesyonel bir dille düzelt. Yazım hatalarını gider ve akıcılığı artır, ancak teknik terimleri ve Markdown formatını koru:\n\n${content}`;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text || content;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
};