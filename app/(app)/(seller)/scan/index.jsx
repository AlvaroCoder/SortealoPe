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
import { ConfirmCollection } from "../../../../Connections/collections";
import { Colors, Typography } from "../../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Scan frame: wide rectangle
const FRAME_W = SCREEN_W * 0.78;
const FRAME_H = FRAME_W * 0.72;
const FRAME_LEFT = (SCREEN_W - FRAME_W) / 2;
const FRAME_TOP = SCREEN_H * 0.22;

// Corner bracket dimensions
const BRACKET_LEN = 34;
const BRACKET_THICK = 4;
const BRACKET_RADIUS = 8;

// ── Corner bracket ────────────────────────────────────────────────────────────
function Corner({ top, left, right, bottom }) {
  return (
    <>
      {/* Horizontal bar */}
      <View
        style={[
          styles.bracket,
          { width: BRACKET_LEN, height: BRACKET_THICK },
          top !== undefined && { top },
          bottom !== undefined && { bottom },
          left !== undefined && {
            left,
            borderTopLeftRadius: top !== undefined ? BRACKET_RADIUS : 0,
            borderBottomLeftRadius: bottom !== undefined ? BRACKET_RADIUS : 0,
          },
          right !== undefined && {
            right,
            borderTopRightRadius: top !== undefined ? BRACKET_RADIUS : 0,
            borderBottomRightRadius: bottom !== undefined ? BRACKET_RADIUS : 0,
          },
        ]}
      />
      {/* Vertical bar */}
      <View
        style={[
          styles.bracket,
          { width: BRACKET_THICK, height: BRACKET_LEN },
          top !== undefined && { top },
          bottom !== undefined && { bottom },
          left !== undefined && {
            left,
            borderTopLeftRadius: top !== undefined ? BRACKET_RADIUS : 0,
            borderBottomLeftRadius: bottom !== undefined ? BRACKET_RADIUS : 0,
          },
          right !== undefined && {
            right,
            borderTopRightRadius: top !== undefined ? BRACKET_RADIUS : 0,
            borderBottomRightRadius: bottom !== undefined ? BRACKET_RADIUS : 0,
          },
        ]}
      />
    </>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SellerScanQR() {
  const router = useRouter();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  // status: "waiting" | "success" | "error"
  const [status, setStatus] = useState("waiting");
  const [scannedData, setScannedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Animated scan line ──────────────────────────────────────────────────────
  const scanLine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine]);

  const scanLineY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_H - 2],
  });

  // ── Scan logic ──────────────────────────────────────────────────────────────
  const scheduleReset = () => {
    setTimeout(() => {
      setStatus("waiting");
      setScanning(true);
    }, 2400);
  };

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
      router.replace("/(app)/(seller)");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Permission screens ──────────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={[styles.permissionRoot, { paddingTop: topInset }]}>
        <ActivityIndicator size="large" color={GREEN_900} />
        <Text style={styles.permissionHint}>Iniciando cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionRoot, { paddingTop: topInset }]}>
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

  // ── Status card content ─────────────────────────────────────────────────────
  const isSuccess = status === "success";
  const isError = status === "error";

  const cardIconName = isSuccess
    ? "checkmark-circle"
    : isError
      ? "close-circle"
      : "qr-code-outline";
  const cardIconColor = isSuccess ? GREEN_500 : isError ? RED_500 : GREEN_500;
  const cardTitle = isSuccess
    ? "¡Código detectado!"
    : isError
      ? "QR no válido"
      : "Buscando código...";
  const cardSubtitle = isSuccess
    ? "Acepta la invitación abajo"
    : isError
      ? "El QR escaneado no es de invitación."
      : "Alinea el QR de invitación con el visor";

  const frameColor = isSuccess ? GREEN_500 : isError ? RED_500 : GREEN_500;

  return (
    <View style={styles.root}>
      {/* Camera fill */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchOn}
        barcodeScanningSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanning ? handleScanned : undefined}
      />

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: topInset + 10 }]}>
        <TouchableOpacity
          style={styles.topIconBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={22} color={GREEN_500} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Escanear Invitación</Text>

        <TouchableOpacity
          style={[styles.topIconBtn, torchOn && styles.topIconBtnActive]}
          onPress={() => setTorchOn((v) => !v)}
        >
          <Ionicons
            name="flashlight-outline"
            size={20}
            color={torchOn ? GREEN_900 : GREEN_500}
          />
        </TouchableOpacity>
      </View>

      {/* ── Scan frame ────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.frame,
          {
            top: FRAME_TOP,
            left: FRAME_LEFT,
            width: FRAME_W,
            height: FRAME_H,
          },
        ]}
        pointerEvents="none"
      >
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

        {/* Corner brackets */}
        <Corner top={0} left={0} />
        <Corner top={0} right={0} />
        <Corner bottom={0} left={0} />
        <Corner bottom={0} right={0} />
      </View>

      {/* ── Instruction text ──────────────────────────────────────────────── */}
      <View
        style={[styles.instructions, { top: FRAME_TOP + FRAME_H + 28 }]}
        pointerEvents="none"
      >
        <Text style={styles.instructionTitle}>
          Apunta el código QR de{"\n"}invitación del vendedor
        </Text>
        <View style={styles.instructionHintRow}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="rgba(255,255,255,0.65)"
          />
          <Text style={styles.instructionHint}>
            Asegúrate de tener buena iluminación
          </Text>
        </View>
      </View>

      {/* ── Status card ───────────────────────────────────────────────────── */}
      {!scannedData && (
        <View style={[styles.statusCard, { bottom: bottomInset + 20 }]}>
          <View style={styles.statusIconWrap}>
            <Ionicons name={cardIconName} size={26} color={cardIconColor} />
          </View>
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>{cardTitle}</Text>
            <Text style={styles.statusSubtitle}>{cardSubtitle}</Text>
          </View>
        </View>
      )}

      {/* ── Result bottom sheet ───────────────────────────────────────────── */}
      {scannedData && (
        <View style={[styles.sheet, { paddingBottom: bottomInset + 12 }]}>
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

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  // ── Top bar ─────────────────────────────────────────────────────────────────
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    zIndex: 20,
  },
  topIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  topIconBtnActive: {
    backgroundColor: GREEN_50,
  },
  topTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
  },

  // ── Frame ───────────────────────────────────────────────────────────────────
  frame: {
    position: "absolute",
    borderWidth: 0,
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 2,
    opacity: 0.75,
  },
  bracket: {
    position: "absolute",
    backgroundColor: GREEN_500,
  },

  // ── Instruction ─────────────────────────────────────────────────────────────
  instructions: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 40,
    zIndex: 10,
  },
  instructionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 10,
  },
  instructionHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  instructionHint: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
  },

  // ── Status card ─────────────────────────────────────────────────────────────
  statusCard: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_900,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 16,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.65)",
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
    backgroundColor: GREEN_50,
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

  // ── Permission ──────────────────────────────────────────────────────────────
  permissionRoot: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionHint: {
    marginTop: 14,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
  },
  permissionCard: {
    alignItems: "center",
    width: "100%",
  },
  permissionIconBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: GREEN_50,
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
});
