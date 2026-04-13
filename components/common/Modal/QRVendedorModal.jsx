import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { CreateCollection } from "../../../Connections/collections";
import { Colors, Typography } from "../../../constants/theme";
import ButtonGradiend from "../Buttons/ButtonGradiendt";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const SCREEN_W = Dimensions.get("window").width;
const CARD_W = SCREEN_W - 56;
const QR_SIZE = CARD_W * 0.58;

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

// Deep link que el vendedor va a escanear: contiene el code de la colección
function buildInviteLink(code) {
  return `sortealope://vendedor/invitar?code=${encodeURIComponent(code)}`;
}

// ── Step 1: enter ticket quantity + call API ───────────────────────────────────
const Step1Content = ({
  ticketQuantity,
  setTicketQuantity,
  eventId,
  onNext,
}) => {
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

// ── Step 2: show branded QR + share ──────────────────────────────────────────
const Step2Content = ({ collectionCode, ticketQuantity, onClose }) => {
  const viewShotRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const deepLink = buildInviteLink(collectionCode);

  const handleShare = async () => {
    if (!deepLink || !viewShotRef.current) return;
    try {
      setSharing(true);
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Compartir QR de vendedor",
      });
    } catch (_err) {
      // sharing cancelled or failed
    } finally {
      setSharing(false);
    }
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

      {/* ── Branded QR card (captured by ViewShot) ── */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={styles.brandedCard}
      >
        <View style={styles.brandedCardInner} collapsable={false}>
          {/* Header: mascot + brand */}
          <View style={styles.brandHeader}>
            <Image
              source={{ uri: MASCOT_URI }}
              style={styles.mascot}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <Text style={styles.brandName}>RIFALOPE</Text>
            <Text style={styles.brandTagline}>Invitación de Vendedor</Text>
          </View>

          {/* QR on white card */}
          <View style={styles.qrInnerCard}>
            <QRCode
              value={deepLink}
              size={QR_SIZE}
              color={GREEN_900}
              backgroundColor={WHITE}
              quietZone={10}
            />
          </View>

          {/* Footer info */}
          <Text style={styles.cardTicketCount}>
            {parseInt(ticketQuantity, 10).toLocaleString()} tickets asignados
          </Text>
          <Text style={styles.cardScanHint}>
            Escanea con la app RIFALOPE
          </Text>

          {/* Bottom stripe */}
          <View style={styles.cardStripe} />
        </View>
      </ViewShot>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.shareButton, sharing && { opacity: 0.6 }]}
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.8}
      >
        {sharing ? (
          <ActivityIndicator size="small" color={WHITE} />
        ) : (
          <>
            <Ionicons name="share-outline" size={18} color={WHITE} />
            <Text style={styles.shareButtonText}>Compartir QR</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>
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

  // ── Branded card (ViewShot target) ──────────────────────────────────────────
  brandedCard: {
    width: CARD_W,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  brandedCardInner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  mascot: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  brandName: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
    letterSpacing: 3,
  },
  brandTagline: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  qrInnerCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTicketCount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
    marginBottom: 4,
  },
  cardScanHint: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  cardStripe: {
    width: "100%",
    height: 6,
    backgroundColor: GREEN_500,
  },

  // ── Buttons ──────────────────────────────────────────────────────────────────
  shareButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_500,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: GREEN_500,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  shareButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
  closeButton: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
  },
});
