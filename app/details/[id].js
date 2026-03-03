import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PubMedAPI } from "../../api/pubmed";

export default function Details() {
  const { id } = useLocalSearchParams(); // Получаем ID из ссылки
  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PubMedAPI.getFullDetails(id)
      .then(setAbstract)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.idLabel}>PMID: {id}</Text>
      <Text style={styles.title}>Аннотация</Text>
      <View style={styles.card}>
        <Text style={styles.abstractText}>{abstract}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  idLabel: { color: "#888", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  abstractText: { fontSize: 16, lineHeight: 24, color: "#333" },
});
