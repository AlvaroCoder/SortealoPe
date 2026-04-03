import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { GetCollectionsByEvent } from "../../../../Connections/collections";
import { CreateReservation } from "../../../../Connections/tickets";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { createTicketClaimURL } from "../../../../lib/deepLinks";
import { useFetch } from "../../../../lib/useFetch";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

// ─── Steps ─────────────────────────────────────────────────────────────────────
const STEP_SELECT = 1;
const STEP_CONFIRM = 2;
const STEP_QR = 3;

// ─── Ticket statuses ───────────────────────────────────────────────────────────
// Backend: 1=disponible  2=reservado  3=comprado  4=confirmado (oculto)
const STATUS_DISPONIBLE = 1;

const STATUS_STYLE = {
  [STATUS_DISPONIBLE]: {
    cell: { backgroundColor: GREEN_50, borderColor: GREEN_500 },
    text: { color: GREEN_900 },
    icon: "ticket-outline",
    iconColor: GREEN_900,
  },
};

// ─── TicketCell ────────────────────────────────────────────────────────────────
function TicketCell({ ticket, selected, onToggle }) {
  const style = STATUS_STYLE[STATUS_DISPONIBLE];

  return (
    <TouchableOpacity
      style={[
        styles.ticketCell,
        style.cell,
        selected && styles.ticketCellSelected,
      ]}
      onPress={() => onToggle(ticket)}
      activeOpacity={0.7}
    >
      {selected ? (
        <Ionicons name="checkmark-circle" size={14} color={GREEN_900} />
      ) : (
        <Ionicons name={style.icon} size={14} color={style.iconColor} />
      )}
      <Text style={[styles.ticketCellText, style.text]}>
        {ticket.serialNumber}
      </Text>
    </TouchableOpacity>
  );
}

