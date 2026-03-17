import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateCollectionsByExcel } from "../../../Connections/collections";
import { Colors, Typography } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

export default function ImportExcelModal({ visible, onClose, eventId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
          "*/*",
        ],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFile(result.assets[0]);
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir el selector de archivos.");
    }
  };

  const handleImport = async () => {
    if (!file) {
      Alert.alert("Sin archivo", "Por favor selecciona un archivo Excel primero.");
      return;
    }
    if (!eventId) {
      Alert.alert("Error", "No se encontró el ID del evento.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "application/octet-stream",
      });

      const response = await CreateCollectionsByExcel(eventId, formData);
      if (response.ok) {
        Alert.alert("Éxito", "Vendedores importados correctamente.", [
          { text: "OK", onPress: handleClose },
        ]);
      } else {
        const body = await response.text();
        Alert.alert("Error", `No se pudieron importar los vendedores.\n${body}`);
      }
    } catch (err) {
      Alert.alert("Error", err.message ?? "Error inesperado al importar.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setLoading(false);
    onClose();
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="cloud-upload-outline" size={20} color={GREEN_900} />
              </View>
              <Text style={styles.title}>Importar desde Excel</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={NEUTRAL_500} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Carga una lista de vendedores en formato .xlsx o .xls.
          </Text>

          {/* Format hint */}
          <View style={styles.hintBox}>
            <Ionicons name="information-circle-outline" size={14} color={GREEN_500} />
            <Text style={styles.hintText}>
              El archivo debe tener columnas:{" "}
              <Text style={styles.hintBold}>username</Text>,{" "}
              <Text style={styles.hintBold}>email</Text>
            </Text>
          </View>

          {/* File picker button */}
          <TouchableOpacity
            style={[styles.fileButton, file && styles.fileButtonSelected]}
            onPress={handlePickFile}
            disabled={loading}
          >
            <Ionicons
              name={file ? "document-outline" : "folder-open-outline"}
              size={22}
              color={file ? GREEN_900 : NEUTRAL_500}
            />
            <Text
              style={[styles.fileButtonText, file && styles.fileButtonTextSelected]}
              numberOfLines={1}
            >
              {file ? file.name : "Seleccionar archivo..."}
            </Text>
            {file && (
              <TouchableOpacity
                onPress={() => setFile(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={NEUTRAL_500} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.importButton,
                (!file || loading) && styles.importButtonDisabled,
              ]}
              onPress={handleImport}
              disabled={!file || loading}
            >
              {loading ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={16} color={WHITE} />
                  <Text style={styles.importButtonText}>Importar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.principal.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginBottom: 16,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.principal.green[100],
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    color: GREEN_900,
    flex: 1,
  },
  hintBold: {
    fontWeight: Typography.weights.bold,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    borderRadius: 14,
    borderStyle: "dashed",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.principal.neutral[50],
  },
  fileButtonSelected: {
    borderColor: GREEN_500,
    borderStyle: "solid",
    backgroundColor: Colors.principal.green[50],
  },
  fileButtonText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
  },
  fileButtonTextSelected: {
    color: GREEN_900,
    fontWeight: Typography.weights.medium,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  cancelButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },
  importButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_900,
  },
  importButtonDisabled: {
    opacity: 0.45,
  },
  importButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: WHITE,
  },
});
