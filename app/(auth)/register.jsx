import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import ButtonLoginGoogle from "../../components/common/Buttons/ButtonLoginGoogle";
import DividerO from "../../components/common/Dividers/DividerO";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import { Colors } from "../../constants/theme";
import FormInitial from "../../views/Form/FormInitial";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    console.log("Datos del formulario:", formData);
    router.push('/(drawer)');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight }]}>
      <ScrollView>
        <FormInitial
          title="Registro"
          buttonText="Registrate"
          onSubmit={handleSubmit}
        >
          <OutlineTextField
            title="Nombre de usuarios"
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            type="text"
            onChangeText={(text) => handleChange('username', text)}
            required={true}
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Correo electronico"
            placeholder="Ingrese el correo electronico"
            value={formData.email}
            type="email"
            onChangeText={(text) => handleChange('email', text)}
            required={true}
            returnKeyType="next"
          />
          
          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Contraseña"
            placeholder="Ingresa la contraseña"
            value={formData.password}
            type="password"
            onChangeText={(text) => handleChange('password', text)}
            required={true}
            returnKeyType="next"
          />
        </FormInitial>
        <DividerO />
        <View style={styles.additionalComponents}>
          <ButtonLoginGoogle
            buttonText="Registrate con Google"
          />
        </View>
        <TextPrevAccount
          type="register"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
  },
  additionalComponents: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white'
  },
});