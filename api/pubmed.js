const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export const PubMedAPI = {
  // Поиск ID статей
  async searchArticles(term) {
    const response = await fetch(
      `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmode=json&retmax=10`,
    );
    const data = await response.json();
    return data.esearchresult.idlist || [];
  },

  // Краткая инфо для карточки
  async getSummary(id) {
    try {
      const response = await fetch(
        `${BASE_URL}/esummary.fcgi?db=pubmed&id=${id}&retmode=json`,
      );
      const data = await response.json();
      // Проверяем, есть ли такой ключ в ответе
      if (data.result && data.result[id]) {
        return data.result[id];
      }
      return null;
    } catch (error) {
      console.error("Ошибка API:", error);
      return null;
    }
  },
  // Полный текст (Abstract) для экрана деталей
  async getFullDetails(id) {
    const response = await fetch(
      `${BASE_URL}/efetch.fcgi?db=pubmed&id=${id}&retmode=xml`,
    );
    const text = await response.text();
    const abstractMatch = text.match(
      /<AbstractText[^>]*>(.*?)<\/AbstractText>/,
    );
    return abstractMatch ? abstractMatch[1] : "Аннотация отсутствует.";
  },
};
