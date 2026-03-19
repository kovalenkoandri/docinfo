import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

// export const checkModelsViaFetch = async () => {
//   const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // подставьте ключ из файла
//   const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log("Доступные модели через Fetch:", data);
//   } catch (error) {
//     console.error("Ошибка запроса:", error);
//   }
// };
// checkModelsViaFetch();
export const GeminiAI = {
  // Функция для упрощения медицинского текста
  async simplifyMedicalText(text) {
    try {
      const prompt = `Ты профессиональный медицинский ассистент. 
      Упрости следующую аннотацию статьи для пациента, выделив главное в 3 пунктах: ${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Не удалось проанализировать текст.";
    }
  },
};
