import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardEvents from "../../../../components/cards/CardEvents";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { usePaginatedFetch } from "../../../../lib/usePaginatedFetch";
import EmptyEvents from "../../../../screens/EmptyEvents";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

const FILTER_TABS = [
  { label: "En espera", value: 1 },
  { label: "Creados", value: 2 },
  { label: "Sorteados", value: 3 },
];

export default function EventsTab() {
  const router = useRouter();
  const { userData } = useAuthContext();

  const [selectedStatus, setSelectedStatus] = useState(1);
  const [searchText, setSearchText] = useState("");

  const firstName = userData?.sub?.split("@")[0] ?? "Usuario";
  const avatarUri = userData?.photo ?? null;

  const baseUrl = `${ENDPOINTS_EVENTS.GET_BY_USER}?role=HOST`;

  const filteredUrl =
    selectedStatus !== null ? `${baseUrl}&eventStatus=${selectedStatus}` : null;

  const {
    items,
    loading: loadingPaged,
    loadMore,
    refresh: refreshPaged,
  } = usePaginatedFetch(filteredUrl);

  const sourceItems = items;
  const loading = loadingPaged;
  const refresh = refreshPaged;

  const filteredItems = searchText.trim()
    ? sourceItems.filter(
        (ev) =>
          ev.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          String(ev.id).includes(searchText),
      )
    : sourceItems;

  const renderHeaderBar = () => (
    <View style={styles.headerBar}>
      <View style={styles.headerLeft}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {firstName[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
        )}
        <Text style={styles.headerBrand}>RifaloPe</Text>
      </View>
      <View style={styles.adminBadge}>
        <Text style={styles.adminBadgeText}>ADMIN</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>Mis Sorteos</Text>
        <Text style={styles.pageSubtitle}>
          Gestiona y monitorea tus sorteos.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={NEUTRAL_500}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar sorteos por nombre o ID..."
          placeholderTextColor={NEUTRAL_400}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={NEUTRAL_400} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsContent}
        style={styles.filterTabsScroll}
      >
        {FILTER_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.value;
          return (
            <TouchableOpacity
              key={String(tab.value)}
              style={[
                styles.filterChip,
                isSelected
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => {
                setSelectedStatus(tab.value);
                setSearchText("");
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.listLabelRow}>
        <Text style={styles.listLabel}>
          {filteredItems.length > 0
            ? `${filteredItems.length} evento${filteredItems.length !== 1 ? "s" : ""}`
            : ""}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerWrapper}>
      <TouchableOpacity
        style={styles.createCard}
        onPress={() => router.push("/(app)/(admin)/events/create")}
        activeOpacity={0.8}
      >
        <View style={styles.createIconCircle}>
          <Ionicons name="add" size={24} color={WHITE} />
        </View>
        <Text style={styles.createTitle}>Crear Nuevo Sorteo</Text>
        <Text style={styles.createSubtitle}>
          Configura premios, fechas y tickets.
        </Text>
      </TouchableOpacity>
      <View style={{ height: 24 }} />
    </View>
  );

  return (
    <View style={styles.screen}>
      {loading && <LoadingScreen />}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: WHITE }}>
        {renderHeaderBar()}
      </SafeAreaView>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CardEvents item={item} selectedStatus={selectedStatus} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length === 0}
            onRefresh={refresh}
            colors={[GREEN_900]}
            tintColor={GREEN_900}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? <EmptyEvents /> : null}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(app)/(admin)/events/create")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={WHITE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  listContent: {
    paddingBottom: 120,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatarPlaceholder: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: "700",
    color: GREEN_900,
  },
  adminBadge: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  adminBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Title block
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: GREEN_900,
    lineHeight: 36,
  },
  pageSubtitle: {
    fontSize: 14,
    color: NEUTRAL_500,
    marginTop: 4,
  },

  // Search bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: NEUTRAL_700,
    padding: 0,
  },

  // Filter tabs
  filterTabsScroll: {
    marginTop: 16,
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
  },
  filterChipSelected: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  filterChipUnselected: {
    backgroundColor: "transparent",
    borderColor: NEUTRAL_200,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipTextSelected: {
    color: WHITE,
  },
  filterChipTextUnselected: {
    color: NEUTRAL_500,
  },

  // List label row
  listLabelRow: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  listLabel: {
    fontSize: 13,
    color: NEUTRAL_500,
    fontWeight: "500",
  },

  // Create new event footer card
  footerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  createCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: NEUTRAL_200,
    gap: 10,
  },
  createIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN_900,
  },
  createSubtitle: {
    fontSize: 14,
    color: NEUTRAL_500,
    textAlign: "center",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: NEUTRAL_700,
  },
  emptySubtitle: {
    fontSize: 14,
    color: NEUTRAL_500,
    textAlign: "center",
    paddingHorizontal: 32,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
