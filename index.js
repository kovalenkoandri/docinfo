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

// --- КАТЕГОРИИ ---
const CATEGORIES = ["Витамины", "Пробиотики", "Грибы"];

// --- ИСХОДНЫЕ ДАННЫЕ (Витамины + Пробиотики + Грибы) ---
const SUPPLEMENTS_DATA = [
  // ================= ВИТАМИНЫ =================
  {
    id: "vitamin_b1",
    nameRu: "Витамин B1",
    latinName: "Thiamine",
    category: "Витамины",
    action: "углеводный обмен, энергия и работа нервной системы",
    activeCompounds: "Тиамина гидрохлорид, Бенфотиамин",
  },
  {
    id: "vitamin_b2",
    nameRu: "Витамин B2",
    latinName: "Riboflavin",
    category: "Витамины",
    action: "клеточное дыхание, здоровье кожи и зрения",
    activeCompounds: "Рибофлавин, Рибофлавин-5-фосфат (R-5-P)",
  },
  {
    id: "vitamin_b3",
    nameRu: "Витамин B3",
    latinName: "Niacin / Nicotinamide",
    category: "Витамины",
    action: "синтез АТФ, липидный обмен и здоровье сосудов",
    activeCompounds: "Никотиновая кислота, Никотинамид, NMN, NR",
  },
  {
    id: "vitamin_b6",
    nameRu: "Витамин B6",
    latinName: "Pyridoxine",
    category: "Витамины",
    action: "синтез нейромедиаторов и белковый обмен",
    activeCompounds: "Пиридоксина гидрохлорид, Пиридоксаль-5-фосфат (P-5-P)",
  },

  // ================= ПРОБИОТИКИ =================
  {
    id: "b_bifidum",
    nameRu: "Бифидобактерия бифидум",
    latinName: "Bifidobacterium bifidum",
    category: "Пробиотики",
    action: "защитный барьер слизистой",
    activeCompounds: "КЦЖК, Молочная кислота",
  },
  {
    id: "b_longum",
    nameRu: "Бифидобактерия лонгум",
    latinName: "Bifidobacterium longum",
    category: "Пробиотики",
    action: "снижение воспаления, поддержка Оси «кишечник-мозг»",
    activeCompounds: "КЦЖК, Витамины группы B",
  },
  {
    id: "b_adolescentis",
    nameRu: "Бифидобактерия адолесцентис",
    latinName: "Bifidobacterium adolescentis",
    category: "Пробиотики",
    action: "стимуляция нейромедиаторов и регуляция настроения",
    activeCompounds: "ГАМК (GABA), Фолаты, Бутират",
  },
  {
    id: "b_breve",
    nameRu: "Бифидобактерия бреве",
    latinName: "Bifidobacterium breve",
    category: "Пробиотики",
    action: "защита от кишечных инфекций и поддержка метаболизма",
    activeCompounds: "Уксусная кислота, Органические кислоты",
  },
  {
    id: "b_animalis_lactis",
    nameRu: "Бифидобактерия анималис лактис",
    latinName: "Bifidobacterium animalis ssp. lactis",
    category: "Пробиотики",
    action: "улучшение перистальтики и пищеварения",
    activeCompounds: "Органические кислоты, КЦЖК",
  },
  {
    id: "b_longum_longum",
    nameRu: "Бифидобактерия лонгум лонгум",
    latinName: "Bifidobacterium longum ssp. longum",
    category: "Пробиотики",
    action: "антиоксидантная защита и усвоение клетчатки",
    activeCompounds: "Антиоксиданты, Метаболиты растительных волокон",
  },
  {
    id: "b_longum_infantis",
    nameRu: "Бифидобактерия лонгум инфантис",
    latinName: "Bifidobacterium longum ssp. infantis",
    category: "Пробиотики",
    action: "укрепление стенки кишечника и переваривание олигосахаридов",
    activeCompounds: "Утилизаторы HMO, Короткоцепочечные жирные кислоты",
  },
  {
    id: "l_acidophilus",
    nameRu: "Лактобактерия ацидофильная",
    latinName: "Lactobacillus acidophilus",
    category: "Пробиотики",
    action: "расщепление лактозы и подавление патогенов",
    activeCompounds: "Молочная кислота, Ацидофилин",
  },
  {
    id: "l_plantarum",
    nameRu: "Лактобактерия плантарум",
    latinName: "Lactobacillus plantarum",
    category: "Пробиотики",
    action: "укрепление барьера кишечника и антимикробное действие",
    activeCompounds: "Плантарицины, КЦЖК",
  },
  {
    id: "l_rhamnosus",
    nameRu: "Лактобактерия рамнозус",
    latinName: "Lactobacillus rhamnosus",
    category: "Пробиотики",
    action: "стимуляция местного иммунитета IgA",
    activeCompounds: "Молочная кислота, Бактериоцины",
  },
  {
    id: "l_bulgaricus",
    nameRu: "Болгарская палочка",
    latinName: "Lactobacillus delbrueckii ssp. bulgaricus",
    category: "Пробиотики",
    action: "ферментация молочных продуктов и подавление гнилостной флоры",
    activeCompounds: "Молочная кислота, Ацетальдегид",
  },
  {
    id: "l_casei",
    nameRu: "Лактобактерия казеи",
    latinName: "Lactobacillus casei",
    category: "Пробиотики",
    action: "нормализация моторики и поддержка микрофлоры",
    activeCompounds: "Биоактивные пептиды, Молочная кислота",
  },
  {
    id: "l_paracasei",
    nameRu: "Лактобактерия параказеи",
    latinName: "Lactobacillus paracasei",
    category: "Пробиотики",
    action: "модуляция иммунного ответа и противоаллергенный эффект",
    activeCompounds: "Липотейхоевые кислоты, Бактериоцины",
  },
  {
    id: "l_reuteri",
    nameRu: "Лактобактерия ройтери",
    latinName: "Lactobacillus reuteri",
    category: "Пробиотики",
    action: "подавление роста широкого спектра вредных бактерий",
    activeCompounds: "Ройтерин, Кобаламин",
  },
  {
    id: "l_salivarius",
    nameRu: "Лактобактерия саливариус",
    latinName: "Lactobacillus salivarius",
    category: "Пробиотики",
    action: "оздоровление ротовой полости и ЖКТ",
    activeCompounds: "Саливарицины, Молочная кислота",
  },
  {
    id: "l_helveticus",
    nameRu: "Лактобактерия гельветикус",
    latinName: "Lactobacillus helveticus",
    category: "Пробиотики",
    action: "снижение давления и регуляция стресс-ответа",
    activeCompounds: "Биоактивные трипептиды (IPP, VPP)",
  },
  {
    id: "l_gasseri",
    nameRu: "Лактобактерия гассери",
    latinName: "Lactobacillus gasseri",
    category: "Пробиотики",
    action: "регуляция жирового обмена и контроля веса",
    activeCompounds: "Гассерицин, Молочная кислота",
  },

  // ================= ГРИБЫ =================
  {
    id: "chaga",
    nameRu: "Чага",
    latinName: "Inonotus obliquus",
    category: "Грибы",
    action: "мощная антиоксидантная защита и иммуномодуляция",
    activeCompounds: "Хромогенный комплекс, Полифенолы, Бета-глюканы",
  },
  {
    id: "fomitopsis",
    nameRu: "Трутовик",
    latinName: "Fomitopsis pinicola",
    category: "Грибы",
    action: "противовоспалительное действие и очищение",
    activeCompounds: "Полисахариды, Трутовиковые кислоты",
  },
  {
    id: "agaricus",
    nameRu: "Агарик",
    latinName: "Agaricus blazei",
    category: "Грибы",
    action: "активация врожденного иммунитета",
    activeCompounds: "Beta-1,3/1,6-D-глюканы, Эргостерол",
  },
  {
    id: "cordyceps",
    nameRu: "Кордицепс",
    latinName: "Cordyceps militaris",
    category: "Грибы",
    action: "повышение выносливости и синтеза АТФ",
    activeCompounds: "Кордицепин, Аденозин",
  },
  {
    id: "reishi",
    nameRu: "Рейши",
    latinName: "Ganoderma lucidum",
    category: "Грибы",
    action: "адаптогенное действие, улучшение сна и снятие стресса",
    activeCompounds: "Ганодеровые кислоты, Тритерпены",
  },
  {
    id: "hericium",
    nameRu: "Ежовик гребенчатый",
    latinName: "Hericium erinaceus",
    category: "Грибы",
    action: "стимуляция нейрогенеза и концентрации внимания",
    activeCompounds: "Эринацины, Гериценоны, NGF",
  },
  {
    id: "shiitake",
    nameRu: "Шиитаке",
    latinName: "Lentinula edodes",
    category: "Грибы",
    action: "поддержка сердечно-сосудистой системы и иммунитета",
    activeCompounds: "Лентинан, Эритаденин",
  },
  {
    id: "maitake",
    nameRu: "Майтаке",
    latinName: "Grifola frondosa",
    category: "Грибы",
    action: "регуляция уровня сахара и иммунная поддержка",
    activeCompounds: "D-фракция полисахаридов, Грифолан",
  },
];

export default function SupplementGridScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Витамины");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return SUPPLEMENTS_DATA.filter((item) => {
      // 1. Фильтр по выбранной категории
      const matchesCategory = item.category === selectedCategory;

      // 2. Поиск по названию, латыни, действию и веществам
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        item.nameRu.toLowerCase().includes(query) ||
        item.latinName.toLowerCase().includes(query) ||
        (item.action && item.action.toLowerCase().includes(query)) ||
        item.activeCompounds.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const renderCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{item.nameRu}</Text>
        <Text style={styles.cardSubtitle}>{item.latinName}</Text>

        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>Действие:</Text>
          <Text style={styles.infoText} numberOfLines={2}>
            {item.action}
          </Text>
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>Вещества:</Text>
          <Text style={styles.infoText} numberOfLines={2}>
            {item.activeCompounds}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Справочник биокомпонентов</Text>

      {/* Поисковая строка */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по названию, действию или веществам..."
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
    paddingHorizontal: 16,
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
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cardSubtitle: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#64748B",
    marginBottom: 8,
  },
  infoWrapper: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "600",
    marginBottom: 1,
  },
  infoText: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 14,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
});

registerRootComponent(SupplementGridScreen);
