import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_RESERVATIONS } from "../../../../Connections/APIURLS";
import { UploadImage } from "../../../../Connections/images";
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
const NEUTRAL_400 = Colors.principal.neutral[400];
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
export default function IngresarDatosVenta() {
  const router = useRouter();
  const {
    eventId,
    collectionId,
    reservationCodes: codesParam,
    totalAmount,
    totalTickets,
  } = useLocalSearchParams();

  const reservationCodes = JSON.parse(codesParam ?? "[]");
  const amountNum = parseFloat(totalAmount ?? "0");
  const ticketsNum = parseInt(totalTickets ?? "0", 10);

  const [selectedModality, setSelectedModality] = useState(null);
  const [pickedImage, setPickedImage] = useState(null); // { uri, type, name }
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const needsImage = selectedModality !== null && selectedModality !== 3;
  const canConfirm =
    selectedModality !== null &&
    (selectedModality === 3 || pickedImage !== null);

  // ── Pick image from gallery or camera ────────────────────────────────────────
  const pickImage = async (fromCamera) => {
    const permResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permResult.granted) {
      Alert.alert(
        "Permiso requerido",
        fromCamera
          ? "Necesitamos acceso a la cámara."
          : "Necesitamos acceso a la galería.",
      );
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [9, 16],
          quality: 0.85,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [9, 16],
          quality: 0.85,
        });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setPickedImage({
        uri: asset.uri,
        type: "image/jpeg",
        name: "comprobante.jpg",
      });
    }
  };

  // ── Confirm reservations ──────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!canConfirm) return;
    setConfirming(true);

    try {
      // 1. Upload image if needed
      let imageUrl = null;
      if (needsImage && pickedImage) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", pickedImage);
        const uploadRes = await UploadImage(formData);
        setUploading(false);

        if (!uploadRes.ok) {
          Alert.alert(
            "Error",
            "No se pudo subir el comprobante. Inténtalo de nuevo.",
          );
          setConfirming(false);
          return;
        }
        const uploadJson = await uploadRes.json();
        console.log("Json de la imagen subida= ", uploadJson);

        imageUrl = uploadJson?.url ?? null;
        if (!imageUrl) {
          Alert.alert("Error", "No se recibió la URL del comprobante subido.");
          setConfirming(false);
          return;
        }
      }

      console.log("Reservacion Code ", reservationCodes);

      // 2. Confirm each reservation
      let failed = 0;
      for (const code of reservationCodes) {
        try {
          const res = await fetchWithAuth(
            `${ENDPOINTS_RESERVATIONS.CONFIRM}?eventId=${eventId}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                reservationCode: code,
                modalityId: selectedModality,
                image: imageUrl,
              }),
            },
          );
          if (!res.ok) failed++;
        } catch {
          failed++;
        }
      }

      setConfirming(false);

      if (failed === 0) {
        router.replace({
          pathname: "/(app)/(seller)/tickets/exitoConfirmar",
          params: { eventId, collectionId },
        });
      } else {
        Alert.alert(
          "Aviso",
          `${failed} reservación(es) no pudieron confirmarse.`,
          [{ text: "OK", onPress: () => router.back() }],
        );
      }
    } catch {
      setConfirming(false);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    }
  };

  const fmt = (n) => `S/. ${n.toFixed(2)}`;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Ingresar Datos de Venta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Resumen de la reserva ─────────────────────────────────────────── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>RESERVACIONES</Text>
              <Text style={styles.summaryValue}>{reservationCodes.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>TICKETS</Text>
              <Text style={styles.summaryValue}>{ticketsNum}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>TOTAL</Text>
              <Text style={[styles.summaryValue, { color: GREEN_500 }]}>
                {fmt(amountNum)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Método de pago ───────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Método de pago</Text>
        <View style={styles.pillGrid}>
          {[PAYMENT_METHODS.slice(0, 2), PAYMENT_METHODS.slice(2, 4)].map(
            (row, rowIdx) => (
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
                      onPress={() => {
                        setSelectedModality(method.id);
                        // Clear image if switching to Efectivo
                        if (method.id === 3) setPickedImage(null);
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name={method.icon}
                        size={16}
                        color={active ? WHITE : NEUTRAL_700}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.pillText,
                          active ? styles.pillTextActive : styles.pillTextIdle,
                        ]}
                      >
                        {method.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ),
          )}
        </View>

        {/* ── Comprobante de pago (no Efectivo) ────────────────────────────── */}
        {needsImage && (
          <>
            <Text style={styles.sectionLabel}>Comprobante de pago</Text>
            <Text style={styles.sectionHint}>
              Sube una foto del comprobante en formato vertical (Yape, Plin o
              transferencia).
            </Text>

            {pickedImage ? (
              /* Preview de la imagen seleccionada */
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: pickedImage.uri }}
                  style={styles.previewImage}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setPickedImage(null)}
                >
                  <Ionicons name="close-circle" size={28} color={WHITE} />
                </TouchableOpacity>
              </View>
            ) : (
              /* Botones para capturar / seleccionar */
              <View style={styles.imagePickerRow}>
                <TouchableOpacity
                  style={styles.imagePickerBtn}
                  onPress={() => pickImage(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.imagePickerIcon}>
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={GREEN_900}
                    />
                  </View>
                  <Text style={styles.imagePickerLabel}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.imagePickerBtn}
                  onPress={() => pickImage(false)}
                  activeOpacity={0.8}
                >
                  <View style={styles.imagePickerIcon}>
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={GREEN_900}
                    />
                  </View>
                  <Text style={styles.imagePickerLabel}>Galería</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Botón confirmar (sticky) ──────────────────────────────────────────── */}
      <View style={styles.footer}>
        {selectedModality !== null && (
          <View style={styles.footerSummary}>
            <Text style={styles.footerSummaryText}>
              {PAYMENT_METHODS.find((m) => m.id === selectedModality)?.label}
              {needsImage && !pickedImage ? "  · Falta comprobante" : ""}
            </Text>
            <Text style={styles.footerAmount}>{fmt(amountNum)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={canConfirm ? 0.85 : 1}
          disabled={!canConfirm || confirming}
        >
          {confirming || uploading ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={18} color={WHITE} />
              <Text style={styles.confirmBtnText}>
                Confirmar{" "}
                {reservationCodes.length > 1
                  ? `${reservationCodes.length} reservaciones`
                  : "reservación"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NEUTRAL_50 },

  // ── Top bar ──────────────────────────────────────────────────────────────────
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
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Scroll ───────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ── Summary card ─────────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 28,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: "rgba(255,255,255,0.60)",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // ── Section labels ───────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_400,
    marginBottom: 12,
    lineHeight: 18,
  },

  // ── Payment pills ─────────────────────────────────────────────────────────────
  pillGrid: { gap: 10, marginBottom: 28 },
  pillRow: { flexDirection: "row", gap: 10 },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 14,
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

  // ── Image picker ─────────────────────────────────────────────────────────────
  imagePickerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  imagePickerBtn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  imagePickerIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Image preview ─────────────────────────────────────────────────────────────
  previewContainer: {
    alignSelf: "center",
    width: 180,
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 14,
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  footerSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerSummaryText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  footerAmount: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  confirmBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: NEUTRAL_400,
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
