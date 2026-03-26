import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
// const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
// const model = genAI.getGenerativeModel({ model: "models/gemmma-3-4b-it" });

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
const requestCache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const GeminiAI = {
  // Вспомогательная функция для выполнения запросов с логикой стабильности
  async safeGenerate(prompt, retries = 3, delay = 2000) {
    // 1. Кэширование: проверяем, был ли такой запрос
    if (requestCache.has(prompt)) {
      console.log("Взято из кэша");
      return requestCache.get(prompt);
    }

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Сохраняем в кэш
      requestCache.set(prompt, text);
      return text;
    } catch (error) {
      // 2. Exponential Backoff: если ошибка 429 (Too Many Requests)
      if (error.message?.includes("429") && retries > 0) {
        console.warn(
          `Лимит исчерпан. Повтор через ${delay}ms... Осталось попыток: ${retries}`,
        );
        await sleep(delay);
        return this.safeGenerate(prompt, retries - 1, delay * 2); // Удваиваем задержку
      }
      throw error;
    }
  },
  // Функция для упрощения медицинского текста
  async simplifyMedicalText(text) {
    try {
      const prompt = `Ты профессиональный медицинский ассистент. 
      Упрости следующую аннотацию статьи для пациента, выделив главное в 3 пунктах: ${text}`;

      // const result = await model.generateContent(prompt);
      // const response = await result.response;
      // return response.text();
      return await this.safeGenerate(prompt);
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Не удалось проанализировать текст.";
    }
  },
  async translateArticle(title, abstract) {
    const prompt = `
      Ты — профессиональный медицинский переводчик. 
      Переведи на русский язык заголовок и аннотацию статьи. 
      Используй строгую медицинскую терминологию. 
      
      ЗАГОЛОВОК: ${title}
      АННОТАЦИЯ: ${abstract}
      
      Верни ответ в формате JSON:
      {
        "ruTitle": "переведенный заголовок",
        "ruAbstract": "переведенная аннотация"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Очищаем текст от возможных markdown-меток (типа ```json)
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Translate Error:", error);
      return null;
    }
  },
};
