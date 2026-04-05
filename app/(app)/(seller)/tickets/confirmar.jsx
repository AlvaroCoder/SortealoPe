import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { ConfirmTicket } from "../../../../Connections/tickets";
import { Colors, Typography } from "../../../../constants/theme";
import { fetchWithAuth } from "../../../../lib/fetchWithAuth";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Payment methods ────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 1, label: "Yape", icon: "phone-portrait-outline" },
  { id: 2, label: "Transferencia", icon: "swap-horizontal-outline" },
  { id: 3, label: "Efectivo", icon: "cash-outline" },
  { id: 4, label: "Plin", icon: "phone-portrait-outline" },
];

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SellerConfirmarTickets() {
  const router = useRouter();
  const {
    eventId,
    ticketPrice: ticketPriceStr,
    collectionId,
  } = useLocalSearchParams();
  const ticketPrice = parseFloat(ticketPriceStr ?? "0");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [confirmingIds, setConfirmingIds] = useState(new Set());

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModality, setSelectedModality] = useState(1);
  const [operationNumber, setOperationNumber] = useState("");

  // ── Fetch tickets with ticketStatus=3 ────────────────────────────────────────
  const fetchPendingTickets = useCallback(async () => {
    if (!eventId || !collectionId) return;
    try {
      const res = await fetchWithAuth(
        `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=3&page=0&size=200`,
      );
      if (!res.ok) throw new Error("No se pudieron cargar los tickets.");
      const body = await res.json();

      const items = Array.isArray(body) ? body : (body?.content ?? []);
      setTickets(
        items.sort((a, b) => (a.serialNumber ?? 0) - (b.serialNumber ?? 0)),
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }, [eventId, collectionId]);

  useEffect(() => {
    setLoading(true);
    fetchPendingTickets().finally(() => setLoading(false));
  }, [fetchPendingTickets]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingTickets();
    setRefreshing(false);
  };

  // ── Selection logic ──────────────────────────────────────────────────────────
  const ticketKey = (t) => t.code ?? String(t.id);

  const toggleSelect = (key) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCodes.size === tickets.length) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(tickets.map(ticketKey)));
    }
  };

  const allSelected =
    tickets.length > 0 && selectedCodes.size === tickets.length;

  // ── Confirm logic ────────────────────────────────────────────────────────────
  const openModal = () => {
    if (selectedCodes.size === 0) return;
    setSelectedModality(1);
    setOperationNumber("");
    setModalVisible(true);
  };

  const handleModalClose = () => setModalVisible(false);

  const handleModalConfirm = async () => {
    const codes = [...selectedCodes];
    const resolvedOp = selectedModality === 3 ? "" : operationNumber;
    setModalVisible(false);
    setConfirmingIds(new Set(codes));

    let failed = 0;
    for (const code of codes) {
      const ticket = tickets.find((t) => ticketKey(t) === code);
      if (!ticket) continue;
      try {
        const res = await ConfirmTicket(eventId, ticket.code, {
          modalityId: selectedModality,
          operationNumber: resolvedOp,
        });
        if (!res.ok) {
          failed++;
          continue;
        }
        setTickets((prev) => prev.filter((t) => ticketKey(t) !== code));
      } catch {
        failed++;
      }
    }

    setSelectedCodes(new Set());
    setConfirmingIds(new Set());
    if (failed > 0) {
      Alert.alert("Aviso", `${failed} ticket(s) no pudieron confirmarse.`);
    }
  };

  // ── Derived values ───────────────────────────────────────────────────────────
  const total = selectedCodes.size * ticketPrice;
  const fmt = (n) => `S/. ${n.toFixed(2)}`;

  // ── Ticket list item ─────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    console.log("Item :", item);

    const key = ticketKey(item);
    const isSelected = selectedCodes.has(key);
    const isConfirming = confirmingIds.has(key);
    const serialLabel =
      item.serialNumber != null
        ? `N.° ${String(item.serialNumber).padStart(3, "0")}`
        : key.substring(0, 8);
    const buyerName = item.buyer
      ? `${item.buyer.firstName ?? ""} ${item.buyer.lastName ?? ""}`.trim()
      : null;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => !isConfirming && toggleSelect(key)}
        activeOpacity={0.75}
      >
        {/* Checkbox */}
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isConfirming ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : isSelected ? (
            <Ionicons name="checkmark" size={14} color={WHITE} />
          ) : null}
        </View>

        {/* Serial badge */}
        <View style={styles.serialBadge}>
          <Ionicons name="ticket-outline" size={14} color={GREEN_900} />
          <Text style={styles.serialText}>{serialLabel}</Text>
        </View>

        {/* Price */}
        <Text
          style={[styles.priceText, isSelected && styles.priceTextSelected]}
        >
          {fmt(ticketPrice)}
        </Text>
      </TouchableOpacity>
    );
  };

  // ── Payment modal ────────────────────────────────────────────────────────────
  const renderModal = () => {
    const isEfectivo = selectedModality === 3;
    const row1 = PAYMENT_METHODS.slice(0, 2);
    const row2 = PAYMENT_METHODS.slice(2, 4);

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={handleModalClose}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalWrapper}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              {/* Handle */}
              <View style={styles.modalHandle} />

              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={GREEN_900}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.modalTitle}>Confirmar Pago</Text>
                </View>
                <TouchableOpacity
                  onPress={handleModalClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={22} color={NEUTRAL_500} />
                </TouchableOpacity>
              </View>

              {/* Summary row */}
              <View style={styles.modalSummary}>
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryLabel}>Tickets</Text>
                  <Text style={styles.modalSummaryValue}>
                    {selectedCodes.size}
                  </Text>
                </View>
                <View style={styles.modalSummaryDivider} />
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryLabel}>Total</Text>
                  <Text
                    style={[styles.modalSummaryValue, { color: GREEN_500 }]}
                  >
                    {fmt(total)}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              {/* Payment method */}
              <Text style={styles.sectionLabel}>Método de pago</Text>
              <View style={styles.pillGrid}>
                {[row1, row2].map((row, rowIdx) => (
                  <View key={rowIdx} style={styles.pillRow}>
                    {row.map((method) => {
                      const active = selectedModality === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          style={[
                            styles.pill,
                            active ? styles.pillActive : styles.pillIdle,
                          ]}
                          onPress={() => setSelectedModality(method.id)}
                          activeOpacity={0.75}
                        >
                          <Ionicons
                            name={method.icon}
                            size={15}
                            color={active ? WHITE : NEUTRAL_700}
                            style={{ marginRight: 5 }}
                          />
                          <Text
                            style={[
                              styles.pillText,
                              active
                                ? styles.pillTextActive
                                : styles.pillTextIdle,
                            ]}
                          >
                            {method.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Operation number (hidden for Efectivo) */}
              {!isEfectivo && (
                <View style={styles.inputSection}>
                  <Text style={styles.sectionLabel}>Número de operación</Text>
                  <TextInput
                    style={styles.operationInput}
                    placeholder="Ej. 123456789"
                    placeholderTextColor={NEUTRAL_500}
                    value={operationNumber}
                    onChangeText={setOperationNumber}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                </View>
              )}

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleModalClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleModalConfirm}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={WHITE}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.modalConfirmBtnText}>
                    Confirmar{" "}
                    {selectedCodes.size > 1
                      ? `${selectedCodes.size} tickets`
                      : "ticket"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    );
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={GREEN_900} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Confirmar Tickets</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando tickets…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {renderModal()}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={GREEN_900} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Confirmar Tickets</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* ── Count + select-all bar ────────────────────────────────────────── */}
      <View style={styles.countBar}>
        <View style={styles.countLeft}>
          <Text style={styles.countNumber}>{tickets.length}</Text>
          <Text style={styles.countLabel}>
            ticket{tickets.length !== 1 ? "s" : ""} por confirmar
          </Text>
        </View>
        {tickets.length > 0 && (
          <TouchableOpacity
            style={styles.selectAllBtn}
            onPress={toggleSelectAll}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.selectAllCheck,
                allSelected && styles.selectAllCheckActive,
              ]}
            >
              {allSelected && (
                <Ionicons name="checkmark" size={12} color={WHITE} />
              )}
            </View>
            <Text style={styles.selectAllText}>
              {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Ticket list ──────────────────────────────────────────────────── */}
      <FlatList
        data={tickets}
        keyExtractor={ticketKey}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          tickets.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[GREEN_900]}
            tintColor={GREEN_900}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="checkmark-circle" size={48} color={GREEN_500} />
            </View>
            <Text style={styles.emptyTitle}>¡Todo al día!</Text>
            <Text style={styles.emptyText}>
              No hay tickets pendientes de confirmación.
            </Text>
          </View>
        }
      />

      {/* ── Bottom bar (visible when any selected) ───────────────────────── */}
      {selectedCodes.size > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomCount}>
              {selectedCodes.size} seleccionado
              {selectedCodes.size !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.bottomTotal}>{fmt(total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={openModal}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done" size={18} color={WHITE} />
            <Text style={styles.confirmBtnText}>Confirmar pago</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEUTRAL_50 },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBarWrapper: { backgroundColor: WHITE },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Centered ─────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  centeredText: {
    marginTop: 10,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
  },

  // ── Count bar ────────────────────────────────────────────────────────────────
  countBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  countLeft: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  countNumber: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  countLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
  },
  selectAllCheck: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: NEUTRAL_500,
    alignItems: "center",
    justifyContent: "center",
  },
  selectAllCheckActive: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  selectAllText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  listContent: { padding: 14, paddingBottom: 120 },

  // ── Ticket card ──────────────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSelected: {
    borderColor: GREEN_500,
    backgroundColor: Colors.principal.green[50],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: WHITE,
  },
  checkboxSelected: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  serialBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: GREEN_100,
    flexShrink: 0,
  },
  serialText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  cardInfo: { flex: 1, gap: 3 },
  buyerName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  codeText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontFamily: Platform.OS === "ios" ? "ui-monospace" : "monospace",
  },
  priceText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
    flexShrink: 0,
  },
  priceTextSelected: {
    color: GREEN_900,
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIconBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // ── Bottom bar ────────────────────────────────────────────────────────────────
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomCount: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  bottomTotal: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  confirmBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalWrapper: { justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitleRow: { flexDirection: "row", alignItems: "center" },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // Summary row inside modal
  modalSummary: {
    flexDirection: "row",
    backgroundColor: GREEN_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GREEN_100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 16,
  },
  modalSummaryItem: { flex: 1, alignItems: "center", gap: 3 },
  modalSummaryLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalSummaryValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  modalSummaryDivider: {
    width: 1,
    backgroundColor: GREEN_100,
    alignSelf: "stretch",
  },
  modalDivider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  // Payment pills
  pillGrid: { gap: 10, marginBottom: 20 },
  pillRow: { flexDirection: "row", gap: 10 },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  pillActive: { backgroundColor: GREEN_900, borderColor: GREEN_900 },
  pillIdle: { backgroundColor: WHITE, borderColor: NEUTRAL_200 },
  pillText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  pillTextActive: { color: WHITE },
  pillTextIdle: { color: NEUTRAL_700 },

  // Operation input
  inputSection: { marginBottom: 22 },
  operationInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    backgroundColor: WHITE,
  },

  // Modal actions
  modalActions: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    backgroundColor: WHITE,
  },
  cancelBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },
  modalConfirmBtn: {
    flex: 2,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: GREEN_900,
  },
  modalConfirmBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
});
