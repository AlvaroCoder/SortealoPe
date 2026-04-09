import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Typography } from "../../constants/theme";
import { consumePickedImage } from "../../lib/imageCropStore";
import ButtonGradiend from "../common/Buttons/ButtonGradiendt";
import Title from "../common/Titles/Title";

// --- Color constants ---
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const GREEN_200 = Colors.principal.green[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

const URL_IMAGEN_RIFA =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775154006/RIFA_1_krstjg.png";

export default function Step3Content({ form = {}, setForm, onSubmit, onBack }) {
  const router = useRouter();

  // When the user returns from subirImagen, consume the stored pick
  useFocusEffect(
    useCallback(() => {
      const picked = consumePickedImage();
      if (picked) {
        setForm((prev) => ({ ...prev, image: picked }));
      }
    }, [setForm]),
  );

  // Resolve the displayable URI from either a file object or a URL string
  const imageUri = form.image?.uri ?? form.image ?? null;

  const handleNavigateToImagePicker = () => {
    router.push({
      pathname: "/(app)/event/subirImagen",
      params: { currentImageUri: imageUri ?? "" },
    });
  };

  const handleFinalSubmit = () => {
    if (onSubmit) onSubmit();
  };

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Title>4. Diseño y Archivos Promocionales</Title>{/* Bug fix: was labeled "3." but this is step 4 of 4 */}

      <Text style={styles.stepSubtitleText}>
        Sube las piezas gráficas de tu evento. Recuerda que deben cumplir con el
        tamaño de 1920 x 1080 px para asegurar la calidad.
      </Text>

      {/* Static ticket design sample */}
      <Text style={styles.inputLabel}>Ejemplo visual del Ticket </Text>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 15 }}>
        <Image
          source={URL_IMAGEN_RIFA}
          style={{ width: 320, height: 180, borderRadius: 20 }}
        />
      </View>

      {/* Banner image picker */}
      <Text style={styles.inputLabel}>Imagen Principal de la Rifa (*)</Text>

      {imageUri ? (
        // ── Image is set: show 16:9 preview card with "Cambiar" overlay ──
        <View style={styles.previewCard}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            contentFit="cover"
            transition={200}
          />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleNavigateToImagePicker}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={14} color={WHITE} />
            <Text style={styles.changeButtonText}>Cambiar imagen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // ── No image: dashed placeholder that opens the picker ──
        <TouchableOpacity
          style={styles.uploadPlaceholderArea}
          onPress={handleNavigateToImagePicker}
          activeOpacity={0.75}
        >
          <View style={styles.uploadIconWrapper}>
            <Ionicons name="camera-outline" size={32} color={GREEN_900} />
          </View>
          <Text style={styles.uploadTitle}>Subir imagen del evento</Text>
          <Text style={styles.uploadSubtitle}>1920 × 1080 px</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={NEUTRAL_700}
        />
        <Text style={styles.hintText}>
          Las imágenes que no cumplan con las dimensiones exactas serán
          rechazadas por el sistema.
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back-outline"
            style={{ color: GREEN_900 }}
            size={24}
          />
        </TouchableOpacity>

        <ButtonGradiend style={{ flex: 1 }} onPress={handleFinalSubmit}>
          Finalizar
        </ButtonGradiend>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  stepSubtitleText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginBottom: 15,
    lineHeight: 22,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    color: GREEN_900,
  },

  // ── Image preview card (when image is set) ──────────────────────────────
  previewCard: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_200,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  // "Cambiar imagen" overlay button at bottom-left of the preview
  changeButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  changeButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },

  // ── Upload placeholder (when no image) ──────────────────────────────────
  uploadPlaceholderArea: {
    width: "100%",
    height: 160,
    backgroundColor: GREEN_50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: GREEN_200,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  uploadIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  uploadTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  uploadSubtitle: {
    fontSize: Typography.sizes.xs,
    color: GREEN_900,
    opacity: 0.65,
  },

  // ── Info box ────────────────────────────────────────────────────────────
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.principal.neutral[50],
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    marginLeft: 8,
    flex: 1,
  },

  // ── Action row ──────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 40,
    marginBottom: 40,
    width: "100%",
  },
  backButton: {
    borderColor: GREEN_900,
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
