import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../../../components/cards/ProgressBar";
import Title from "../../../components/common/Titles/Title";
import Title2 from "../../../components/common/Titles/Title2";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useRaffleContext } from "../../../context/RaffleContext";
import { useDateFormatter } from "../../../lib/dateFormatter";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";
import FloatinActionButtons from "../../../views/SectionsButtons/FloatinActionButtons";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_100 = Colors.principal.neutral[100];

const InfoBadge = ({ icon, label, value, color = GREEN_900, area = 1 }) => (
  <View
    style={[
      styles.infoBadge,
      area === 1 && { width: "48%" },
      area === 2 && { width: "100%" },
    ]}
  >
    <View style={[styles.iconContainer, { backgroundColor: NEUTRAL_100 }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </View>
);

const MetricChip = ({ label, value, icon, color = GREEN_900 }) => (
  <View style={styles.metricChip}>
    <View style={[styles.metricIconCircle, { backgroundColor: GREEN_50 }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.metricTextContainer}>
      <Text style={styles.metricLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  </View>
);

const URL_EVENT_ID = ENDPOINTS_EVENTS.GET_EVENT_BY_ID_EVENT;

export default function EventDetailPage() {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventId = params.id;
  const { data, loading } = useFetch(`${URL_EVENT_ID}${eventId}`);
  const event = data;
  const { isAdmin } = useRaffleContext();

  const avalaibleTickets =
    data?.collections
      ?.map((collection) => collection.availableTickets)
      .reduce((a, b) => a + b, 0) || 0;

  const totalTickets =
    data?.collections
      ?.map((collection) => collection.ticketsQuantity)
      .reduce((a, b) => a + b, 0) || 0;

  const reservedTickets =
    data?.collections
      ?.map((collection) => collection.reservedTickets)
      .reduce((a, b) => a + b, 0) || 0;

  const soldTickets =
    data?.collections
      ?.map((collection) => collection.soldTickets)
      .reduce((a, b) => a + b, 0) || 0;

  if (!event && !loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={RED_500} />
        <Text style={{ color: RED_500, marginTop: 10 }}>
          Evento ID: {eventId} no encontrado.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {loading && <LoadingScreen />}
      {isAdmin && <FloatinActionButtons />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event?.image }}
            style={styles.eventImage}
            onError={() => console.log("Error loading image")}
          />
          <View style={styles.overlayGradient} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.headerContent}>
            <Title styleTitle={{ flex: 1, marginRight: 10 }}>
              {event?.title}
            </Title>
            {isAdmin && (
              <TouchableOpacity
                style={styles.buttonEdit}
                onPress={() =>
                  router.push({
                    pathname: "event/edit",
                    params: { id: eventId },
                  })
                }
              >
                <Ionicons name="create-outline" size={22} color={GREEN_900} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.badgeGrid}>
            <InfoBadge
              icon="cash-outline"
              label="Precio Ticket"
              value={`S/ ${event?.ticketPrice.toFixed(2)}`}
              color={GREEN_500}
            />
            <InfoBadge
              icon="albums-outline"
              label="Paquete"
              value={`${event?.pack?.name || "No definido"}`}
              color={GREEN_500}
            />
            <InfoBadge
              icon="location-outline"
              label="Ubicación"
              value={event?.place || "No definido"}
              color={RED_500}
              area={2}
            />

            <InfoBadge
              icon="calendar-outline"
              label="Fecha Sorteo"
              value={formatDateToSpanish(event?.date)}
              color={BLUE_500}
              area={2}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionHeader}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={GREEN_900}
            />
            <Title2 styleTitle={styles.sectionTitleText}>
              Detalles del Evento
            </Title2>
          </View>
          <Text style={styles.descriptionText}>{event?.description}</Text>

          <View style={styles.divider} />

          <View style={styles.sectionHeader}>
            <Ionicons name="analytics-outline" size={20} color={GREEN_900} />
            <Title2 styleTitle={styles.sectionTitleText}>
              Progreso de Tickets
            </Title2>
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar available={avalaibleTickets} total={totalTickets} />
          </View>

          <View style={styles.divider} />

          <View style={styles.sellerMetricsSection}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="speedometer-outline"
                size={20}
                color={GREEN_900}
              />
              <Title2 styleTitle={styles.sectionTitleText}>
                Métricas del evento
              </Title2>
            </View>
            <View style={styles.metricsGrid}>
              <MetricChip
                label="Vendidos"
                value={soldTickets}
                icon="wallet-outline"
                color={GREEN_500}
              />
              <MetricChip
                label="Reservados"
                value={reservedTickets}
                icon="time-outline"
                color={BLUE_500}
              />
              <MetricChip
                label="Total Cupos"
                value={totalTickets}
                icon="apps-outline"
                color={NEUTRAL_700}
              />
              <MetricChip
                label="Recaudado"
                value={`S/ ${(soldTickets * (event?.ticketPrice || 0)).toFixed(0)}`}
                icon="trending-up-outline"
                color={GREEN_500}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 280,
    backgroundColor: NEUTRAL_100,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonEdit: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.principal.yellow[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.principal.yellow[300],
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoBadge: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  badgeLabel: {
    fontSize: 10,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  badgeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN_900,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionTitleText: {
    marginBottom: 0,
    fontSize: 18,
    color: GREEN_900,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: NEUTRAL_700,
    lineHeight: 22,
    textAlign: "justify",
  },
  progressContainer: {
    marginTop: 5,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: NEUTRAL_700,
  },
  priceValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: BLUE_500,
    marginTop: 4,
  },
  sellerMetricsSection: {
    backgroundColor: Colors.principal.neutral[50],
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
    marginBottom: 30,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  metricChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  metricTextContainer: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: NEUTRAL_500,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: GREEN_900,
    marginTop: 2,
  },
});
