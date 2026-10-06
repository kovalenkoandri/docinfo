import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

export const styles = StyleSheet.create({
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
  filterWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
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
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 15,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  synergyBadge: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.15)", // мягкий янтарный/предупреждающий фон
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  synergyBadgeText: {
    fontSize: 12,
    color: "#FBBF24",
    lineHeight: 16,
    fontWeight: "500",
  },
  // Кнопка сброса внутри поисковой строки
  searchContainer: {
    position: "relative",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  clearSearchButton: {
    position: "absolute",
    right: 28,
    top: 6,
    backgroundColor: "#334155",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  clearSearchText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Строка статуса поиска
  searchStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchStatusText: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "600",
  },
  resetSearchLink: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
});
