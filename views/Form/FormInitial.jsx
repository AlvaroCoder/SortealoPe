import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonGradiendt from "../../components/common/Buttons/ButtonGradiendt";
import Title from "../../components/common/Titles/Title";
import { Colors, Typography } from "../../constants/theme";

export default function FormInitial({
  title = "Registro",
  buttonText = "Registrarse",
  children,
  onSubmit = () => {},
  textPosition = "center",
  onForgotPassword,
}) {
  return (
    <View contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Title styleTitle={[styles.title, { textAlign: textPosition }]}>
          {title}
        </Title>

        <View style={styles.formBody}>{children}</View>

        {onForgotPassword && (
          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <ButtonGradiendt onPress={onSubmit}>{buttonText}</ButtonGradiendt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    padding: 24,
    marginBottom: 0,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    marginBottom: 10,
  },
  formBody: {
    width: "100%",
    marginBottom: 10,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 4,
  },
  forgotText: {
    fontSize: Typography.sizes.sm,
    color: Colors.principal.blue[600],
    fontWeight: Typography.weights.medium,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
