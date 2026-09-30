import { registerRootComponent } from "expo";
import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- ИСХОДНЫЕ ДАННЫЕ ---
const MUSHROOMS_DATA = [
  {
    id: "chaga",
    nameRu: "Чага",
    latinName: "Inonotus obliquus",
    categories: ["Иммунитет"],
    activeCompounds: "Хромогенный комплекс, полифенолы, ORAC, бета-глюканы",
  },
  {
    id: "fomitopsis",
    nameRu: "Трутовик",
    latinName: "Fomitopsis pinicola",
    categories: ["Иммунитет"],
    activeCompounds: "Полисахариды, трутовиковые кислоты, стероиды",
  },
  {
    id: "agaricus",
    nameRu: "Агарик",
    latinName: "Agaricus blazei",
    categories: ["Иммунитет"],
    activeCompounds: "Beta-1,3/1,6-D-глюканы, эргостерол",
  },
  {
    id: "cordyceps",
    nameRu: "Кордицепс",
    latinName: "Cordyceps militaris",
    categories: ["Энергия"],
    activeCompounds: "Кордицепин, аденозин, кордицеповая кислота",
  },
  {
    id: "reishi",
    nameRu: "Рейши",
    latinName: "Ganoderma lucidum",
    categories: ["Сон/Антистресс", "Иммунитет"],
    activeCompounds: "Ганодеровые кислоты, тритерпены, полисахариды",
  },
  {
    id: "hericium",
    nameRu: "Ежовик гребенчатый",
    latinName: "Hericium erinaceus",
    categories: ["Ноотропы"],
    activeCompounds: "Эринацины, гериценоны, фактор роста нервов (NGF)",
  },
  {
    id: "shiitake",
    nameRu: "Шиитаке",
    latinName: "Lentinula edodes",
    categories: ["Иммунитет"],
    activeCompounds: "Лентинан, эритаденин, B-глюканы",
  },
  {
    id: "maitake",
    nameRu: "Майтаке",
    latinName: "Grifola frondosa",
    categories: ["Иммунитет", "Энергия"],
    activeCompounds: "D-фракция полисахаридов, грифолан",
  },
];

const CATEGORIES = [
  "Все",
  "Ноотропы",
  "Иммунитет",
  "Энергия",
  "Сон/Антистресс",
];

export default function MushroomGridScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");

  // Комбинированная фильтрация по категории и поисковой строке
  const filteredMushrooms = useMemo(() => {
    return MUSHROOMS_DATA.filter((item) => {
      // 1. Фильтр по категории
      const matchesCategory =
        selectedCategory === "Все" ||
        item.categories.includes(selectedCategory);

      // 2. Фильтр по названию, латыни и биоактивным веществам
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        item.nameRu.toLowerCase().includes(query) ||
        item.latinName.toLowerCase().includes(query) ||
        item.activeCompounds.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Рендер текстовой карточки гриба
  const renderMushroomCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Text style={styles.cardTitle}>{item.nameRu}</Text>
      <Text style={styles.cardSubtitle}>{item.latinName}</Text>

      <View style={styles.compoundsWrapper}>
        <Text style={styles.compoundsLabel}>Вещества:</Text>
        <Text style={styles.cardCompounds} numberOfLines={3}>
          {item.activeCompounds}
        </Text>
      </View>

      <View style={styles.badgeContainer}>
        {item.categories.map((cat) => (
          <View key={cat} style={styles.badge}>
            <Text style={styles.badgeText}>{cat}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Справочник грибов</Text>

      {/* Поисковая строка */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по названию или веществам (NGF, тритерпены...)"
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Фильтр категорий */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Сетка компонентов FlatList */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredMushrooms}
          renderItem={renderMushroomCard}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// --- СТИЛИ ---
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterWrapper: {
    height: 44,
    marginBottom: 6,
  },
  filterContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterChipActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  filterChipText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContainer: {
    flex: 1,
  },
  listPadding: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    margin: 6,
    padding: 12,
    justify: "space-between",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cardSubtitle: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#64748B",
    marginBottom: 8,
  },
  compoundsWrapper: {
    marginBottom: 10,
  },
  compoundsLabel: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardCompounds: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 15,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: "auto",
  },
  badge: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    color: "#38BDF8",
    fontWeight: "600",
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
});
registerRootComponent(MushroomGridScreen);