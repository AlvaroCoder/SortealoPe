import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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
import {
  ENDPOINTS_COLLECTIONS,
  ENDPOINTS_TICKETS,
} from "../../../../Connections/APIURLS";
import { ConfirmTicket } from "../../../../Connections/tickets";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { useRaffleContext } from "../../../../context/RaffleContext";
import { fetchWithAuth } from "../../../../lib/fetchWithAuth";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// Payment methods with their API modalityId values
const PAYMENT_METHODS = [
  { id: 1, label: "Yape", icon: "phone-portrait-outline" },
  { id: 2, label: "Transferencia", icon: "swap-horizontal-outline" },
  { id: 3, label: "Efectivo", icon: "cash-outline" },
  { id: 4, label: "Plin", icon: "phone-portrait-outline" },
];

export default function ConfirmarTicketsScreen() {
  const { id: eventId } = useLocalSearchParams();
  const { userData } = useAuthContext();
  const { isAdmin } = useRaffleContext();
  const userId = userData?.userId;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingIds, setConfirmingIds] = useState(new Set());

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingTicket, setPendingTicket] = useState(null);
  const [selectedModality, setSelectedModality] = useState(1);
  const [operationNumber, setOperationNumber] = useState("");

  const fetchPendingTickets = useCallback(async () => {
    if (!eventId || !userId) return;
    try {
      // 1. Fetch all collections for the event
      const colRes = await fetchWithAuth(
        `${ENDPOINTS_COLLECTIONS.GET_BY_EVENT}?eventId=${eventId}&page=0&size=100`,
      );
      if (!colRes.ok) throw new Error("No se pudieron cargar las colecciones.");
      const colBody = await colRes.json();
      const allCols = Array.isArray(colBody)
        ? colBody
        : (colBody?.content ?? []);

      // 2. Admin sees all collections; seller only sees their own
      const relevantCols = isAdmin
        ? allCols
        : allCols.filter(
            (c) =>
              c.seller?.id === userId ||
              c.seller?.userId === userId ||
              c.userId === userId,
          );

      // 3. For each collection, fetch tickets with status=3 (comprado, pendiente de confirmación)
      const all = [];
      await Promise.all(
        relevantCols.map(async (col) => {
          const res = await fetchWithAuth(
            `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${col.id}&ticketStatus=3&page=0&size=200`,
          );
          if (!res.ok) return;
          const body = await res.json();
          const items = Array.isArray(body) ? body : (body?.content ?? []);
          items.forEach((t) =>
            all.push({
              ...t,
              _collectionCode: col.code,
              _collectionId: col.id,
            }),
          );
        }),
      );

      setTickets(all);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }, [eventId, userId, isAdmin]);

  useEffect(() => {
    setLoading(true);
    fetchPendingTickets().finally(() => setLoading(false));
  }, [fetchPendingTickets]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingTickets();
    setRefreshing(false);
  };

  // Opens the modal instead of calling ConfirmTicket directly
  const handleConfirm = (ticket) => {
    setPendingTicket(ticket);
    setSelectedModality(1);
    setOperationNumber("");
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setPendingTicket(null);
  };

  // Called when user taps "Confirmar" inside the modal
  const handleModalConfirm = async () => {
    if (!pendingTicket) return;

    const ticket = pendingTicket;
    const ticketKey = ticket.code ?? String(ticket.id);
    const resolvedOperationNumber = selectedModality === 3 ? "" : operationNumber;

    // Close modal immediately so UX is snappy; spinner shows on the card button
    setModalVisible(false);
    setPendingTicket(null);

    setConfirmingIds((prev) => new Set([...prev, ticketKey]));
    try {
      const res = await ConfirmTicket(eventId, ticket.code, {
        modalityId: selectedModality,
        operationNumber: resolvedOperationNumber,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo confirmar el ticket.");
      }
      // Remove confirmed ticket from the list
      setTickets((prev) =>
        prev.filter((t) => (t.code ?? String(t.id)) !== ticketKey),
      );
    } catch (err) {
      Alert.alert("Error al confirmar", err.message);
    } finally {
      setConfirmingIds((prev) => {
        const next = new Set(prev);
        next.delete(ticketKey);
        return next;
      });
    }
  };

  const renderItem = ({ item }) => {
    const ticketKey = item.code ?? String(item.id);
    const isConfirming = confirmingIds.has(ticketKey);
    const shortCode = item.code
      ? `${item.code.substring(0, 8)}…`
      : `#${item.id}`;

    return (
      <View style={styles.card}>
        {/* Serial badge */}
        <View style={styles.serialBadge}>
          <Ionicons name="ticket-outline" size={14} color={GREEN_900} />
          <Text style={styles.serialText}>
            {item.serialNumber != null ? `N.° ${item.serialNumber}` : shortCode}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.metaRow}>
            <Text>#{item?.id}</Text>
          </View>
        </View>

        {/* Confirm button — now opens modal */}
        <TouchableOpacity
          style={[styles.confirmBtn, isConfirming && styles.confirmBtnDisabled]}
          onPress={() => handleConfirm(item)}
          disabled={isConfirming}
          activeOpacity={0.8}
        >
          {isConfirming ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <>
              <Ionicons name="checkmark" size={15} color={WHITE} />
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ── Payment confirmation modal ──────────────────────────────────────────────
  const renderModal = () => {
    const isEfectivo = selectedModality === 3;
    // Lay out pills in two rows of two
    const row1 = PAYMENT_METHODS.slice(0, 2);
    const row2 = PAYMENT_METHODS.slice(2, 4);

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
        statusBarTranslucent
      >
        {/* Semi-transparent backdrop — tap outside to dismiss */}
        <Pressable style={styles.backdrop} onPress={handleModalClose}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalWrapper}
          >
            {/* Card — stop backdrop press from propagating through it */}
            <Pressable style={styles.modalCard} onPress={() => {}}>
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

              <View style={styles.modalDivider} />

              {/* Payment method label */}
              <Text style={styles.sectionLabel}>Método de pago</Text>

              {/* Pills — 2 × 2 grid */}
              <View style={styles.pillGrid}>
                {[row1, row2].map((row, rowIdx) => (
                  <View key={rowIdx} style={styles.pillRow}>
                    {row.map((method) => {
                      const isSelected = selectedModality === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          style={[
                            styles.pill,
                            isSelected
                              ? styles.pillSelected
                              : styles.pillUnselected,
                          ]}
                          onPress={() => setSelectedModality(method.id)}
                          activeOpacity={0.75}
                        >
                          <Ionicons
                            name={method.icon}
                            size={15}
                            color={isSelected ? WHITE : NEUTRAL_700}
                            style={{ marginRight: 5 }}
                          />
                          <Text
                            style={[
                              styles.pillText,
                              isSelected
                                ? styles.pillTextSelected
                                : styles.pillTextUnselected,
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

              {/* Operation number input — hidden for Efectivo */}
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

              {/* Action buttons */}
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
                  <Text style={styles.modalConfirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    );
  };
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando tickets…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Payment confirmation modal */}
      {renderModal()}

      {/* Count header */}
      <View style={styles.countBar}>
        <View style={styles.countLeft}>
          <Text style={styles.countNumber}>{tickets.length}</Text>
          <Text style={styles.countLabel}>
            ticket{tickets.length !== 1 ? "s" : ""} por confirmar
          </Text>
        </View>
        {tickets.length > 0 && (
          <View style={styles.pendingPill}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingPillText}>Pendientes</Text>
          </View>
        )}
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.code ?? String(item.id)}
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
              No hay tickets pendientes de confirmación en este evento.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },

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

  // ── Count bar ──────────────────────────────────────────────────────────────
  countBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  pendingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.principal.yellow[50] ?? "#FFFBEB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.principal.yellow[200] ?? "#FDE68A",
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.principal.yellow[500] ?? "#F59E0B",
  },
  pendingPillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.principal.yellow[700] ?? "#B45309",
  },

  // ── List ───────────────────────────────────────────────────────────────────
  listContent: { padding: 16, paddingBottom: 32 },

  // ── Ticket card ────────────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
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
    fontSize: 10,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  cardInfo: { flex: 1, gap: 3 },
  codeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
    fontFamily: "monospace",
    marginBottom: 2,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: Typography.sizes.xs, color: NEUTRAL_500 },

  // ── Confirm button (on card) ───────────────────────────────────────────────
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: GREEN_900,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexShrink: 0,
    minWidth: 100,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
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

  // ── Modal ──────────────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalWrapper: {
    // Sits at the bottom; KeyboardAvoidingView pushes it up on iOS
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  modalDivider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 18,
  },

  // Section label shared by method selector and input
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  // ── Payment method pills ───────────────────────────────────────────────────
  pillGrid: {
    gap: 10,
    marginBottom: 20,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
  },
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
  pillSelected: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  pillUnselected: {
    backgroundColor: WHITE,
    borderColor: NEUTRAL_200,
  },
  pillText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  pillTextSelected: {
    color: WHITE,
  },
  pillTextUnselected: {
    color: NEUTRAL_700,
  },

  // ── Operation number input ─────────────────────────────────────────────────
  inputSection: {
    marginBottom: 22,
  },
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

  // ── Modal action buttons ───────────────────────────────────────────────────
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
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