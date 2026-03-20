import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EventListItem from "../components/common/Card/EventListItem";
import { Colors } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = [
  { id: 1, name: "Espera" },
  { id: 2, name: "Creada" },
  { id: 3, name: "Sorteados" },
];

export default function ScreenHistoryTickets({
  dataEspera = [],
  dataCreada = [],
  dataGanada = [],
  onRefresh,
  refreshing = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const allData = [dataEspera, dataCreada, dataGanada];

  const goToTab = (index) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* ── Tabs ─────────────────────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        {TABS.map((tab, index) => {
          const isActive = index === currentIndex;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTab]}
              onPress={() => goToTab(index)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.name}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Paged horizontal content ─────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {allData.map((data, pageIndex) => (
          <View key={pageIndex} style={styles.page}>
            <FlatList
              data={data}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <EventListItem
                  event={item}
                  compact={pageIndex === 0}
                  eventStatus={TABS[pageIndex].id}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay eventos en este estado</Text>
              }
              refreshControl={
                onRefresh && pageIndex === currentIndex ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[Colors.principal.green[900]]}
                    tintColor={Colors.principal.green[900]}
                  />
                ) : undefined
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ── Tabs ────────────────────────────────────────────────────
  tabsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 0,
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#0f3d2e",
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#0f3d2e",
  },

  // ── Pager ───────────────────────────────────────────────────
  pager: {
    flex: 1,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});
