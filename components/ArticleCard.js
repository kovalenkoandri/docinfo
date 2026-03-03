import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { PubMedAPI } from "../api/pubmed";
import { useRouter } from "expo-router";

export const ArticleCard = ({ pmid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    PubMedAPI.getSummary(pmid)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [pmid]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  }

  // Если данных нет, не даем приложению упасть
if (!data) {
  return (
    <View style={styles.card}>
      <Text>Ошибка загрузки данных статьи</Text>
    </View>
  );
}

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/details/${pmid}`)}
    >
      <Text style={styles.date}>
        {data.pubdate || "Дата неизвестна"} • {data.source || ""}
      </Text>
      <Text style={styles.title} numberOfLines={2}>
        {data.title || "Без названия"}
      </Text>
      {/* Безопасная проверка авторов */}
      <Text style={styles.author}>
        {data.authors && data.authors.length > 0
          ? `${data.authors[0].name} et al.`
          : "Автор не указан"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  date: { fontSize: 11, color: "#888", marginBottom: 5 },
  title: { fontSize: 16, fontWeight: "bold", color: "#222" },
  author: { fontSize: 13, color: "#555", marginTop: 5 },
});
