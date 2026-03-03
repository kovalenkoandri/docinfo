import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  SafeAreaView,
} from "react-native";
import { PubMedAPI } from "../api/pubmed";
import { ArticleCard } from "../components/ArticleCard";

export default function HomeScreen() {
  const [query, setQuery] = useState("heart"); // Начальный запрос
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const result = await PubMedAPI.searchArticles(query);
    setIds(result);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Поиск в PubMed (на англ.)..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      <FlatList
        data={ids}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <ArticleCard pmid={item} />}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f5" },
  searchBox: { padding: 15, backgroundColor: "#fff" },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});
