import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";
import ButtonGradiend from "../common/Buttons/ButtonGradiendt";
import OutlineTextField from "../common/TextFields/OutlineTextField";

export default function MiniFormCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.styleForm}>
        <OutlineTextField
          title="Titulo del evento"
          placeholder="Ej : Rifa viaje a Cancún"
          value={formData.title}
          onChangeText={(value) => setFormData({ ...formData, title: value })}
        />
        <OutlineTextField
          title="Descripción del evento"
          placeholder="Ingresa la descripción y el premio principal"
          value={formData.description}
          onChangeText={(value) =>
            setFormData({ ...formData, description: value })
          }
          multiline={true}
          numberOfLines={4}
        />
        <ButtonGradiend onPress={() => router.push("event/create")}>
          Crear Evento
        </ButtonGradiend>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  styleForm: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 10,
    color: Colors.principal.blue[800],
  },
});
