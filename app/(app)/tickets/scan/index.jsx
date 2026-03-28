import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookTickets } from "../../../../Connections/tickets";
import { Colors, Typography } from "../../../../constants/theme";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_700 = Colors.principal.neutral[700];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCAN_SIZE = SCREEN_WIDTH * 0.68;
const CORNER_SIZE = 28;
const CORNER_THICKNESS = 4;
const OVERLAY = "rgba(0,0,0,0.62)";

// ─── Extrae el reservationCode de cualquier formato de URL válido ──────────────
// Soporta:
//   sortealope://tickets/claim?reservationCode=UUID  (producción)
//   exp://IP:port/--/tickets/claim?reservationCode=UUID  (Expo Go)
function extractReservationCode(data) {
  if (!data) return null;
  try {
    const url = new URL(data);
    return url.searchParams.get("reservationCode") ?? null;
  } catch {
    // No es una URL válida
    return null;
  }
}

// ─── Corner bracket ────────────────────────────────────────────────────────────
function Corner({ position }) {
  const isTop = position.includes("T");
  const isLeft = position.includes("L");
  return (
    <>
      <View
        style={[
          styles.cornerBar,
          styles.cornerBarH,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          styles.cornerBar,
          styles.cornerBarV,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
    </>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function BuyerScanQR() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [status, setStatus] = useState("waiting"); // waiting | success | error | loading
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  // ── Animated scan line ─────────────────────────────────────────────────────
  const scanLine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine]);

  const scanLineY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_SIZE - 2],
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const scheduleReset = () => {
    setTimeout(() => {
      setStatus("waiting");
      setScanning(true);
    }, 2200);
  };

  const handleScanned = ({ data }) => {
    if (!scanning) return;
    setScanning(false);

    const reservationCode = extractReservationCode(data);
    if (reservationCode) {
      setStatus("loading");
      handleBookTickets(reservationCode);
    } else {
      setStatus("error");
      scheduleReset();
    }
  };

  const handleBookTickets = async (reservationCode) => {
    try {
      const res = await BookTickets(reservationCode);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo confirmar la compra.");
      }
      setStatus("success");
      // Navegar a la pantalla de confirmación del ticket
      router.push({
        pathname: "/(app)/tickets/claim",
        params: { reservationCode },
      });
    } catch (err) {
      setStatus("error");
      Alert.alert("Error al confirmar", err.message, [
        {
          text: "Intentar de nuevo",
          onPress: () => {
            setStatus("waiting");
            setScanning(true);
          },
        },
      ]);
    }
  };

  // ── Permission screens ─────────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Iniciando cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconBox}>
            <Ionicons name="camera-outline" size={40} color={GREEN_900} />
          </View>
          <Text style={styles.permissionTitle}>Acceso a la cámara</Text>
          <Text style={styles.permissionDesc}>
            Necesitamos acceso a tu cámara para escanear el QR de tu ticket.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.permissionBtnText}>Permitir acceso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Frame border color by status ───────────────────────────────────────────
  const frameColor =
    status === "success" || status === "loading"
      ? GREEN_500
      : status === "error"
        ? RED_500
        : WHITE;

  const statusLabel =
    status === "loading"
      ? "Confirmando compra…"
      : status === "success"
        ? "¡Ticket confirmado!"
        : status === "error"
          ? "QR no válido"
          : "Apunta al QR del vendedor";

  return (
    <View style={styles.root}>
      {/* Camera feed */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScanningSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanning ? handleScanned : undefined}
      />

      {/* Cutout overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Top */}
        <View style={[styles.overlay, { height: SCREEN_HEIGHT * 0.28 }]} />
        {/* Middle row */}
        <View style={{ flexDirection: "row", height: SCAN_SIZE }}>
          <View style={[styles.overlay, { flex: 1 }]} />
          {/* Transparent scan area */}
          <View style={{ width: SCAN_SIZE }} />
          <View style={[styles.overlay, { flex: 1 }]} />
        </View>
        {/* Bottom */}
        <View style={[styles.overlay, { flex: 1 }]} />
      </View>

      {/* ── Top instruction ─────────────────────────────────────── */}
      <View style={[styles.topInfo, { paddingTop: topInset + 16 }]}>
        <Text style={styles.topTitle}>Escanear ticket</Text>
        <Text style={styles.topSubtitle}>
          Escanea el QR que te mostró el vendedor para recibir tus tickets
        </Text>
      </View>

      {/* ── Scan frame ──────────────────────────────────────────── */}
      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={[styles.frame, { borderColor: frameColor }]}>
          <Animated.View
            style={[
              styles.scanLine,
              {
                backgroundColor: frameColor,
                transform: [{ translateY: scanLineY }],
              },
            ]}
          />
        </View>
        <View style={StyleSheet.absoluteFill}>
          <Corner position="TL" />
          <Corner position="TR" />
          <Corner position="BL" />
          <Corner position="BR" />
        </View>
      </View>

      {/* ── Status pill ─────────────────────────────────────────── */}
      <View style={styles.statusRow} pointerEvents="none">
        <View
          style={[
            styles.statusPill,
            (status === "success" || status === "loading") &&
              styles.statusPillSuccess,
            status === "error" && styles.statusPillError,
          ]}
        >
          {status === "loading" ? (
            <ActivityIndicator size="small" color={GREEN_500} />
          ) : (
            <Ionicons
              name={
                status === "success"
                  ? "checkmark-circle"
                  : status === "error"
                    ? "close-circle"
                    : "scan-outline"
              }
              size={15}
              color={
                status === "success"
                  ? GREEN_500
                  : status === "error"
                    ? RED_500
                    : NEUTRAL_400
              }
            />
          )}
          <Text
            style={[
              styles.statusText,
              (status === "success" || status === "loading") && {
                color: GREEN_500,
              },
              status === "error" && { color: RED_500 },
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* ── Bottom hint ─────────────────────────────────────────── */}
      <View
        style={[styles.bottomHint, { paddingBottom: bottomInset + 24 }]}
        pointerEvents="none"
      >
        <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.6)" />
        <Text style={styles.bottomHintText}>
          Solicita al vendedor que te muestre el QR en su pantalla
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  overlay: { backgroundColor: OVERLAY },

  // ── Top info ──────────────────────────────────────────────────────────────
  topInfo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  topTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 6,
  },
  topSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },

  // ── Scan frame ────────────────────────────────────────────────────────────
  frameWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.28,
    left: (SCREEN_WIDTH - SCAN_SIZE) / 2,
    width: SCAN_SIZE,
    height: SCAN_SIZE,
  },
  frame: {
    width: "100%",
    height: "100%",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 4,
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.85,
  },

  // Corner brackets
  cornerBar: {
    position: "absolute",
    backgroundColor: WHITE,
    borderRadius: 2,
  },
  cornerBarH: { width: CORNER_SIZE, height: CORNER_THICKNESS },
  cornerBarV: { width: CORNER_THICKNESS, height: CORNER_SIZE },

  // ── Status pill ───────────────────────────────────────────────────────────
  statusRow: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.28 + SCAN_SIZE + 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  statusPillSuccess: { borderColor: GREEN_500 },
  statusPillError: { borderColor: RED_500 },
  statusText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: "rgba(255,255,255,0.8)",
  },

  // ── Bottom hint ───────────────────────────────────────────────────────────
  bottomHint: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 32,
    paddingTop: 16,
    zIndex: 10,
  },
  bottomHintText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    flex: 1,
  },

  // ── Permission screen ─────────────────────────────────────────────────────
  centered: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionCard: { alignItems: "center", width: "100%" },
  permissionIconBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: Colors.principal.green[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 10,
  },
  permissionDesc: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  permissionBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  permissionText: { color: NEUTRAL_700, fontSize: Typography.sizes.base },
});
