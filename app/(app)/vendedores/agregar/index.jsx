import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ButtonActionAgregar from "../../../../components/common/Buttons/ButtonActionAgregar";
import ImportExcelModal from "../../../../components/common/Dividers/ImportExcelModal";
import QRVendedorModal from "../../../../components/common/Dividers/QRVendedorModal";
import { Colors, Typography } from "../../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const WHITE = "white";
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function PageAgregarVendedor() {
  const { eventId } = useLocalSearchParams();
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Agregar un Vendedor</Text>
      <Text style={styles.subtitle}>
        Selecciona cómo deseas integrar nuevos vendedores a tu evento.
      </Text>

      <View style={styles.actionsContainer}>
        <ButtonActionAgregar
          icon="cloud-upload-outline"
          title="Importar Vendedores"
          subtitle="Carga una lista masiva (CSV/Excel)"
          onPress={() => setIsImportModalVisible(true)}
        />
        <ButtonActionAgregar
          icon="qr-code-outline"
          title="Agregar por QR"
          subtitle="Genera un enlace/código de invitación"
          onPress={() => setIsQrModalVisible(true)}
        />
      </View>

      <ImportExcelModal
        visible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        eventId={eventId}
      />

      <QRVendedorModal
        visible={isQrModalVisible}
        onClose={() => setIsQrModalVisible(false)}
        eventId={eventId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 24,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    textAlign: "center",
    marginBottom: 40,
  },
  actionsContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 20,
  },
});