// ─── StepIndicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Tickets", "Confirmar", "QR"];
  return (
    <View style={styles.stepRow}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = current === num;
        const done = current > num;
        return (
          <View key={num} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                done && styles.stepDotDone,
                active && styles.stepDotActive,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={11} color={WHITE} />
              ) : (
                <Text style={[styles.stepDotText, active && { color: WHITE }]}>
                  {num}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
              {label}
            </Text>
            {i < steps.length - 1 && (
              <View style={[styles.stepLine, done && styles.stepLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── QRCard ────────────────────────────────────────────────────────────────────
function QRCard({ reservationCode, tickets }) {
  // createTicketClaimURL generates sortealope:// in prod and exp:// in Expo Go
  const deepLink = createTicketClaimURL(reservationCode);

  return (
    <View style={styles.qrCard}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={deepLink}
          size={220}
          color={GREEN_900}
          backgroundColor={WHITE}
          quietZone={16}
        />
      </View>

      <Text style={styles.qrCount}>
        {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} incluido
        {tickets.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function SellTicketScreen() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();

  const { userData, loading: authLoading } = useAuthContext();
  const userId = userData?.userId;

  // ── State ───────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(STEP_SELECT);
  const [collectionId, setCollectionId] = useState(null);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [collectionError, setCollectionError] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [generatedQR, setGeneratedQR] = useState(null); // { reservationCode, tickets }
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // ── Load seller's collection ────────────────────────────────────────────────
  useEffect(() => {
    if (!eventId || authLoading || !userId) return;
    let cancelled = false;

    (async () => {
      setLoadingCollection(true);
      setCollectionError(null);
      try {
        const res = await GetCollectionsByEvent(eventId);
        if (!res.ok) throw new Error("No se pudieron cargar las colecciones.");
        const body = await res.json();
        const collections = Array.isArray(body) ? body : (body?.content ?? []);

        const mine =
          collections.find(
            (c) =>
              c.seller?.id === userId ||
              c.seller?.userId === userId ||
              c.user?.id === userId ||
              c.userId === userId,
          ) ?? (collections.length === 1 ? collections[0] : null);

        if (!cancelled) {
          if (mine) setCollectionId(mine.id);
          else
            setCollectionError(
              "No tienes una colección asignada para este evento.",
            );
        }
      } catch (err) {
        if (!cancelled) setCollectionError(err.message);
      } finally {
        if (!cancelled) setLoadingCollection(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId, userId, authLoading]);

  // ── Fetch available tickets (status=1) ──────────────────────────────────────
  const ticketsUrl =
    collectionId && eventId
      ? `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=1&page=0&size=200`
      : null;
  const { data: ticketsData, loading: ticketsLoading } = useFetch(ticketsUrl);

  // Response is Page<TicketDto> — extract content
  const tickets = Array.isArray(ticketsData)
    ? ticketsData
    : (ticketsData?.content ?? []);

  // ── Toggle selection ────────────────────────────────────────────────────────
  const toggleTicket = useCallback((ticket) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(ticket.code)) next.delete(ticket.code);
      else next.add(ticket.code);
      return next;
    });
  }, []);

  // ── Go to confirmation ──────────────────────────────────────────────────────
  const handleGoConfirm = () => {
    setSelectedTickets(tickets.filter((t) => selectedCodes.has(t.code)));
    setBookingError(null);
    setStep(STEP_CONFIRM);
  };

  // ── Create reservation + book tickets ───────────────────────────────────────
  const handleConfirmSale = useCallback(async () => {
    setSubmitting(true);
    setBookingError(null);
    try {
      const ticketCodes = selectedTickets.map((t) => t.code);

      // Step 1: Create reservation
      const reservationRes = await CreateReservation(eventId, ticketCodes);
      if (!reservationRes.ok) {
        const body = await reservationRes.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo crear la reserva.");
      }
      const reservation = await reservationRes.json();
      const reservationCode = reservation.id;

      // El comprador confirma la compra escaneando el QR con la app
      setGeneratedQR({ reservationCode, tickets: selectedTickets });
      setStep(STEP_QR);
    } catch (err) {
      setBookingError(err.message);
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  }, [eventId, selectedTickets]);

  // ── Reset ───────────────────────────────────────────────────────────────────
  const resetFlow = useCallback(() => {
    setStep(STEP_SELECT);
    setSelectedCodes(new Set());
    setSelectedTickets([]);
    setGeneratedQR(null);
    setBookingError(null);
  }, []);

  // ─── Step 1: multi-select ──────────────────────────────────────────────────
  const renderStep1 = () => {
    if (authLoading || loadingCollection) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando colección…</Text>
        </View>
      );
    }
    if (collectionError) {
      return (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={52} color={RED_500} />
          <Text style={styles.errorTitle}>Sin colección asignada</Text>
          <Text style={styles.errorBody}>{collectionError}</Text>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.back()}
          >
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (ticketsLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando tickets…</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {/* Leyenda */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: GREEN_500 }]} />
            <Text style={styles.legendText}>Disponible ({tickets.length})</Text>
          </View>
        </View>

        <FlatList
          data={tickets}
          keyExtractor={(t) => String(t.id ?? t.code)}
          numColumns={4}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={[
            styles.gridContent,
            selectedCodes.size > 0 && { paddingBottom: 130 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TicketCell
              ticket={item}
              selected={selectedCodes.has(item.code)}
              onToggle={toggleTicket}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
              <Text style={styles.centeredText}>
                Sin tickets disponibles en esta colección.
              </Text>
            </View>
          }
        />

        {/* Barra inferior — aparece al seleccionar ≥1 */}
        {selectedCodes.size > 0 && (
          <View style={styles.stickyBottom}>
            <View style={styles.selectionRow}>
              <Text style={styles.selectionText}>
                {selectedCodes.size} ticket{selectedCodes.size !== 1 ? "s" : ""}{" "}
                seleccionado{selectedCodes.size !== 1 ? "s" : ""}
              </Text>
              <TouchableOpacity onPress={() => setSelectedCodes(new Set())}>
                <Text style={styles.clearText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleGoConfirm}
            >
              <Text style={styles.btnPrimaryText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={18} color={WHITE} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // ─── Step 2: confirmación ──────────────────────────────────────────────────
  const renderStep2 = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionLabel}>Tickets seleccionados</Text>
      <View style={styles.ticketListCard}>
        {selectedTickets.map((t, i) => (
          <View
            key={t.code}
            style={[
              styles.ticketListRow,
              i === selectedTickets.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.ticketListBadge}>
              <Text style={styles.ticketListBadgeText}>{t.serialNumber}</Text>
            </View>
            <Text style={styles.ticketListCode} numberOfLines={1}>
              Ticket # {t.id}
            </Text>
          </View>
        ))}
      </View>

      {/* Nota informativa */}
      <View style={styles.noteBox}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={Colors.principal.yellow[700]}
        />
        <Text style={styles.noteText}>
          Al confirmar, los tickets quedarán reservados. El comprador debe
          escanear el QR con la app Sortealo para finalizar la compra.
        </Text>
      </View>

      {bookingError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={RED_500} />
          <Text style={styles.errorBoxText}>{bookingError}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.btnPrimary, submitting && { opacity: 0.7 }]}
        onPress={handleConfirmSale}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={WHITE} />
        ) : (
          <Ionicons name="qr-code-outline" size={20} color={WHITE} />
        )}
        <Text style={styles.btnPrimaryText}>
          {submitting
            ? "Procesando…"
            : `Confirmar y generar QR (${selectedTickets.length})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => setStep(STEP_SELECT)}
        disabled={submitting}
      >
        <Text style={styles.btnSecondaryText}>Volver a selección</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── Step 3: QR ─────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={40} color={WHITE} />
        </View>
        <Text style={styles.successTitle}>QR listo</Text>
        <Text style={styles.successSubtitle}>
          El comprador escanea el QR con la app Sortealo para reclamar sus
          tickets.
        </Text>
      </View>

      {generatedQR && (
        <QRCard
          reservationCode={generatedQR.reservationCode}
          tickets={generatedQR.tickets}
        />
      )}

      <TouchableOpacity style={styles.btnOutline} onPress={resetFlow}>
        <Text style={styles.btnOutlineText}>Vender más tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => router.back()}
      >
        <Text style={styles.btnSecondaryText}>Volver al evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const TITLES = {
    [STEP_SELECT]: "Selecciona los tickets",
    [STEP_CONFIRM]: "Confirmar venta",
    [STEP_QR]: "QR generado",
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StepIndicator current={step} />
      <View style={styles.stepTitleBar}>
        <Text style={styles.stepTitle}>{TITLES[step]}</Text>
      </View>
      {step === STEP_SELECT && renderStep1()}
      {step === STEP_CONFIRM && renderStep2()}
      {step === STEP_QR && renderStep3()}
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },

  // Step indicator
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: GREEN_900 },
  stepDotDone: { backgroundColor: GREEN_500 },
  stepDotText: { fontSize: 11, fontWeight: "700", color: NEUTRAL_500 },
  stepLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginLeft: 5,
    fontWeight: Typography.weights.medium,
  },
  stepLabelActive: { color: GREEN_900, fontWeight: Typography.weights.bold },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: NEUTRAL_200,
    marginHorizontal: 6,
  },
  stepLineDone: { backgroundColor: GREEN_500 },

  // Step title
  stepTitleBar: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  stepTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // Legend
  legend: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexWrap: "wrap",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: Typography.sizes.xs, color: NEUTRAL_500 },

  // Ticket grid
  gridContent: { paddingHorizontal: 14, paddingBottom: 24 },
  gridRow: { justifyContent: "flex-start", marginBottom: 7 },
  ticketCell: {
    width: "23%",
    margin: "1%",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    minHeight: 54,
    gap: 3,
  },
  ticketCellSelected: {
    borderColor: GREEN_900,
    borderWidth: 2.5,
    backgroundColor: GREEN_100,
  },
  ticketCellText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },

  // Sticky selection bar
  stickyBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  clearText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // Confirm step
  scrollContent: { padding: 20, paddingBottom: 48 },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  ticketListCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
    marginBottom: 16,
  },
  ticketListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 12,
  },
  ticketListBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: GREEN_100,
  },
  ticketListBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  ticketListCode: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontFamily: "monospace",
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.principal.yellow[50],
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.principal.yellow[200],
  },
  noteText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.principal.yellow[700],
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.principal.red[50] ?? "#FFF5F5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.principal.red[200] ?? "#FED7D7",
  },
  errorBoxText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: RED_500,
    lineHeight: 20,
  },

  // QR step
  successHeader: { alignItems: "center", marginBottom: 24 },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: GREEN_500,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  successTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  qrWrapper: {
    padding: 14,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
    marginBottom: 16,
  },
  qrCount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
    marginBottom: 10,
  },
  ticketPillList: {
    width: "100%",
    gap: 6,
    marginBottom: 16,
  },
  ticketPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEUTRAL_100,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  ticketPillSerial: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    minWidth: 48,
  },
  ticketPillCode: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontFamily: "monospace",
  },

  // Buttons
  btnPrimary: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  btnOutlineText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  btnSecondary: { paddingVertical: 14, alignItems: "center", marginTop: 8 },
  btnSecondaryText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // States
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    minHeight: 200,
  },
  centeredText: {
    marginTop: 10,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
  },
  errorTitle: {
    marginTop: 12,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textAlign: "center",
  },
  errorBody: {
    marginTop: 6,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
  },
});
