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
import VendorRankingRow from "../../../components/cards/VendorRankingRow";
import Title from "../../../components/common/Titles/Title";
import Title2 from "../../../components/common/Titles/Title2";
import { Colors, Typography } from "../../../constants/theme";
import { useRaffleContext } from "../../../context/RaffleContext";
import { useDateFormatter } from "../../../lib/dateFormatter";
import DataCardEvent from "../../../mock/DataCardEvent.json";
import FloatinActionButtons from "../../../views/SectionsButtons/FloatinActionButtons";
import FloatingSellingButton from "../../../views/SectionsButtons/FloatingSellingButton";

const GREEN_900 = Colors.principal.green[900];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_100 = Colors.principal.neutral[100];

const mockAssignedSellers = [
  {
    id: 1,
    name: "Ana P.",
    avatarUrl: "https://placehold.co/50x50/16CD91/FFFFFF?text=AP",
  },
  {
    id: 2,
    name: "Benito R.",
    avatarUrl: "https://placehold.co/50x50/34D399/FFFFFF?text=BR",
  },
  {
    id: 3,
    name: "Calixto V.",
    avatarUrl: "https://placehold.co/50x50/059669/FFFFFF?text=CV",
  },
];

const mockVendorRanking = [
  { id: 1, name: "Ana Torres", sales: 15500, ticketsSold: 442 },
  { id: 2, name: "Carlos Ruiz", sales: 12800, ticketsSold: 365 },
  { id: 3, name: "María López", sales: 9950, ticketsSold: 284 },
];

const MetricChip = ({ label, value, icon, color = Colors.principal.green[900] }) => (
  <View style={styles.metricChip}>
    <View
      style={[
        styles.metricIconCircle,
        { backgroundColor: Colors.principal.green[50] }
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>

    <View style={styles.metricTextContainer}>
      <Text
        style={styles.metricLabel}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  </View>
);

export default function EventDetailPage() {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventId = params.id;

  const data = DataCardEvent;
  const event = data?.filter((item) => parseInt(eventId) === item.id)[0];
  const { isSeller, isAdmin } = useRaffleContext();
  
  const handlePress = () => {
    router.push({
      pathname: 'tickets/sell/[id]',
      params: { id: eventId }
    });   
  };

  const handlePressMoreSellers = () => {
    router.push({
      pathname: 'event/vendedores/[id]',
      params : { id : eventId}
    })
  }

  if (!event) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: RED_500 }}>
          Evento ID: {eventId} no encontrado.
        </Text>
      </View>
    );
  }
  const assignedSellers = event.assignedSellers || mockAssignedSellers;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isAdmin &&  <FloatinActionButtons />}
      {isSeller && <FloatingSellingButton handlePress={handlePress} />}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.urlImagen }}
            style={styles.eventImage}
            onError={() => console.log("Error loading image")}
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.headerContent}>
            <Title styleTitle={{maxWidth : 300}}>{event.title}</Title>
            {isAdmin && (
              <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() => router.push("event/edit")}
            >
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>)}
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.principal.blue[500]} />
            <Text style={styles.infoText}>
              Sorteo: {formatDateToSpanish(event?.createdAt)}
            </Text>
          </View>

            {isSeller && (
            <View style={styles.sellerMetricsSection}>
              <Title2>Métricas del evento</Title2>
              <View style={styles.metricsGrid}>
                <MetricChip 
                  label="Tickets Vendidos" 
                  value="10" 
                  icon="wallet-outline" 
                />
                <MetricChip 
                  label="Tickets Reservados" 
                  value={`${event.totalTickets - event.availableTickets}`} 
                  icon="ticket-outline" 
                />
                <MetricChip 
                  label="Total Tickets" 
                  value={event.totalTickets} 
                  icon="gift-outline" 
                  color={Colors.principal.blue[500]}
                />
              </View>
            </View>
          )}
          <View style={styles.divider} />

          <Title2>Detalles del Evento</Title2>
          <Text style={styles.descriptionText}>{event.description}</Text>

              <View style={styles.divider} />

              <Title2>Progreso de Tickets</Title2>
              <ProgressBar
                available={event.availableTickets}
                total={event.totalTickets}
              />

          <View style={styles.divider} />

          <View style={styles.purchaseSummary}>
            <View>
              <Title2>Precio por Ticket:</Title2>
              <Text style={styles.priceValue}>
                S/ {event.ticketPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {!isSeller && (
            <>
              <View style={styles.divider} />

              <Title2>Ranking de Vendedores ({assignedSellers.length})</Title2>

              <View>
                {mockVendorRanking?.map((vendor, index) => (
                  <VendorRankingRow
                    key={vendor.id}
                    id={vendor.id}
                    rank={index + 1}
                    name={vendor.name}
                    sales={vendor.sales}
                    ticketsSold={vendor.ticketsSold}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handlePressMoreSellers}
              ><Text style={styles.moreSellers}>Ver más vendedores</Text></TouchableOpacity>
            </>
          )}
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
  scrollContent: {
    paddingBottom: 100,
  },
  buttonEdit: {
    padding: 10,
    borderRadius: 10,
    height : 50,
    backgroundColor: Colors.principal.yellow[300],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: Colors.principal.green[800],
  },
  headerContent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap : 5
  },
  imageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
    backgroundColor: NEUTRAL_100,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  eventTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: Typography.sizes.md,
    color: NEUTRAL_700,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    lineHeight: 22,
  },
  purchaseSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  priceLabel: {
    fontSize: Typography.sizes.md,
    color: NEUTRAL_700,
  },
  priceValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: Colors.principal.blue[500],
    marginTop: 4,
  },
  debugText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    textAlign: "center",
    paddingVertical: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  metricValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: '#14532d',
  },
    metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
      metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
      
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop : 10
  },

  moreSellers: {
    textDecorationLine: 'underline',
    fontSize: Typography.sizes.sm,
    color: Colors.principal.blue[600],
    marginTop: 15,
    
  }
});
