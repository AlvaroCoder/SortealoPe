import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from 'react-native';
import ButtonLoginGoogle from "../../components/common/Buttons/ButtonLoginGoogle";
import DividerO from "../../components/common/Dividers/DividerO";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import FormInitial from "../../views/Form/FormInitial";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email : '',
    password: ''
  });

  const handleSubmit = () => {
    console.log("Datos del formulario:", formData);
    router.push('/(drawer)');
  };

  const updateFields = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <FormInitial
          title="Inicio de Sesión"
          buttonText="Iniciar Sesión"
          onSubmit={handleSubmit}
        >
          <OutlineTextField
            title="Correo electronico"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            type='email'
            onChangeText={(text) => updateFields('email', text)}
            required={true}
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Contraseña"
            value={formData.password}
            onChangeText={(text) => updateFields('password', text)}
            placeholder="Crea una contraseña segura"
            secureTextEntry={true}
            required={true}
          />
        </FormInitial>
        <DividerO/>
        <View style={styles.additionalComponents}>
          <ButtonLoginGoogle/>
        </View>
        <TextPrevAccount
          type="login"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  additionalComponents: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal : 28
  },

})