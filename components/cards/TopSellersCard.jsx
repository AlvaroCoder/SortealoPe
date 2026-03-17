import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";
import VendorRankingRow from "./VendorRankingRow";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

function rankCollections(collections = [], limit = 3) {
  return [...collections]
    .sort((a, b) => (b.soldTickets ?? 0) - (a.soldTickets ?? 0))
    .slice(0, limit);
}

export default function TopSellersCard({
  collections = [],
  eventId,
  ticketPrice = 0,
  titleEvent = "",
}) {
  const router = useRouter();
  const top3 = rankCollections(collections);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="podium-outline" size={16} color={GREEN_900} />
          <Text style={styles.title}>Top Vendedores</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(app)/vendedores/event/[id]",
              params: { id: eventId, titleEvent: titleEvent },
            })
          }
        >
          <Text style={styles.verTodos}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      {top3.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aún no hay ventas registradas.</Text>
        </View>
      ) : (
        top3.map((col, index) => (
          <VendorRankingRow
            key={col.id}
            rank={index + 1}
            name={col?.seller?.username}
            ticketsSold={col?.seller?.soldTickets ?? 0}
            sales={(col?.seller?.soldTickets ?? 0) * ticketPrice}
            id={col?.seller?.id}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  verTodos: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_500,
  },
  empty: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
  },
});
