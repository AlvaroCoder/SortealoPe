import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_EVENTS } from "../../../../../Connections/APIURLS";
import { CreateReservation, GetTickets } from "../../../../../Connections/tickets";
import { Colors, Typography } from "../../../../../constants/theme";
import { createTicketClaimURL } from "../../../../../lib/deepLinks";
import { useFetch } from "../../../../../lib/useFetch";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const RED_500 = Colors.principal.red[500];
const YELLOW_100 = Colors.principal.yellow[100];
const YELLOW_700 = Colors.principal.yellow[700];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ─── Steps ─────────────────────────────────────────────────────────────────────
const STEP_SELECT = 1;
const STEP_CONFIRM = 2;
const STEP_QR = 3;

// ─── StepIndicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Cantidad", "Confirmar", "QR"];
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

// ─── StatChip ──────────────────────────────────────────────────────────────────
function StatChip({ label, value, bg, color }) {
  return (
    <View style={[styles.statChip, { backgroundColor: bg }]}>
      <Text style={[styles.statChipValue, { color }]}>{value}</Text>
      <Text style={[styles.statChipLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── QRCard ────────────────────────────────────────────────────────────────────
function QRCard({ deepLink, quantity, eventTitle }) {
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      await Share.share({
        message: `Escanea este QR para reclamar tus tickets en Sortealo 🎟️\n${deepLink}`,
        url: uri,
      });
    } catch {
      await Share.share({ message: `Tickets Sortealo\n${deepLink}` });
    } finally {
      setSharing(false);
    }
  }, [deepLink]);

  return (
    <View style={styles.qrCardOuter}>
      {/* ── Tarjeta de marca (es lo que se captura) ── */}
      <View ref={cardRef} collapsable={false} style={styles.brandCard}>
        {/* Header verde */}
        <LinearGradient
          colors={[GREEN_900, Colors.principal.green[700] ?? GREEN_900]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.brandHeader}
        >
          <View style={styles.brandHeaderIcon}>
            <Ionicons name="ticket" size={18} color={GREEN_900} />
          </View>
          <View>
            <Text style={styles.brandTitle}>SORTEALOPE</Text>
            <Text style={styles.brandSubtitle}>Venta de Tickets</Text>
          </View>
        </LinearGradient>

        {/* Cuerpo blanco */}
        <View style={styles.brandBody}>
          {eventTitle ? (
            <Text style={styles.brandEventTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
          ) : null}

          {/* QR */}
          <View style={styles.brandQrWrapper}>
            <QRCode
              value={deepLink}
              size={200}
              color={GREEN_900}
              backgroundColor={WHITE}
              quietZone={12}
            />
          </View>

          <Text style={styles.brandCount}>
            {quantity} ticket{quantity !== 1 ? "s" : ""} incluido
            {quantity !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.brandFooter}>
          <Ionicons name="globe-outline" size={12} color={NEUTRAL_500} />
          <Text style={styles.brandFooterText}>sortealope.app</Text>
        </View>
      </View>

      {/* ── Botón compartir (fuera de la captura) ── */}
      <TouchableOpacity
        style={[styles.shareBtn, sharing && styles.shareBtnDisabled]}
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.8}
      >
        {sharing ? (
          <ActivityIndicator size="small" color={GREEN_900} />
        ) : (
          <Ionicons name="share-social-outline" size={18} color={GREEN_900} />
        )}
        <Text style={styles.shareBtnText}>
          {sharing ? "Generando imagen…" : "Compartir como imagen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function VendedorSellTicketScreen() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();

  // ── State ───────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(STEP_SELECT);
  const [quantity, setQuantity] = useState(1);
  const [generatedQR, setGeneratedQR] = useState(null); // { deepLink, quantity, reservationCode }
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch event con role=SELLER — única llamada a la API ─────────────────────
  const { data: eventData, loading: eventLoading } = useFetch(
    eventId
      ? `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=2&role=SELLER`
      : null,
  );

  // Derivar datos de la colección del array que trae el evento
  const collection = eventData?.collections?.[0] ?? null;
  const collectionId = collection?.collectionId ?? null;
  const availableTickets = collection?.availableTickets ?? 0;
  const reservedTickets = collection?.reservedTickets ?? 0;
  const soldTickets = collection?.soldTickets ?? 0;
  const ticketPrice = eventData?.ticketPrice ?? 0;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQty = () =>
    setQuantity((prev) => Math.min(availableTickets, prev + 1));

  const handleGoConfirm = () => setStep(STEP_CONFIRM);

  const handleGenerateQR = useCallback(async () => {
    setSubmitting(true);
    try {
      // 1. Fetch available tickets to get their codes
      const ticketsRes = await GetTickets(eventId, collectionId, 1, 0, quantity);
      if (!ticketsRes.ok) throw new Error("No se pudieron cargar los tickets.");
      const page = await ticketsRes.json();
      const availTickets = Array.isArray(page) ? page : page?.content ?? [];

      if (availTickets.length < quantity) {
        throw new Error(
          `Solo hay ${availTickets.length} ticket${availTickets.length !== 1 ? "s" : ""} disponible${availTickets.length !== 1 ? "s" : ""}.`,
        );
      }

      const ticketCodes = availTickets.slice(0, quantity).map((t) => t.code);

      // 2. Create reservation
      const reservationRes = await CreateReservation(eventId, ticketCodes);
      if (!reservationRes.ok) {
        const body = await reservationRes.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo crear la reserva.");
      }
      const reservation = await reservationRes.json();
      const reservationCode = reservation.id;

      // El comprador confirma la compra escaneando el QR con la app
      const deepLink = createTicketClaimURL(reservationCode);
      setGeneratedQR({ deepLink, quantity, reservationCode });
      setStep(STEP_QR);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  }, [eventId, collectionId, quantity]);

  const resetFlow = useCallback(() => {
    setStep(STEP_SELECT);
    setQuantity(1);
    setGeneratedQR(null);
  }, []);

  // ─── Step 1: selección de cantidad ──────────────────────────────────────────
  const renderStep1 = () => {
    if (eventLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando evento…</Text>
        </View>
      );
    }

    if (!collectionId) {
      return (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={52} color={RED_500} />
          <Text style={styles.errorTitle}>Sin colección asignada</Text>
          <Text style={styles.errorBody}>
            No tienes una colección asignada para este evento.
          </Text>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.back()}
          >
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (availableTickets === 0) {
      return (
        <View style={styles.centered}>
          <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
          <Text style={styles.errorTitle}>Sin tickets disponibles</Text>
          <Text style={styles.errorBody}>
            Todos los tickets de tu colección ya han sido vendidos o están
            reservados.
          </Text>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.back()}
          >
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas de la colección */}
        <Text style={styles.sectionLabel}>Estado de tu colección</Text>
        <View style={styles.statsRow}>
          <StatChip
            label="Disponibles"
            value={availableTickets}
            bg={GREEN_50}
            color={GREEN_900}
          />
          <StatChip
            label="Reservados"
            value={reservedTickets}
            bg={YELLOW_100}
            color={YELLOW_700}
          />
          <StatChip
            label="Vendidos"
            value={soldTickets}
            bg={NEUTRAL_100}
            color={NEUTRAL_700}
          />
        </View>

        {/* Selector de cantidad */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          ¿Cuántos tickets deseas vender?
        </Text>

        <View style={styles.pickerCard}>
          <TouchableOpacity
            style={[
              styles.pickerBtn,
              quantity <= 1 && styles.pickerBtnDisabled,
            ]}
            onPress={decreaseQty}
            disabled={quantity <= 1}
            activeOpacity={0.7}
          >
            <Ionicons
              name="remove"
              size={28}
              color={quantity <= 1 ? NEUTRAL_200 : GREEN_900}
            />
          </TouchableOpacity>

          <View style={styles.pickerCenter}>
            <Text style={styles.pickerQty}>{quantity}</Text>
            <Text style={styles.pickerMax}>máx. {availableTickets}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.pickerBtn,
              quantity >= availableTickets && styles.pickerBtnDisabled,
            ]}
            onPress={increaseQty}
            disabled={quantity >= availableTickets}
            activeOpacity={0.7}
          >
            <Ionicons
              name="add"
              size={28}
              color={quantity >= availableTickets ? NEUTRAL_200 : GREEN_900}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleGoConfirm}>
          <Text style={styles.btnPrimaryText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // ─── Step 2: confirmación ──────────────────────────────────────────────────
  const renderStep2 = () => {
    const total = quantity * ticketPrice;
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Resumen de la venta</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cantidad</Text>
            <Text style={styles.summaryValue}>
              {quantity} ticket{quantity !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio por ticket</Text>
            <Text style={styles.summaryValue}>
              S/.{ticketPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelTotal}>Total</Text>
            <Text style={styles.summaryValueTotal}>
              S/.{total.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={YELLOW_700}
          />
          <Text style={styles.noteText}>
            El comprador escaneará el QR generado. Asegúrate de confirmar el
            pago antes de mostrar el código.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, submitting && { opacity: 0.7 }]}
          onPress={handleGenerateQR}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Ionicons name="qr-code-outline" size={20} color={WHITE} />
          )}
          <Text style={styles.btnPrimaryText}>
            {submitting ? "Procesando…" : "Confirmar y generar QR"}
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
  };

  // ─── Step 3: QR ─────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={40} color={WHITE} />
        </View>
        <Text style={styles.successTitle}>QR listo</Text>
        <Text style={styles.successSubtitle}>
          El comprador escanea el QR con la app Sortealo. Si no la tiene, el
          enlace lo llevará a descargarla.
        </Text>
      </View>

      {generatedQR && (
        <QRCard
          deepLink={generatedQR.deepLink}
          quantity={generatedQR.quantity}
          eventTitle={eventData?.title}
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
    [STEP_SELECT]: "Selecciona la cantidad",
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
  stepDotText: {
    fontSize: 11,
    fontWeight: "700",
    color: NEUTRAL_500,
  },
  stepLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginLeft: 5,
    fontWeight: Typography.weights.medium,
  },
  stepLabelActive: {
    color: GREEN_900,
    fontWeight: Typography.weights.bold,
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: NEUTRAL_200,
    marginHorizontal: 6,
  },
  stepLineDone: { backgroundColor: GREEN_500 },

  // Step title
  stepTitleBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  stepTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // Shared scroll content
  scrollContent: { padding: 20, paddingBottom: 48 },

  // Section label
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Stats chips row
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  statChipValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },
  statChipLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textAlign: "center",
  },

  // Quantity picker
  pickerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pickerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: GREEN_100,
  },
  pickerBtnDisabled: {
    backgroundColor: NEUTRAL_100,
    borderColor: NEUTRAL_200,
  },
  pickerCenter: { alignItems: "center", flex: 1 },
  pickerQty: {
    fontSize: 56,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 64,
  },
  pickerMax: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },

  // Summary card (Step 2)
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  summaryValue: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.semibold,
  },
  summaryLabelTotal: {
    fontSize: Typography.sizes.lg,
    color: GREEN_900,
    fontWeight: Typography.weights.bold,
  },
  summaryValueTotal: {
    fontSize: Typography.sizes.xl,
    color: GREEN_900,
    fontWeight: Typography.weights.extrabold,
  },

  // Info note box
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.principal.yellow[50],
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.principal.yellow[200],
  },
  noteText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: YELLOW_700,
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

  // ── Branded QR card ────────────────────────────────────────────
  qrCardOuter: {
    alignItems: "center",
    marginBottom: 12,
  },
  brandCard: {
    width: 320,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 16,
  },
  // Header
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  brandHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.75)",
    fontWeight: Typography.weights.medium,
    marginTop: 1,
  },
  // Body
  brandBody: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: WHITE,
  },
  brandEventTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textAlign: "center",
    marginBottom: 16,
  },
  brandQrWrapper: {
    padding: 12,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    marginBottom: 14,
  },
  brandCount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
  },
  // Footer
  brandFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
    backgroundColor: WHITE,
  },
  brandFooterText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  // Share button
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GREEN_500,
    backgroundColor: GREEN_50,
  },
  shareBtnDisabled: {
    opacity: 0.6,
  },
  shareBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
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
  btnSecondary: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnSecondaryText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // Empty / error states
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
