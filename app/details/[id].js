import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { PubMedAPI } from "../../api/pubmed";
import { GeminiAI } from "../../api/gemini";

export default function ArticleDetails() {
  const { id } = useLocalSearchParams(); // Получаем PMID из URL
  const [abstract, setAbstract] = useState("");
  // const [ruData, setRuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    const summary = await GeminiAI.simplifyMedicalText(abstract);
    setAiSummary(summary);
    setAiLoading(false);
  };
  const openFullArticle = () => {
    // Самый надежный способ — отправить на веб-версию PubMed,
    // где уже есть кнопка "Full Text Link" от издателя
    Linking.openURL(`https://pubmed.ncbi.nlm.nih.gov/${id}/`);
  };
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const text = await PubMedAPI.getFullDetails(id);
        setAbstract(text);
      } catch (error) {
        setAbstract("Не удалось загрузить текст статьи.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // useEffect(() => {
  //   const loadAndTranslate = async () => {
  //     setLoading(true);
  //     try {
  //       // 1. Получаем данные из PubMed (англ)
  //       const article = await PubMedAPI.getSummary(id);

  //       // 2. Сразу отправляем в Gemini на перевод
  //       const translated = await GeminiAI.translateArticle(
  //         article.title,
  //         article.abstract,
  //       );

  //       if (translated) {
  //         setRuData(translated); // Сохраняем русский вариант
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadAndTranslate();
  // }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Загрузка аннотации...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ title: `Статья ${id}`, headerBackTitle: "Назад" }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>PMID: {id}</Text>
        <Text style={styles.title}>Abstract</Text>
        <View style={styles.card}>
          <Text style={styles.abstractText}>
            {abstract || "Аннотация отсутствует в базе данных."}
            // В return под текстом аннотации:
            <TouchableOpacity
              onPress={handleAIAnalysis}
              style={styles.aiButton}
            >
              <Text style={{ color: "#fff" }}>
                🤖 {aiLoading ? "Анализирую..." : "Упростить текст (Gemini)"}
              </Text>
            </TouchableOpacity>
            {aiSummary ? (
              <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>AI Резюме:</Text>
                <Text>{aiSummary}</Text>
              </View>
            ) : null}{" "}
          </Text>
        </View>
        <TouchableOpacity onPress={openFullArticle} style={styles.linkButton}>
          <Text style={styles.linkText}>
            🔗 Открыть полный текст в браузере
          </Text>
        </TouchableOpacity>
        {/* <View style={styles.card}>
          <Text style={styles.abstractText}>
            {ruData || "Не удалось перевести на русский язык."}
          </Text>
        </View> */}
        <Text style={styles.footer}>
          Данные предоставлены National Library of Medicine
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20 },
  label: { color: "#8e8e93", fontSize: 14, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  abstractText: {
    fontSize: 17,
    lineHeight: 26,
    color: "#1c1c1e",
    textAlign: "left",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    color: "#c7c7cc",
    fontSize: 12,
    marginBottom: 40,
  },
});
