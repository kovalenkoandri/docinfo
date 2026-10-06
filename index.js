import { registerRootComponent } from "expo";
import React, { useState, useMemo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SUPPLEMENTS_DATA } from "./supplementsData";
import { styles } from "./appStyles";
import { HighlightedText } from "./components/HighlightedText";

const CATEGORIES = [
  "Антистарение",
  "Витамины",
  "Минералы",
  "Пробиотики",
  "Грибы",
];

export default function SupplementGridScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Антистарение");
  const [searchQuery, setSearchQuery] = useState("");

  const isSearching = searchQuery.trim().length > 0;

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return SUPPLEMENTS_DATA.filter((item) => {
      const matchesSearch =
        item.nameRu.toLowerCase().includes(query) ||
        item.latinName.toLowerCase().includes(query) ||
        (item.action && item.action.toLowerCase().includes(query)) ||
        (item.activeCompounds &&
          item.activeCompounds.toLowerCase().includes(query));

      if (query !== "") {
        return matchesSearch;
      }

      return item.category === selectedCategory;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectCategory = (category) => {
    if (isSearching) {
      setSearchQuery(""); // Сбрасываем поиск при нажатии на категорию
    }
    setSelectedCategory(category);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View>
        {/* Заголовок */}
        <HighlightedText
          text={item.nameRu}
          highlight={searchQuery}
          style={styles.cardTitle}
          highlightStyle={styles.highlightText}
        />

        {/* Латинское название */}
        <HighlightedText
          text={item.latinName}
          highlight={searchQuery}
          style={styles.cardSubtitle}
          highlightStyle={styles.highlightText}
        />

        {/* Действие */}
        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>Действие:</Text>
          <HighlightedText
            text={item.action}
            highlight={searchQuery}
            style={styles.infoText}
            highlightStyle={styles.highlightText}
          />
        </View>

        {/* Вещества */}
        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>Вещества:</Text>
          <HighlightedText
            text={item.activeCompounds}
            highlight={searchQuery}
            style={styles.infoText}
            highlightStyle={styles.highlightText}
          />
        </View>
      </View>

      {item.synergy && (
        <View style={styles.synergyBadge}>
          <Text style={styles.synergyBadgeText}>⚠️ {item.synergy}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Справочник биокомпонентов</Text>

      {/* Поисковая строка с кнопкой сброса */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по названию, действию или веществам..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {isSearching && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Индикатор глобального поиска или Фильтр категорий */}
      {isSearching ? (
        <View style={styles.searchStatusContainer}>
          <Text style={styles.searchStatusText}>
            🔍 Поиск по всей базе (найдено: {filteredItems.length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.resetSearchLink}>Сбросить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.filterWrapper}>
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => handleSelectCategory(category)}
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
        </View>
      )}

      {/* Сетка компонентов FlatList */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredItems}
          renderItem={renderCard}
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

registerRootComponent(SupplementGridScreen);
