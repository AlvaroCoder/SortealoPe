import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../constants/theme";
import { storePickedImage } from "../../../lib/imageCropStore";

// --- Color constants ---
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_600 = Colors.principal.neutral[600];
const NEUTRAL_700 = Colors.principal.neutral[700];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";

// Sample images hosted on Cloudinary
const SAMPLE_IMAGES = [
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775154006/RIFA_1_krstjg.png",
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775155359/2_rxbt7n.png",
];

const SCREEN_WIDTH = Dimensions.get("window").width;
// 16:9 preview area height derived from full screen width
const PREVIEW_HEIGHT = Math.round(SCREEN_WIDTH * (9 / 16));
// Grid cell: 3 columns with 8px gaps, 16px padding each side
const GRID_SPACING = 8;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32 - GRID_SPACING * 2) / 3);

export default function SubirImagen() {
  const router = useRouter();
  const { currentImageUri } = useLocalSearchParams();

  // Determine if the incoming URI is a sample or a custom file
  const initialSampleIndex = (() => {
    if (!currentImageUri) return 0;
    const idx = SAMPLE_IMAGES.indexOf(currentImageUri);
    return idx >= 0 ? idx : -1; // -1 means custom was active
  })();

  const [selectedSample, setSelectedSample] = useState(
    initialSampleIndex >= 0 ? initialSampleIndex : 0,
  );
  // Pre-populate customUri if the incoming image was a custom pick (not a sample URL)
  const [customUri, setCustomUri] = useState(
    initialSampleIndex === -1 && currentImageUri ? currentImageUri : null,
  );

  // What shows in the full-width preview
  const previewSource = customUri
    ? { uri: customUri }
    : SAMPLE_IMAGES[selectedSample];

  const hasCustom = !!customUri;

  // ── Image picker helpers ──────────────────────────────────────────────────

  const pickFromGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para elegir una imagen.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setCustomUri(result.assets[0].uri);
    }
  }, []);

  const pickFromCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu cámara para tomar una foto.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setCustomUri(result.assets[0].uri);
    }
  }, []);

  const handleAddImagePress = useCallback(() => {
    Alert.alert("Elegir imagen", "¿De dónde quieres subir la imagen?", [
      { text: "Galería", onPress: pickFromGallery },
      { text: "Cámara", onPress: pickFromCamera },
      { text: "Cancelar", style: "cancel" },
    ]);
  }, [pickFromGallery, pickFromCamera]);

  // ── Confirm selection and navigate back ──────────────────────────────────

  const handleUse = useCallback(() => {
    const image = customUri
      ? // Local file — object compatible with FormData.append
        { uri: customUri, type: "image/jpeg", name: "banner.jpg" }
      : // Sample URL — plain string; create.jsx detects typeof === 'string'
        SAMPLE_IMAGES[selectedSample];

    storePickedImage(image);
    router.back();
  }, [customUri, selectedSample, router]);

  // ── Remove custom image ───────────────────────────────────────────────────

  const handleRemoveCustom = useCallback(() => {
    setCustomUri(null);
    setSelectedSample(0);
  }, []);

  // ── Select a sample ───────────────────────────────────────────────────────

  const handleSelectSample = useCallback((index) => {
    setSelectedSample(index);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* ── Custom header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerClose}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={22} color={GREEN_900} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Imagen del evento</Text>

        <TouchableOpacity
          style={styles.headerUseButton}
          onPress={handleUse}
          activeOpacity={0.75}
        >
          <Text style={styles.headerUseText}>Usar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 16:9 full-width preview ───────────────────────────────── */}
        <View style={[styles.previewWrapper, { height: PREVIEW_HEIGHT }]}>
          <Image
            source={previewSource}
            style={styles.previewImage}
            contentFit="cover"
            transition={200}
          />

          {/* Dimension badge overlay */}
          <View style={styles.dimBadge}>
            <Ionicons name="resize-outline" size={11} color={WHITE} />
            <Text style={styles.dimBadgeText}>1920 × 1080 px</Text>
          </View>
        </View>

        {/* ── Gallery section ───────────────────────────────────────── */}
        <View style={styles.gallerySection}>
          <Text style={styles.gallerySectionLabel}>Elige tu imagen</Text>

          {/* 3-column grid */}
          <View style={styles.gridRow}>
            {/* Cell 0: Add / pick button */}
            <TouchableOpacity
              style={[styles.gridCell, styles.addCell]}
              onPress={handleAddImagePress}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={28} color={GREEN_900} />
              <View style={styles.addBadge}>
                <Ionicons name="add" size={11} color={WHITE} />
              </View>
            </TouchableOpacity>

            {/* Cells 1 & 2: Sample images */}
            {SAMPLE_IMAGES.map((uri, index) => {
              const isSelected = !hasCustom && selectedSample === index;
              return (
                <TouchableOpacity
                  key={uri}
                  style={[
                    styles.gridCell,
                    isSelected && styles.gridCellSelected,
                  ]}
                  onPress={() => handleSelectSample(index)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={uri}
                    style={styles.gridCellImage}
                    contentFit="cover"
                    transition={150}
                  />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={GREEN_500}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom image row — visible only when a local image is picked */}
          {hasCustom && (
            <View style={styles.customRow}>
              <Image
                source={{ uri: customUri }}
                style={styles.customThumb}
                contentFit="cover"
                transition={150}
              />
              <View style={styles.customMeta}>
                <View style={styles.customCheckRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={GREEN_500}
                  />
                  <Text style={styles.customLabel}>Imagen personalizada</Text>
                </View>
                <Text style={styles.customSub}>Recortada 16:9</Text>
              </View>
              <TouchableOpacity
                style={styles.customTrash}
                onPress={handleRemoveCustom}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={19} color={RED_500} />
              </TouchableOpacity>
            </View>
          )}

          {/* Info box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={NEUTRAL_700}
            />
            <Text style={styles.infoText}>
              Las imágenes se recortan automáticamente a 1920 × 1080 px
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom CTA bar ─────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleUse}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-outline" size={20} color={WHITE} />
          <Text style={styles.ctaText}>Usar esta imagen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    backgroundColor: WHITE,
  },
  headerClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  headerUseButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: GREEN_900,
    borderRadius: 20,
  },
  headerUseText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Preview ───────────────────────────────────────────────────────────────
  previewWrapper: {
    width: SCREEN_WIDTH,
    backgroundColor: GREEN_900,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  dimBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dimBadgeText: {
    fontSize: Typography.sizes.xs,
    color: WHITE,
    fontWeight: Typography.weights.medium,
  },

  // ── Gallery section ───────────────────────────────────────────────────────
  gallerySection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  gallerySectionLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 12,
  },

  // ── Grid ──────────────────────────────────────────────────────────────────
  gridRow: {
    flexDirection: "row",
    gap: GRID_SPACING,
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: GREEN_50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  gridCellSelected: {
    borderColor: GREEN_500,
  },
  gridCellImage: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 1,
  },
  addCell: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: NEUTRAL_200,
    borderStyle: "dashed",
    backgroundColor: GREEN_50,
  },
  addBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: GREEN_500,
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Custom image row ──────────────────────────────────────────────────────
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 10,
    backgroundColor: GREEN_50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GREEN_100,
    gap: 10,
  },
  customThumb: {
    width: 64,
    height: 36, // 16:9
    borderRadius: 6,
    backgroundColor: NEUTRAL_200,
  },
  customMeta: {
    flex: 1,
  },
  customCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  customLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  customSub: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_600,
    marginTop: 2,
  },
  customTrash: {
    padding: 4,
  },

  // ── Info box ──────────────────────────────────────────────────────────────
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.principal.neutral[50],
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    flex: 1,
    lineHeight: 18,
  },

  // ── Bottom CTA bar ────────────────────────────────────────────────────────
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    backgroundColor: WHITE,
  },
  ctaButton: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
