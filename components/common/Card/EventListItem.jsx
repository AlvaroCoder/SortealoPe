import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";
import { useDateFormatter } from "../../../lib/dateFormatter";

const GREEN_900 = Colors.principal.green[900];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_900 = "#111111";
const WHITE = "#FFFFFF";
const GREEN_100 = Colors.principal.green[100];

const EventListItem = ({ event, compact = false, eventStatus = 1 }) => {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[itemStyles.card, compact && itemStyles.cardCompact]}
      onPress={() =>
        router.push({
          pathname: "/event/[id]",
          params: { id: event.id, eventStatus: eventStatus },
        })
      }
    >
      <Image
        source={{ uri: event?.image }}
        style={[itemStyles.image, compact && itemStyles.imageCompact]}
        resizeMode="cover"
      />

      <View style={[itemStyles.content, compact && itemStyles.contentCompact]}>
        <View style={itemStyles.infoContainer}>
          <Text
            style={[itemStyles.title, compact && itemStyles.titleCompact]}
            numberOfLines={1}
          >
            {event.title}
          </Text>

          {!compact && (
            <Text style={itemStyles.price}>
              S/ {event.ticketPrice.toFixed(2)} c/u
            </Text>
          )}

          <View style={itemStyles.detailsRow}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={NEUTRAL_700}
              style={{ marginRight: 4 }}
            />
            <Text style={itemStyles.detailText}>
              {formatDateToSpanish(event.date) || "Fecha por definir"}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward-outline" size={20} color={GREEN_900} />
      </View>
    </TouchableOpacity>
  );
};

export default EventListItem;

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardCompact: {
    marginBottom: 10,
    borderRadius: 12,
  },

  image: {
    width: "100%",
    height: 150,
    backgroundColor: GREEN_100,
  },
  imageCompact: {
    height: 80,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  contentCompact: {
    padding: 10,
  },

  infoContainer: {
    flex: 1,
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_900,
    marginBottom: 2,
  },
  titleCompact: {
    fontSize: Typography.sizes.base,
    marginBottom: 2,
  },
  price: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: RED_500,
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.principal.green[50],
    marginRight: 10,
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
