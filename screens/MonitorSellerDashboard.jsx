import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import ButtonFloatinQRScan from "../components/common/Buttons/ButtonFloatinQRScan";
import EventListItem from "../components/common/Card/EventListItem";
import Title from "../components/common/Titles/Title";
import { Colors, Typography } from "../constants/theme";
import { useRaffleContext } from "../context/RaffleContext";
import DataCardEvent from "../mock/DataCardEvent.json";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

export default function MonitorSellerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockEventData = DataCardEvent;

  const filteredEvents = useMemo(() => {
    if (!searchTerm) {
      return mockEventData;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return mockEventData.filter((event) =>
      event.title.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchTerm, mockEventData]);

  const { userRole, updateRole } = useRaffleContext();
  const router = useRouter();
  return (
    <View style={styles.monitorContainer}>
      <ButtonFloatinQRScan onPress={() => router.push("vendedores/scan")} />

      <View style={styles.headerContent}>
        <Title styleTitle={{ marginBottom: 15 }}>Eventos Recientes (2)</Title>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={NEUTRAL_700} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar evento por título..."
            placeholderTextColor={NEUTRAL_700}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => <EventListItem event={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color={NEUTRAL_700}
            />
            <Text style={styles.emptyText}>
              No se encontraron eventos con ese título.
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  roleSwitchBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  contentPadding: {
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 20,
    marginHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: GREEN_900,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: GREEN_900,
    marginLeft: 10,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: Colors.principal.green[100],
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    color: NEUTRAL_700,
    marginTop: 10,
  },
});
