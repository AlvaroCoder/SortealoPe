import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerInput from "../../../../components/common/Buttons/ButtonDatePicker";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import {
  UpdateEvent,
  UpdateEventTickets,
} from "../../../../Connections/events";
import { UploadImage } from "../../../../Connections/images";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

export default function AdminEditEventPage() {
  const router = useRouter();
  const { id: eventId, eventStatus } = useLocalSearchParams();

  const { data, loading: loadingData } = useFetch(
    `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=${eventStatus ?? 2}`,
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ticketPrice: "",
    place: "",
    date: new Date(),
    image: "",
  });
  const [initialized, setInitialized] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [additionalTickets, setAdditionalTickets] = useState("");

  const originalData = useRef(null);

  useEffect(() => {
    if (data && !initialized) {
      setFormData({
        title: data.title ?? "",
        description: data.description ?? "",
        ticketPrice: String(data.ticketPrice ?? ""),
        place: data.place ?? "",
        date: data.date ? new Date(data.date) : new Date(),
        image: data.image ?? "",
      });
      originalData.current = data;
      setInitialized(true);
    }
  }, [data, initialized]);

  const updateForm = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handlePickBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      updateForm("image", {
        uri: asset.uri,
        type: asset.mimeType ?? "image/jpeg",
        name: asset.fileName ?? "banner.jpg",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.ticketPrice) {
      Alert.alert("Error", "El título y el precio son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const changedFields = {};

      // Image: upload if a new local file was selected
      if (formData.image && typeof formData.image !== "string") {
        const multipart = new FormData();
        multipart.append("file", formData.image);
        const uploadRes = await UploadImage(multipart);
        if (!uploadRes.ok) {
          Alert.alert("Error", "No se pudo subir la imagen.");
          setLoading(false);
          return;
        }
        const uploadJson = await uploadRes.json();
        if (uploadJson?.url) changedFields.image = uploadJson.url;
      }

      // Diff the rest of editable fields
      const original = originalData.current ?? {};
      const EDITABLE = ["title", "description", "ticketPrice", "date", "place"];
      for (const key of EDITABLE) {
        const prev = original[key];
        const next = formData[key];
        if (key === "date") {
          const prevTime = prev ? new Date(prev).getTime() : null;
          const nextTime = next ? new Date(next).getTime() : null;
          if (prevTime !== nextTime) {
            changedFields[key] =
              next instanceof Date ? next.toISOString() : next;
          }
        } else {
          const prevStr = String(prev ?? "");
          const nextStr = String(next ?? "");
          if (prevStr !== nextStr) {
            changedFields[key] =
              key === "ticketPrice" ? parseFloat(next) : next;
          }
        }
      }

      if (Object.keys(changedFields).length === 0) {
        Alert.alert("Sin cambios", "No has modificado ningún campo.");
        setLoading(false);
        return;
      }

      const response = await UpdateEvent(eventId, changedFields);
      if (!response.ok) {
        Alert.alert("Error", "No se pudo guardar el evento.");
        setLoading(false);
        return;
      }

      Alert.alert(
        "Guardado",
        `El evento "${formData.title}" fue actualizado correctamente.`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleAumentarTickets = async () => {
    const qty = Number(additionalTickets);
    if (!qty || qty <= 0 || !Number.isInteger(qty)) {
      Alert.alert("Error", "Ingresa una cantidad válida de tickets.");
      return;
    }
    setShowTicketsModal(false);
    setAdditionalTickets("");
    setLoading(true);
    try {
      const response = await UpdateEventTickets(eventId, {
        ticketsPerCollection: qty,
      });
      if (response.ok) {
        Alert.alert("Éxito", `Se añadieron ${qty} tickets al evento.`);
      } else {
        Alert.alert("Error", "No se pudieron aumentar los tickets.");
      }
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData && !initialized) return <LoadingScreen />;

  const bannerPreview =
    typeof formData.image === "string"
      ? formData.image || null
      : (formData.image?.uri ?? null);

  const totalTickets = (data?.collections ?? []).reduce(
    (s, c) =>
      s +
      (c.soldTickets ?? 0) +
      (c.availableTickets ?? 0) +
      (c.reservedTickets ?? 0),
    0,
  );

  const statusCfg =
    Number(eventStatus) === 2
      ? { label: "ACTIVO", color: GREEN_500 }
      : Number(eventStatus) === 3
        ? { label: "SORTEADO", color: "#F59E0B" }
        : { label: "EN ESPERA", color: NEUTRAL_400 };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {loading && <LoadingScreen />}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Editar Sorteo</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.bannerWrap}
            activeOpacity={0.9}
            onPress={handlePickBanner}
          >
            {bannerPreview ? (
              <Image
                source={{ uri: bannerPreview }}
                style={styles.bannerImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.bannerPlaceholder}>
                <Ionicons name="image-outline" size={40} color={NEUTRAL_400} />
              </View>
            )}
            <View style={styles.bannerOverlay}>
              <Ionicons name="camera-outline" size={18} color={WHITE} />
              <Text style={styles.bannerOverlayText}>CAMBIAR BANNER</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Información General</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Título del Sorteo</Text>
            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={(t) => updateForm("title", t)}
              placeholder="Ej: Gran Sorteo de Navidad"
              placeholderTextColor={NEUTRAL_400}
              returnKeyType="next"
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Descripción del Evento
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(t) => updateForm("description", t)}
              placeholder="Explica las reglas, premios y condiciones del sorteo..."
              placeholderTextColor={NEUTRAL_400}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Configuración del Sorteo</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Fecha del Sorteo</Text>
            <DatePickerInput
              value={formData.date ? new Date(formData.date) : new Date()}
              onChange={(date) => updateForm("date", date)}
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Precio por Ticket
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceCurrency}>S/.</Text>
              <TextInput
                style={[styles.textInput, styles.priceInput]}
                value={formData.ticketPrice}
                onChangeText={(t) =>
                  updateForm("ticketPrice", t.replace(/[^0-9.]/g, ""))
                }
                placeholder="0.00"
                placeholderTextColor={NEUTRAL_400}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Lugar del Evento
            </Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={NEUTRAL_500}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={formData.place}
                onChangeText={(t) => updateForm("place", t)}
                placeholder="Ciudad, Estado o 'Virtual'"
                placeholderTextColor={NEUTRAL_400}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Capacidad y Paquete</Text>
          </View>
          <View style={styles.capacityCard}>
            <View style={styles.capacityCircle} />
            <Text style={styles.capacityLabel}>TICKETS MAXIMOS: </Text>
            <View style={styles.capacityCountRow}>
              <Text style={styles.capacityCount}>{totalTickets}</Text>
              <Text style={styles.capacityUnit}> tickets</Text>
            </View>
            <View style={styles.statusRow}>
              <View
                style={[styles.statusDot, { backgroundColor: statusCfg.color }]}
              />
              <Text style={styles.statusText}>ESTADO: {statusCfg.label}</Text>
            </View>
            <TouchableOpacity
              style={styles.aumentarBtn}
              onPress={() => setShowTicketsModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={20} color={GREEN_900} />
              <Text style={styles.aumentarBtnText}>Aumentar Tickets</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showTicketsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTicketsModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowTicketsModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Aumentar Tickets</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa la cantidad de tickets adicionales a agregar al evento.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={additionalTickets}
              onChangeText={setAdditionalTickets}
              placeholder="Ej: 100"
              placeholderTextColor={NEUTRAL_400}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setShowTicketsModal(false);
                  setAdditionalTickets("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleAumentarTickets}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  saveBtn: {
    backgroundColor: GREEN_500,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  bannerWrap: {
    height: 200,
    backgroundColor: NEUTRAL_200,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NEUTRAL_100,
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 12,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerOverlayText: {
    fontSize: 12,
    fontWeight: "800",
    color: WHITE,
    letterSpacing: 0.5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: GREEN_500,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  // ── Field labels + inputs ──────────────────────────────────────────────────
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: Typography.sizes.base,
    color: GREEN_900,
    backgroundColor: "#EBF4FF",
  },
  textArea: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceCurrency: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  priceInput: {
    flex: 1,
    fontWeight: Typography.weights.bold,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ── Capacity card ──────────────────────────────────────────────────────────
  capacityCard: {
    backgroundColor: GREEN_900,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  capacityCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: GREEN_700,
    opacity: 0.2,
    top: -70,
    right: -50,
  },
  capacityLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.60)",
    marginBottom: 6,
  },
  capacityCountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  capacityCount: {
    fontSize: 36,
    fontWeight: "800",
    color: WHITE,
  },
  capacityUnit: {
    fontSize: 16,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: 0.6,
  },
  aumentarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_500,
    borderRadius: 14,
    paddingVertical: 14,
  },
  aumentarBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // ── Cancelar ───────────────────────────────────────────────────────────────
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 20,
    backgroundColor: "#EBF4FF",
    textAlign: "center",
  },
  modalBtns: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: GREEN_900,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
});
