import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { File, Paths } from "expo-file-system";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetCollectionsByEvent } from "../../../../Connections/collections";
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { useFetch } from "../../../../lib/useFetch";

// ─── Deep link base — change to production URL when deployed ──────────────────
// Universal link: si la app está instalada la abre, si no redirige a la tienda.
const DEEP_LINK_BASE = "https://sortealope.app/tickets";

// Encodes all selected tickets into a single deep link
const buildGroupDeepLink = (tickets) =>
  `${DEEP_LINK_BASE}?tickets=${encodeURIComponent(
    JSON.stringify(tickets.map((t) => ({ id: t.id, code: t.code })))
  )}`;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GREEN_900  = Colors.principal.green[900];
const GREEN_500  = Colors.principal.green[500];
const GREEN_50   = Colors.principal.green[50];
const GREEN_100  = Colors.principal.green[100];
const RED_500    = Colors.principal.red[500];
const YELLOW_500 = Colors.principal.yellow[500];
const YELLOW_100 = Colors.principal.yellow[100];
const WHITE      = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_300 = Colors.principal.neutral[300];
const NEUTRAL_500 = Colors.principal.neutral[500];

// ─── Steps ─────────────────────────────────────────────────────────────────────
const STEP_SELECT  = 1;
const STEP_CONFIRM = 2;
const STEP_QR      = 3;

// ─── Ticket statuses ───────────────────────────────────────────────────────────
// Backend: 1=disponible  2=reservado  3=pagado  4=ganador(oculto)  5=terminado(oculto)
const STATUS_DISPONIBLE = 1;
const STATUS_RESERVADO  = 2;
const STATUS_PAGADO     = 3;
const VISIBLE_STATUSES  = new Set([STATUS_DISPONIBLE, STATUS_RESERVADO, STATUS_PAGADO]);

const STATUS_STYLE = {
  [STATUS_DISPONIBLE]: {
    cell:      { backgroundColor: GREEN_50,    borderColor: GREEN_500  },
    text:      { color: GREEN_900 },
    icon:      "ticket-outline",
    iconColor: GREEN_900,
  },
  [STATUS_RESERVADO]: {
    cell:      { backgroundColor: YELLOW_100,  borderColor: YELLOW_500 },
    text:      { color: Colors.principal.yellow[700] },
    icon:      "time-outline",
    iconColor: YELLOW_500,
  },
  [STATUS_PAGADO]: {
    cell:      { backgroundColor: NEUTRAL_100, borderColor: NEUTRAL_200 },
    text:      { color: NEUTRAL_500 },
    icon:      "checkmark-circle-outline",
    iconColor: NEUTRAL_500,
  },
};

// ─── TicketCell ────────────────────────────────────────────────────────────────
function TicketCell({ ticket, selected, onToggle }) {
  const statusId     = ticket.status?.id;
  const isSelectable = statusId === STATUS_DISPONIBLE;
  const style        = STATUS_STYLE[statusId] ?? STATUS_STYLE[STATUS_PAGADO];

  return (
    <TouchableOpacity
      style={[
        styles.ticketCell,
        style.cell,
        selected && styles.ticketCellSelected,
      ]}
      onPress={() => isSelectable && onToggle(ticket)}
      disabled={!isSelectable}
      activeOpacity={isSelectable ? 0.7 : 1}
    >
      {selected
        ? <Ionicons name="checkmark-circle" size={14} color={GREEN_900} />
        : <Ionicons name={style.icon} size={14} color={style.iconColor} />}
      <Text style={[styles.ticketCellText, style.text]}>{ticket.serialNumber}</Text>
    </TouchableOpacity>
  );
}

