import { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { Colors, Typography } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];

/**
 * @param {{
 *   tabs: Array<{
 *     label: string,
 *     items: any[],
 *     loading: boolean,
 *     hasMore: boolean,
 *     total: number,
 *     loadMore: () => void,
 *   }>,
 *   onRefresh: () => void,
 *   refreshing: boolean,
 * }} props
 */
export default function ScreenHistoryTickets({
  tabs = [],
  onRefresh,
  refreshing = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

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
      {/* ── Tab bar ─────────────────────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        {tabs.map((tab, index) => {
          const isActive = index === currentIndex;
          return (
            <TouchableOpacity
              key={tab.label}
              style={styles.tabButton}
              onPress={() => goToTab(index)}
              activeOpacity={0.7}
            >
              <View style={styles.tabLabelRow}>
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
                {tab.total > 0 && (
                  <View
                    style={[
                      styles.countBadge,
                      isActive && styles.countBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countBadgeText,
                        isActive && styles.countBadgeTextActive,
                      ]}
                    >
                      {tab.total > 99 ? "99+" : tab.total}
                    </Text>
                  </View>
                )}
              </View>
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
        {tabs.map((tab, pageIndex) => (
          <View key={tab.label} style={styles.page}>
            <FlatList
              data={tab.items}
              keyExtractor={(item, i) =>
                item?.id != null ? String(item.id) : String(i)
              }
              renderItem={({ item }) => (
                <EventListItem
                  event={item}
                  compact={pageIndex === 0}
                  eventStatus={pageIndex + 1}
                />
              )}
              contentContainerStyle={styles.listContent}
              // Pull-to-refresh solo en el tab visible
              refreshControl={
                pageIndex === currentIndex ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[GREEN_900]}
                    tintColor={GREEN_900}
                  />
                ) : undefined
              }
              // Infinite scroll
              onEndReached={tab.loadMore}
              onEndReachedThreshold={0.3}
              // Spinner de "cargando más" al fondo
              ListFooterComponent={
                tab.loading && tab.items.length > 0 ? (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={GREEN_900} />
                    <Text style={styles.footerLoaderText}>
                      Cargando más eventos…
                    </Text>
                  </View>
                ) : tab.hasMore ? (
                  // Espacio vacío cuando hay más pero no está cargando aún
                  <View style={styles.footerSpacer} />
                ) : tab.items.length > 0 ? (
                  <Text style={styles.footerEnd}>
                    · {tab.total}{" "}
                    {tab.total === 1 ? "evento" : "eventos"} en total ·
                  </Text>
                ) : null
              }
              ListEmptyComponent={
                !tab.loading ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📋</Text>
                    <Text style={styles.emptyText}>
                      No hay eventos en este estado
                    </Text>
                  </View>
                ) : null
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

  // ── Tab bar ──────────────────────────────────────────────────
  tabsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  tabLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.semibold,
  },
  activeTabText: {
    color: GREEN_900,
    fontWeight: Typography.weights.bold,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  countBadgeActive: {
    backgroundColor: GREEN_50,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_400,
  },
  countBadgeTextActive: {
    color: GREEN_900,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: 3,
    borderRadius: 2,
    backgroundColor: GREEN_900,
  },

  // ── Pager ───────────────────────────────────────────────────
  pager: {
    flex: 1,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },

  // ── Footer ───────────────────────────────────────────────────
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  footerLoaderText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_400,
  },
  footerSpacer: {
    height: 8,
  },
  footerEnd: {
    textAlign: "center",
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_400,
    paddingVertical: 16,
  },

  // ── Empty state ──────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_400,
    textAlign: "center",
  },
});