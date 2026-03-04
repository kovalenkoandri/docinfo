import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import { PubMedAPI } from "../api/pubmed";
import { Link } from "expo-router";

export const ArticleCard = ({ pmid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PubMedAPI.getSummary(pmid)
      .then(setData)
      .finally(() => setLoading(false));
  }, [pmid]);

  if (loading)
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  if (!data) return null;

  return (
    <Link href={`/details/${pmid}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.date}>
          {data.pubdate} • {data.source}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {data.title}
        </Text>
        <Text style={styles.author}>
          {data.authors?.[0]?.name || "PubMed"} et al.
        </Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  date: { fontSize: 12, color: "#8e8e93", marginBottom: 5 },
  title: { fontSize: 16, fontWeight: "bold", color: "#1c1c1e" },
  author: { fontSize: 13, color: "#555", marginTop: 8 },
});
