import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";
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
import { ConfirmCollection } from "../../../../Connections/collections";
import { Colors, Typography } from "../../../../constants/theme";

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

// ── Corner bracket ────────────────────────────────────────────────────────────
function Corner({ position }) {
  const isTop = position.includes("T");
  const isLeft = position.includes("L");
  return (
    <>
      {/* Horizontal bar */}
      <View
        style={[
          styles.cornerBar,
          styles.cornerBarH,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      {/* Vertical bar */}
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

export default function PageScanQR() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [status, setStatus] = useState("waiting"); // waiting | success | error
  const [scannedData, setScannedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  // Animated scan line
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
  }, []);

  const scanLineY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_SIZE - 2],
  });

  const handleScanned = ({ data }) => {
    if (!scanning) return;
    setScanning(false);

    if (data?.startsWith("sortealope://vendedor/invitar")) {
      try {
        const url = new URL(data);
        const code = url.searchParams.get("code");
        if (!code) throw new Error("Sin código");
        setScannedData({ code });
        setStatus("success");
      } catch {
        setStatus("error");
        scheduleReset();
      }
    } else {
      setStatus("error");
      scheduleReset();
    }
  };

  const scheduleReset = () => {
    setTimeout(() => {
      setStatus("waiting");
      setScanning(true);
    }, 2200);
  };

  const handleReset = () => {
    setScannedData(null);
    setStatus("waiting");
    setScanning(true);
  };

  const handleAccept = async () => {
    if (!scannedData?.code) return;
    setSubmitting(true);
    try {
      const res = await ConfirmCollection(scannedData.code);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo aceptar la invitación.");
      }
      router.replace("/(app)/(drawer)/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Permission screens ───────────────────────────────────────────────────
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
            Necesitamos acceso a tu cámara para escanear los códigos QR de
            invitación.
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

  // ── Frame border color ───────────────────────────────────────────────────
  const frameColor =
    status === "success"
      ? GREEN_500
      : status === "error"
        ? RED_500
        : WHITE;

  return (
    <View style={styles.root}>
      {/* Camera feed */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScanningSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanning ? handleScanned : undefined}
      />

      {/* Cutout overlay — 4 dark rectangles around the scan frame */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        {/* Top */}
        <View style={[styles.overlay, { height: SCREEN_HEIGHT * 0.28 }]} />
        {/* Middle row */}
        <View style={{ flexDirection: "row", height: SCAN_SIZE }}>
          <View style={[styles.overlay, { flex: 1 }]} />
          {/* Scan frame — transparent center */}
          <View style={{ width: SCAN_SIZE }} />
          <View style={[styles.overlay, { flex: 1 }]} />
        </View>
        {/* Bottom */}
        <View style={[styles.overlay, { flex: 1 }]} />
      </View>

      {/* ── Top instruction ───────────────────────────── */}
      <View style={[styles.topInfo, { paddingTop: topInset + 16 }]}>
        <Text style={styles.topTitle}>Escanear QR</Text>
        <Text style={styles.topSubtitle}>
          Enfoca el código de invitación del vendedor
        </Text>
      </View>

      {/* ── Scan frame (absolutely centered) ─────────── */}
      <View style={styles.frameWrapper} pointerEvents="none">
        {/* Dashed border frame */}
        <View style={[styles.frame, { borderColor: frameColor }]}>
          {/* Animated scan line */}
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

        {/* Corner brackets */}
        <View style={StyleSheet.absoluteFill}>
          <Corner position="TL" />
          <Corner position="TR" />
          <Corner position="BL" />
          <Corner position="BR" />
        </View>
      </View>

      {/* ── Status label ──────────────────────────────── */}
      <View style={styles.statusRow} pointerEvents="none">
        <View
          style={[
            styles.statusPill,
            status === "success" && styles.statusPillSuccess,
            status === "error" && styles.statusPillError,
          ]}
        >
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
          <Text
            style={[
              styles.statusText,
              status === "success" && { color: GREEN_500 },
              status === "error" && { color: RED_500 },
            ]}
          >
            {status === "success"
              ? "Código detectado"
              : status === "error"
                ? "Código no válido"
                : "Buscando código QR…"}
          </Text>
        </View>
      </View>

      {/* ── Result bottom sheet ───────────────────────── */}
      {scannedData && (
        <View style={[styles.sheet, { paddingBottom: bottomInset + 12 }]}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          <View style={styles.sheetIconRow}>
            <View style={styles.sheetIconBox}>
              <Ionicons name="person-add-outline" size={26} color={GREEN_900} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Invitación detectada</Text>
              <Text style={styles.sheetSub}>Vendedor listo para asignar</Text>
            </View>
          </View>

          <View style={[styles.sheetRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.sheetRowLabel}>Código de colección</Text>
            <Text
              style={[styles.sheetRowValue, { fontFamily: "monospace", flex: 1, textAlign: "right" }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {scannedData.code}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.assignBtn, submitting && { opacity: 0.7 }]}
            activeOpacity={0.85}
            onPress={handleAccept}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : null}
            <Text style={styles.assignBtnText}>
              {submitting ? "Procesando…" : "Aceptar invitación"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Escanear otro código</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

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
  cornerBarH: {
    width: CORNER_SIZE,
    height: CORNER_THICKNESS,
  },
  cornerBarV: {
    width: CORNER_THICKNESS,
    height: CORNER_SIZE,
  },

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

  // ── Result sheet ──────────────────────────────────────────────────────────
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    zIndex: 20,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.principal.neutral[200],
    marginBottom: 20,
  },
  sheetIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  sheetIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.principal.green[50],
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 2,
  },
  sheetSub: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
  },
  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.principal.neutral[100],
  },
  sheetRowLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },
  sheetRowValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  assignBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  assignBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resetBtnText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
    fontWeight: Typography.weights.medium,
  },

  // ── Permission screen ─────────────────────────────────────────────────────
  centered: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionCard: {
    alignItems: "center",
    width: "100%",
  },
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
  permissionText: {
    color: NEUTRAL_700,
    fontSize: Typography.sizes.base,
  },
});
