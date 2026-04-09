import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../constants/theme";
import { storePickedImage } from "../../../lib/imageCropStore";

const { width: SCREEN_W } = Dimensions.get("window");
const PREVIEW_H = Math.round((SCREEN_W * 9) / 16);

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_200 = Colors.principal.green[200];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

// Imágenes de muestra (Cloudinary)
const SAMPLE_IMAGES = [
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775154006/RIFA_1_krstjg.png",
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775155359/2_rxbt7n.png",
];

export default function SubirImagen() {
  const router = useRouter();
  const { currentImageUri } = useLocalSearchParams();

  // Restores prior selection when re-entering the screen
  const [selected, setSelected] = useState(
    currentImageUri ? currentImageUri : null,
  );

  // ── Pickers ───────────────────────────────────────────────────────────────
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setSelected({ uri: asset.uri, type: "image/jpeg", name: "banner.jpg" });
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setSelected({ uri: asset.uri, type: "image/jpeg", name: "banner.jpg" });
    }
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleUse = () => {
    if (!selected) return;
    storePickedImage(selected);
    router.back();
  };

  // Resolve preview URI from either a local object or a string URL
  const displayUri =
    selected?.uri ?? (typeof selected === "string" ? selected : null);

  const isSample = (url) => selected === url;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Imagen del evento</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── 16:9 Preview ── */}
        <View style={[styles.preview, { height: PREVIEW_H }]}>
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.previewEmpty}>
              <Ionicons name="image-outline" size={52} color={NEUTRAL_200} />
              <Text style={styles.previewEmptyText}>
                Selecciona una imagen abajo
              </Text>
            </View>
          )}

          {/* Selected indicator overlay */}
          {displayUri && (
            <View style={styles.previewBadge}>
              <Ionicons name="checkmark-circle" size={14} color={WHITE} />
              <Text style={styles.previewBadgeText}>Vista previa</Text>
            </View>
          )}
        </View>

        {/* ── Option grid ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona una imagen</Text>

          {/* 3-column row: [galería / cámara] | [muestra 1] | [muestra 2] */}
          <View style={styles.pickerColumn}>
            <TouchableOpacity
              style={[styles.pickerCell, styles.pickerCellLight]}
              onPress={openGallery}
              activeOpacity={0.75}
            >
              <Ionicons name="images-outline" size={26} color={GREEN_900} />
              <Text style={[styles.pickerCellText, { color: GREEN_900 }]}>
                Galería
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pickerCell, styles.pickerCellDark]}
              onPress={openCamera}
              activeOpacity={0.75}
            >
              <Ionicons name="camera-outline" size={26} color={WHITE} />
              <Text style={[styles.pickerCellText, { color: WHITE }]}>
                Cámara
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: Typography.sizes.sm,
              fontWeight: Typography.weights.bold,
              color: GREEN_900,
              marginTop: 20,
            }}
          >
            Puedes escoger una imagen por defecto
          </Text>
          <View style={styles.grid}>
            {SAMPLE_IMAGES.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sampleCell,
                  isSample(url) && styles.sampleCellActive,
                ]}
                onPress={() => setSelected(url)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: url }}
                  style={styles.sampleImage}
                  contentFit="cover"
                  transition={150}
                />

                {isSample(url) && (
                  <View style={styles.sampleCheckBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={GREEN_500}
                    />
                  </View>
                )}

                <View style={styles.sampleLabelWrap}>
                  <Text style={styles.sampleLabelText}>Muestra {idx + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info hint */}
          <View style={styles.hint}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={NEUTRAL_500}
            />
            <Text style={styles.hintText}>
              Usa una imagen de 1920 × 1080 px para mejor calidad.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.useBtn, !selected && styles.useBtnDisabled]}
          onPress={handleUse}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Ionicons
            name="checkmark-outline"
            size={20}
            color={selected ? GREEN_900 : NEUTRAL_200}
          />
          <Text
            style={[styles.useBtnText, !selected && styles.useBtnTextDisabled]}
          >
            Usar imagen
          </Text>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    backgroundColor: WHITE,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.principal.neutral[100] ?? "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  headerSpacer: {
    width: 38,
  },

  // Preview
  preview: {
    width: SCREEN_W,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  previewEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  previewEmptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_200,
    fontWeight: Typography.weights.medium,
  },
  previewBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  previewBadgeText: {
    fontSize: Typography.sizes.xs,
    color: WHITE,
    fontWeight: Typography.weights.semibold,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 14,
  },

  // Grid
  // Reemplaza el estilo del grid:
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // ← agrega esto
    gap: 10,
    width: "100%",
    marginTop: 20,
  },

  // Y las celdas de muestra:
  sampleCell: {
    width: "48%", // ← dos columnas (~50% cada una)
    aspectRatio: 16 / 9, // ← ratio dinámico en lugar de altura fija
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    borderWidth: 2.5,
    borderColor: "transparent",
  },

  // Picker column (gallery + camera stacked)
  pickerColumn: {
    width: "100%",
    gap: 10,
    flexDirection: "row",
    height: 80,
  },
  pickerCell: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  pickerCellLight: {
    backgroundColor: GREEN_50,
    borderWidth: 1.5,
    borderColor: GREEN_200,
    borderStyle: "dashed",
  },
  pickerCellDark: {
    backgroundColor: GREEN_900,
  },
  pickerCellText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },

  // Sample cells

  sampleCellActive: {
    borderColor: GREEN_500,
  },
  sampleImage: {
    width: "100%",
    height: "100%",
  },
  sampleCheckBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: WHITE,
    borderRadius: 12,
    lineHeight: 0,
  },
  sampleLabelWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
  },
  sampleLabelText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // Hint
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: Colors.principal.neutral[50] ?? "#F8FAFC",
    padding: 10,
    borderRadius: 10,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    flex: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    backgroundColor: WHITE,
  },
  useBtn: {
    backgroundColor: GREEN_500,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  useBtnDisabled: {
    backgroundColor: "#F1F5F9",
    shadowOpacity: 0,
    elevation: 0,
  },
  useBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  useBtnTextDisabled: {
    color: NEUTRAL_200,
  },
});