// ─── StepIndicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Tickets", "Confirmar", "QR"];
  return (
    <View style={styles.stepRow}>
      {steps.map((label, i) => {
        const num    = i + 1;
        const active = current === num;
        const done   = current > num;
        return (
          <View key={num} style={styles.stepItem}>
            <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
              {done
                ? <Ionicons name="checkmark" size={11} color={WHITE} />
                : <Text style={[styles.stepDotText, active && { color: WHITE }]}>{num}</Text>}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
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
function QRCard({ item }) {
  const qrRef = useRef(null);

  const handleShareImage = useCallback(() => {
    if (!qrRef.current) return;
    qrRef.current.toDataURL(async (base64Data) => {
      try {
        const file = new File(Paths.cache, `sortealo-qr-${Date.now()}.png`);
        file.write(base64Data, { encoding: "base64" });
        await Share.share({
          message: `Tickets Sortealo\n${item.deepLink}`,
          url: file.uri,
        });
      } catch {
        // Fallback: share link only
        await Share.share({ message: `Tickets Sortealo\n${item.deepLink}` });
      }
    });
  }, [item.deepLink]);

  return (
    <View style={styles.qrCard}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={item.deepLink}
          size={220}
          color={GREEN_900}
          backgroundColor={WHITE}
          quietZone={16}
          getRef={(c) => { qrRef.current = c; }}
        />
      </View>

      <Text style={styles.qrCount}>
        {item.tickets.length} ticket{item.tickets.length !== 1 ? "s" : ""} incluido{item.tickets.length !== 1 ? "s" : ""}
      </Text>

      <View style={styles.ticketPillList}>
        {item.tickets.map((t) => (
          <View key={t.code} style={styles.ticketPill}>
            <Text style={styles.ticketPillSerial}>N.° {t.serialNumber ?? t.id}</Text>
            <Text style={styles.ticketPillCode} numberOfLines={1}>{t.code}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShareImage}>
        <Ionicons name="share-outline" size={16} color={GREEN_900} />
        <Text style={styles.shareBtnText}>Compartir QR como imagen</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function SellTicketScreen() {
  const router  = useRouter();
  const { id: eventId } = useLocalSearchParams();
  const { userData, loading: authLoading } = useAuthContext();
  const userId  = userData?.userId;

  // ── State ───────────────────────────────────────────────────────────────────
  const [step, setStep]                           = useState(STEP_SELECT);
  const [collectionId, setCollectionId]           = useState(null);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [collectionError, setCollectionError]     = useState(null);

  // Multi-selection: Set of ticket codes
  const [selectedCodes, setSelectedCodes]     = useState(new Set());
  // Full ticket objects for the selected codes
  const [selectedTickets, setSelectedTickets] = useState([]);
  // Single QR built client-side: { tickets: [...], deepLink }
  const [generatedQR, setGeneratedQR]         = useState(null);

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
        const collections = await res.json();

        const mine =
          collections.find(
            (c) =>
              c.seller?.id === userId ||
              c.seller?.userId === userId ||
              c.user?.id === userId ||
              c.userId === userId
          ) ?? (collections.length === 1 ? collections[0] : null);

        if (!cancelled) {
          if (mine) setCollectionId(mine.id);
          else setCollectionError("No tienes una colección asignada para este evento.");
        }
      } catch (err) {
        if (!cancelled) setCollectionError(err.message);
      } finally {
        if (!cancelled) setLoadingCollection(false);
      }
    })();

    return () => { cancelled = true; };
  }, [eventId, userId, authLoading]);

  // ── Fetch tickets ───────────────────────────────────────────────────────────
  const ticketsUrl = collectionId
    ? `${ENDPOINTS_TICKETS.GET_BY_COLLECTION}?collectionId=${collectionId}`
    : null;
  const { data: ticketsData, loading: ticketsLoading } = useFetch(ticketsUrl);

  // Solo mostrar estados 1/2/3 — ocultar ganador(4) y terminado(5)
  const tickets = (ticketsData ?? []).filter(
    (t) => VISIBLE_STATUSES.has(t.status?.id)
  );

  const disponibles = tickets.filter((t) => t.status?.id === STATUS_DISPONIBLE).length;
  const reservados  = tickets.filter((t) => t.status?.id === STATUS_RESERVADO).length;
  const pagados     = tickets.filter((t) => t.status?.id === STATUS_PAGADO).length;

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
    setStep(STEP_CONFIRM);
  };

  // ── Generate single QR client-side (no API call) ────────────────────────────
  const handleGenerateQRs = () => {
    const deepLink = buildGroupDeepLink(selectedTickets);
    setGeneratedQR({ tickets: selectedTickets, deepLink });
    setStep(STEP_QR);
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const resetFlow = useCallback(() => {
    setStep(STEP_SELECT);
    setSelectedCodes(new Set());
    setSelectedTickets([]);
    setGeneratedQR(null);
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
          <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
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
            <Text style={styles.legendText}>Disponible ({disponibles})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: YELLOW_500 }]} />
            <Text style={styles.legendText}>Reservado ({reservados})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: NEUTRAL_300 }]} />
            <Text style={styles.legendText}>Pagado ({pagados})</Text>
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
              <Text style={styles.centeredText}>Sin tickets en esta colección.</Text>
            </View>
          }
        />

        {/* Barra inferior — aparece al seleccionar ≥1 */}
        {selectedCodes.size > 0 && (
          <View style={styles.stickyBottom}>
            <View style={styles.selectionRow}>
              <Text style={styles.selectionText}>
                {selectedCodes.size} ticket{selectedCodes.size !== 1 ? "s" : ""} seleccionado{selectedCodes.size !== 1 ? "s" : ""}
              </Text>
              <TouchableOpacity onPress={() => setSelectedCodes(new Set())}>
                <Text style={styles.clearText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleGoConfirm}>
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
            <Text style={styles.ticketListCode} numberOfLines={1}>{t.code}</Text>
          </View>
        ))}
      </View>

      {/* Nota informativa */}
      <View style={styles.noteBox}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.principal.yellow[700]} />
        <Text style={styles.noteText}>
          En caso de error o no pago, los tickets reservados pueden
          desbloquearse más tarde desde la gestión del evento.
        </Text>
      </View>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleGenerateQRs}>
        <Ionicons name="qr-code-outline" size={20} color={WHITE} />
        <Text style={[styles.btnPrimaryText, { marginLeft: 8 }]}>
          Generar QR{selectedTickets.length > 1 ? `s (${selectedTickets.length})` : ""}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(STEP_SELECT)}>
        <Text style={styles.btnSecondaryText}>Volver a selección</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── Step 3: QR único ──────────────────────────────────────────────────────
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

      {generatedQR && <QRCard item={generatedQR} />}

      <TouchableOpacity style={styles.btnOutline} onPress={resetFlow}>
        <Text style={styles.btnOutlineText}>Vender más tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
        <Text style={styles.btnSecondaryText}>Volver al evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const TITLES = {
    [STEP_SELECT]:  "Selecciona los tickets",
    [STEP_CONFIRM]: "Confirmar venta",
    [STEP_QR]:      "QR generados",
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StepIndicator current={step} />
      <View style={styles.stepTitleBar}>
        <Text style={styles.stepTitle}>{TITLES[step]}</Text>
      </View>
      {step === STEP_SELECT  && renderStep1()}
      {step === STEP_CONFIRM && renderStep2()}
      {step === STEP_QR      && renderStep3()}
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
  stepItem:        { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: NEUTRAL_200,
    alignItems: "center", justifyContent: "center",
  },
  stepDotActive:   { backgroundColor: GREEN_900 },
  stepDotDone:     { backgroundColor: GREEN_500 },
  stepDotText:     { fontSize: 11, fontWeight: "700", color: NEUTRAL_500 },
  stepLabel: {
    fontSize: Typography.sizes.xs, color: NEUTRAL_500,
    marginLeft: 5, fontWeight: Typography.weights.medium,
  },
  stepLabelActive: { color: GREEN_900, fontWeight: Typography.weights.bold },
  stepLine:        { width: 32, height: 2, backgroundColor: NEUTRAL_200, marginHorizontal: 6 },
  stepLineDone:    { backgroundColor: GREEN_500 },

  // Step title
  stepTitleBar:  { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  stepTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // Legend
  legend:     { flexDirection: "row", gap: 14, paddingHorizontal: 20, paddingBottom: 10, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot:  { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: Typography.sizes.xs, color: NEUTRAL_500 },

  // Ticket grid
  gridContent: { paddingHorizontal: 14, paddingBottom: 24 },
  gridRow:     { justifyContent: "flex-start", marginBottom: 7 },
  ticketCell: {
    width: "23%", margin: "1%", borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 4,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, minHeight: 54, gap: 3,
  },
  ticketCellSelected: { borderColor: GREEN_900, borderWidth: 2.5, backgroundColor: GREEN_100 },
  ticketCellText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },

  // Sticky selection bar
  stickyBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE,
    borderTopWidth: 1, borderTopColor: NEUTRAL_100,
    paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  selectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  selectionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  clearText: { fontSize: Typography.sizes.sm, color: NEUTRAL_500, fontWeight: Typography.weights.medium },

  // Confirm step
  scrollContent: { padding: 20, paddingBottom: 48 },
  sectionLabel: {
    fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold,
    color: NEUTRAL_500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
  },
  ticketListCard: {
    backgroundColor: WHITE, borderRadius: 14,
    borderWidth: 1, borderColor: NEUTRAL_200, overflow: "hidden", marginBottom: 16,
  },
  ticketListRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 11, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: NEUTRAL_100, gap: 12,
  },
  ticketListBadge: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: GREEN_50, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: GREEN_100,
  },
  ticketListBadgeText: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.extrabold, color: GREEN_900,
  },
  ticketListCode: { flex: 1, fontSize: Typography.sizes.xs, color: NEUTRAL_500, fontFamily: "monospace" },
  noteBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: Colors.principal.yellow[50], borderRadius: 12, padding: 14, marginBottom: 24,
    borderWidth: 1, borderColor: Colors.principal.yellow[200],
  },
  noteText: {
    flex: 1, fontSize: Typography.sizes.sm,
    color: Colors.principal.yellow[700], lineHeight: 20,
  },

  // QR step
  successHeader: { alignItems: "center", marginBottom: 24 },
  successIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: GREEN_500,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
    shadowColor: GREEN_500, shadowOpacity: 0.28, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  successTitle: {
    fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold,
    color: GREEN_900, marginBottom: 4,
  },
  successSubtitle: {
    fontSize: Typography.sizes.sm, color: NEUTRAL_500,
    textAlign: "center", lineHeight: 20, paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: WHITE, borderRadius: 16,
    borderWidth: 1, borderColor: NEUTRAL_200,
    padding: 20, alignItems: "center", marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  qrWrapper: {
    padding: 14, backgroundColor: WHITE,
    borderRadius: 14, borderWidth: 1, borderColor: NEUTRAL_100,
    marginBottom: 16,
  },
  qrCount: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500, marginBottom: 10,
  },
  ticketPillList: {
    width: "100%", gap: 6, marginBottom: 16,
  },
  ticketPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: NEUTRAL_100, borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 12, gap: 10,
    borderWidth: 1, borderColor: NEUTRAL_200,
  },
  ticketPillSerial: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.extrabold, color: GREEN_900, minWidth: 48,
  },
  ticketPillCode: {
    flex: 1, fontSize: Typography.sizes.xs, color: NEUTRAL_500, fontFamily: "monospace",
  },
  shareBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, borderWidth: 1.5, borderColor: GREEN_500, backgroundColor: GREEN_50,
  },
  shareBtnText: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: GREEN_900,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: GREEN_900, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 24,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnPrimaryText: { color: WHITE, fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold },
  btnOutline: {
    borderWidth: 2, borderColor: GREEN_900, borderRadius: 14,
    paddingVertical: 14, alignItems: "center", marginTop: 12,
  },
  btnOutlineText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: GREEN_900 },
  btnSecondary:   { paddingVertical: 14, alignItems: "center", marginTop: 8 },
  btnSecondaryText: { fontSize: Typography.sizes.base, color: NEUTRAL_500, fontWeight: Typography.weights.medium },

  // States
  centered:     { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, minHeight: 200 },
  centeredText: { marginTop: 10, fontSize: Typography.sizes.base, color: NEUTRAL_500 },
  errorTitle:   { marginTop: 12, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: GREEN_900, textAlign: "center" },
  errorBody:    { marginTop: 6, fontSize: Typography.sizes.sm, color: NEUTRAL_500, textAlign: "center", lineHeight: 20 },
});