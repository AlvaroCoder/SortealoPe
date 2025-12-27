import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import { Colors } from "../../constants/theme";
import FormInitial from "../../views/Form/FormInitial";

const URL_LOGO_IMAGE = "https://res.cloudinary.com/dabyqnijl/image/upload/v1730493843/laztvzw7ytanqrdj161e.png";

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

        <TextPrevAccount
          type="register"
        />

        <View style={styles.containerBottom}>
          <Text>Powered By </Text>
          <Image
            source={{ uri: URL_LOGO_IMAGE }}
            style={styles.image}
            contentFit="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  image: {
    width: 200,
    height: 80,
    marginTop: 10,
    alignSelf: 'center',
  },
  containerBottom: {
    marginTop: Dimensions.get('window').height * 0.1,
    opacity : 0.5,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});