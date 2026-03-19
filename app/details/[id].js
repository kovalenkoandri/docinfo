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
import { useLocalSearchParams } from "expo-router";
import { PubMedAPI } from "../../api/pubmed";
import { GeminiAI } from "../../api/gemini";

export default function ArticleDetails() {
  const { id } = useLocalSearchParams(); // Получаем PMID из URL
  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    const summary = await GeminiAI.simplifyMedicalText(abstract);
    setAiSummary(summary);
    setAiLoading(false);
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
