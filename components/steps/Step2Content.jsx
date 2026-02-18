import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Typography } from "../../constants/theme";
import DatePickerInput from "../common/Buttons/ButtonDatePicker";
import ButtonGradiend from "../common/Buttons/ButtonGradiendt";
import OutlineTextField from "../common/TextFields/OutlineTextField";
import Title from "../common/Titles/Title";

const GREEN_900 = Colors.principal.green[900];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const RED_500 = Colors.principal.red[500];

export default function Step2Content({ form, setForm, onNext, onBack }) {
  const [validationErrors, setValidationErrors] = useState({});

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setError = (key, message) => {
    setValidationErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handlePriceChange = (text) => {
    // Permitir solo números y punto decimal
    const filtered = text.replace(/[^0-9.]/g, "");

    // Si el campo está vacío, guardamos 0 o null para la API
    if (filtered === "") {
      updateForm("ticketPrice", 0);
      setError("ticketPrice", "El precio es obligatorio.");
      return;
    }

    // Convertimos a número decimal para la API
    const numericValue = parseFloat(filtered);
    updateForm("ticketPrice", numericValue);

    if (!isNaN(numericValue) && numericValue <= 0) {
      setError("ticketPrice", "El precio debe ser mayor a cero.");
    } else {
      setError("ticketPrice", "");
    }
  };

  const handleIntegerChange = (key, text) => {
    // Permitir solo números enteros
    const filtered = text.replace(/[^0-9]/g, "");

    if (filtered === "") {
      updateForm(key, 0);
      setError(key, "La cantidad es obligatoria.");
      return;
    }

    // Convertimos a número entero para la API
    const numericValue = parseInt(filtered, 10);
    updateForm(key, numericValue);

    if (!isNaN(numericValue) && numericValue <= 0) {
      setError(key, "La cantidad debe ser mayor a cero.");
    } else {
      setError(key, "");
    }
  };

  const handleNext = () => {
    const errors = {};
    let hasErrors = false;

    if (!form.title) errors.title = "El título es obligatorio.";
    if (!form.description)
      errors.description = "La descripción es obligatoria.";
    if (!form.place) errors.place = "El lugar es obligatorio.";

    // Validamos usando tipos numéricos
    if (typeof form.ticketPrice !== "number" || form.ticketPrice <= 0)
      errors.ticketPrice = "Ingresa un precio válido (> 0).";

    if (
      typeof form.ticketsPerCollection !== "number" ||
      form.ticketsPerCollection <= 0
    )
      errors.ticketsPerCollection = "Ingresa una cantidad válida (> 0).";

    setValidationErrors(errors);
    hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      Alert.alert(
        "Error de Validación",
        "Por favor, corrige los errores en el formulario.",
      );
      return;
    }

    onNext();
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <Text style={styles.errorText}>
        <Ionicons name="alert-circle-outline" size={14} color={RED_500} />{" "}
        {error}
      </Text>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.stepContent}>
        <Title styleTitle={styles.stepTitleText}>
          2. Ingresar datos del evento
        </Title>
        <Text style={styles.stepSubtitleText}>
          Ingresa los detalles clave de tu evento para que los compradores
          puedan identificarlo.
        </Text>

        <Text style={styles.sectionTitle}>Información básica</Text>

        <OutlineTextField
          title="Titulo del evento"
          placeholder="Ej: Rifa viaje a Cancún"
          value={form.title}
          onChangeText={(text) => updateForm("title", text)}
          required={true}
        />
        <ErrorMessage error={validationErrors.title} />

        <OutlineTextField
          title="Descripción del evento"
          placeholder="Ingresa la descripción y el premio principal"
          value={form?.description}
          onChangeText={(text) => updateForm("description", text)}
          multiline={true}
          numberOfLines={4}
          required={true}
        />
        <ErrorMessage error={validationErrors.description} />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Detalles y fechas
        </Text>

        <OutlineTextField
          keyboardType="numeric"
          placeholder="00.00"
          // Convertimos el número a string para el componente visual
          value={form.ticketPrice ? form.ticketPrice.toString() : ""}
          onChangeText={handlePriceChange}
          title="Precio Unitario"
          required={true}
        />
        <ErrorMessage error={validationErrors.ticketPrice} />

        <OutlineTextField
          title="Cantidad de Tickets por Vendedor"
          keyboardType="numeric"
          placeholder="Total de tickets a generar"
          // Convertimos el número a string para el componente visual
          value={
            form?.ticketsPerCollection
              ? form.ticketsPerCollection.toString()
              : ""
          }
          onChangeText={(text) =>
            handleIntegerChange("ticketsPerCollection", text)
          }
          required={true}
        />
        <ErrorMessage error={validationErrors.ticketsPerCollection} />

        <OutlineTextField
          title="Lugar del evento"
          placeholder="Ej: Sede Central/Zoom"
          value={form?.place}
          onChangeText={(text) => updateForm("place", text)}
          required={true}
        />
        <ErrorMessage error={validationErrors.place} />

        <DatePickerInput
          label="Fecha de Cierre del Sorteo (DD/MM/AAAA)"
          required={true}
          value={form?.date}
          onChange={(selectedDate) =>
            setForm({
              ...form,
              date: selectedDate,
            })
          }
        />

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back-outline"
              style={{ color: GREEN_900 }}
              size={24}
            />
          </TouchableOpacity>
          <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
            Continuar
          </ButtonGradiend>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stepContent: {
    width: "100%",
  },
  stepTitleText: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 8,
  },
  stepSubtitleText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 10,
    color: Colors.principal.blue[800],
  },

  inputLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    marginTop: 15,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderRadius: 12,
    padding: 15,
    fontSize: Typography.sizes.lg,
    backgroundColor: WHITE,
  },
  textInputError: {
    borderColor: RED_500,
    borderWidth: 2,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: RED_500,
    marginTop: 4,
    marginLeft: 5,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 40,
    gap: 8,
  },
  nextButton: {
    flex: 1,
  },
  backButton: {
    borderColor: GREEN_900,
    borderRadius: 50, // Corregido de "100%" a 50 para forma circular
    width: 50,
    height: 50, // Añadido height para que sea un círculo perfecto
    borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
