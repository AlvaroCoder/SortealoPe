import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system/next";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { CreateCollection } from "../../../Connections/collections";
import { Colors, Typography } from "../../../constants/theme";
import ButtonGradiend from "../../common/Buttons/ButtonGradiendt";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// Deep link que el vendedor va a escanear: contiene el code de la colección
function buildInviteLink(code) {
  return `sortealope://vendedor/invitar?code=${encodeURIComponent(code)}`;
}

// ── Step 1: enter ticket quantity + call API ───────────────────────────────────
const Step1Content = ({ ticketQuantity, setTicketQuantity, eventId, onNext }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const qty = parseInt(ticketQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert(
        "Error",
        "Por favor ingresa una cantidad válida de tickets (mayor a cero).",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await CreateCollection({
        eventId: parseInt(eventId, 10),
        ticketsQuantity: qty,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo crear la colección.");
      }

      const data = await res.json();
      const code = data?.code;

      if (!code) {
        throw new Error("La API no devolvió el código de colección.");
      }

      onNext(code);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="ticket-outline" size={28} color={GREEN_900} />
      </View>
      <Text style={styles.modalTitle}>Asignación de Tickets</Text>
      <Text style={styles.modalSubtitle}>
        Ingresa cuántos tickets asignarás a este vendedor.
      </Text>

      <Text style={styles.inputLabel}>Cantidad de Tickets *</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        placeholder="Ej: 100"
        value={ticketQuantity}
        onChangeText={(t) => setTicketQuantity(t.replace(/[^0-9]/g, ""))}
        maxLength={5}
        placeholderTextColor={NEUTRAL_200}
        editable={!loading}
      />

      <ButtonGradiend
        onPress={handleContinue}
        style={[styles.continueButton, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? "Creando colección…" : "Generar QR"}
      </ButtonGradiend>

      {loading && (
        <ActivityIndicator
          size="small"
          color={GREEN_900}
          style={{ marginTop: 12 }}
        />
      )}
    </View>
  );
};

// ── Step 2: show QR + share ───────────────────────────────────────────────────
const Step2Content = ({ collectionCode, ticketQuantity, onClose }) => {
  const qrRef = useRef(null);
  const deepLink = buildInviteLink(collectionCode);
  const QR_SIZE = Dimensions.get("window").width * 0.55;

  const handleShare = () => {
    if (!qrRef.current) return;
    qrRef.current.toDataURL(async (base64) => {
      try {
        const file = new File(
          Paths.cache,
          `sortealo-vendor-qr-${Date.now()}.png`,
        );
        file.write(base64, { encoding: "base64" });
        await Share.share({
          message: `Invitación de vendedor — Sortealo\n${deepLink}`,
          url: file.uri,
        });
      } catch {
        Alert.alert("Error", "No se pudo compartir el QR.");
      }
    });
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="qr-code-outline" size={28} color={GREEN_900} />
      </View>
      <Text style={styles.modalTitle}>Código QR listo</Text>
      <Text style={styles.modalSubtitle}>
        {parseInt(ticketQuantity, 10).toLocaleString()} tickets asignados.{"\n"}
        Comparte el QR para que el vendedor se una.
      </Text>

      {/* QR */}
      <View style={styles.qrWrapper}>
        <QRCode
          value={deepLink}
          size={QR_SIZE}
          color={GREEN_900}
          backgroundColor={WHITE}
          getRef={(c) => {
            qrRef.current = c;
          }}
        />
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color={GREEN_900} />
          <Text style={styles.shareButtonText}>Compartir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function QRVendedorModal({
  visible,
  onClose,
  eventId,
  initialQuantity = "10",
}) {
  const [step, setStep] = useState(1);
  const [ticketQuantity, setTicketQuantity] = useState(initialQuantity);
  const [collectionCode, setCollectionCode] = useState(null);

  const handleClose = () => {
    setStep(1);
    setTicketQuantity(initialQuantity);
    setCollectionCode(null);
    onClose();
  };

  const handleNext = (code) => {
    setCollectionCode(code);
    setStep(2);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Close X */}
          <TouchableOpacity style={styles.closeX} onPress={handleClose}>
            <Ionicons name="close" size={20} color={NEUTRAL_500} />
          </TouchableOpacity>

          {step === 1 ? (
            <Step1Content
              ticketQuantity={ticketQuantity}
              setTicketQuantity={setTicketQuantity}
              eventId={eventId}
              onNext={handleNext}
            />
          ) : (
            <Step2Content
              collectionCode={collectionCode}
              ticketQuantity={ticketQuantity}
              onClose={handleClose}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
  },
  closeX: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },

  // Step 1
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderRadius: 14,
    padding: 15,
    fontSize: Typography.sizes.xl,
    color: GREEN_900,
    backgroundColor: WHITE,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: Typography.weights.bold,
  },
  continueButton: {
    width: "100%",
  },

  // Step 2
  qrWrapper: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    backgroundColor: WHITE,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.principal.green[100],
  },
  codeText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    fontWeight: Typography.weights.semibold,
    fontFamily: "monospace",
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN_50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.principal.green[100],
  },
  linkText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: GREEN_900,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GREEN_900,
  },
  shareButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  closeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: RED_500,
  },
  closeButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
});
