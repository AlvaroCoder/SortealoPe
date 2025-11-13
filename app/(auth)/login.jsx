import Constants from "expo-constants";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ButtonLoginGoogle from "../../components/common/Buttons/ButtonLoginGoogle";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import { Colors, Typography } from "../../constants/theme";
import FormInitial from "../../views/Form/FormInitial";

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = () => {
    console.log("Datos del formulario:", formData);
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
          title="Registro"
          buttonText="Registrate"
          onSubmit={handleSubmit}
        >
          <OutlineTextField
            title="Nombre de usuario"
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            type='text'
            onChangeText={(text) => updateFields('username', text)}
            required={true}
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Email"
            placeholder="Ingresa tu correo electronico"
            value={formData.email}
            type='email'
            onChangeText={(text) => updateFields('email', text)}
            required={true}
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
        <View style={styles.divider}>
            <View style={styles.separatorLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.separatorLine} />
          </View>
        <View style={styles.additionalComponents}>
          <ButtonLoginGoogle/>
        </View>
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
  dividerText: {
    textAlign: 'center',
    color: '#666',
    marginHorizontal: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor : Colors.light.border
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    fontWeight : Typography.weights.medium
  }
})