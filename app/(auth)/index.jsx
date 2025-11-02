import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import { Colors, Typography } from '../../constants/theme';

const URL_IMAGEN = "https://res.cloudinary.com/dabyqnijl/image/upload/v1762043981/sortealope/Mobile-bro_zdw1nq.png";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: URL_IMAGEN }}
          style={styles.image}
          contentFit="contain"
          transition={1000}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Gestiona tus rifas</Text>
        
        <Text style={styles.subtitle}>
          Crea tus rifas y controlalos a tan solo {"\n"}
          un click de distancia
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Empezar"
            onPress={() => router.push("/(auth)/register")}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: Colors.principal.red[500],
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 60,
    minHeight: 400,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Typography.fonts.display,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.normal,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    
    marginBottom: 45,
    minHeight : 20
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.principal.red[500],
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 300
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
});