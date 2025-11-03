import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Button from "../../components/common/Button";
import { Colors, Typography } from "../../constants/theme";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1762043981/sortealope/Mobile-bro_zdw1nq.png";

const GOOGLE_LOGO = "https://res.cloudinary.com/dabyqnijl/image/upload/v1732559213/sortealope/google_icon_zmkfvh.png";

export default function Register() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(150);
  const lastScrollY = useRef(0);

  const handleRegister = () => {
      console.log('Registrando usuario...');
      router.push("/(drawer)")
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleGoogleRegister = () => {
    console.log('Registro con Google...');
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    const scrollingDown = currentScrollY > lastScrollY.current;
    
    Animated.timing(scrollY, {
      toValue: currentScrollY,
      duration: 100,
      useNativeDriver: false,
    }).start();

    if (scrollingDown && currentScrollY > 50 && headerHeight > 0) {
      setHeaderHeight(0);
    } else if (!scrollingDown && currentScrollY < 100 && headerHeight === 0) {
      setHeaderHeight(150);
    }

    lastScrollY.current = currentScrollY;
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Interpolación para la escala de la imagen
  const imageScale = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const contentMarginTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          { 
            height: headerHeight,
            opacity: imageOpacity,
            transform: [{ scale: imageScale }]
          }
        ]}
      >
        <Image
          source={{ uri: URL_IMAGEN }}
          contentFit="contain"
          transition={1000}
          style={styles.image}
        />
      </Animated.View>
      
      <Animated.ScrollView 
        style={[
          styles.content,
          { marginTop: contentMarginTop }
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>Regístrate</Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ej: juan123"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput 
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput 
              style={styles.input}
              placeholder="Tu apellido"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput 
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor={Colors.light.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput 
              style={styles.input}
              placeholder="+1 234 567 8900"
              placeholderTextColor={Colors.light.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.light.textMuted}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.light.textMuted}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonsContainer}>
            <Button 
              title="Crear Cuenta"
              onPress={handleRegister}
              size="large"
              variant="primary"
              style={styles.primaryButton}
            />
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleRegister}
          >
            <Image
              source={{ uri: GOOGLE_LOGO }}
              style={styles.googleLogo}
              contentFit="contain"
            />
            <Text style={styles.googleButtonText}>Regístrate con Google</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>
              Si ya tienes una cuenta? {" "}
              <Text style={styles.loginLink} onPress={handleLogin}>
                Inicia Sesión
              </Text>
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: Colors.principal.red[500],
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
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 30,
    minHeight: '100%',
  },
  title: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Typography.fonts.display,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    width: "100%",
  },
  secondaryButton: {
    width: "100%",
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    fontWeight: Typography.weights.medium,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  loginLink: {
    color: Colors.principal.red[500],
    fontWeight: Typography.weights.semibold,
  },
});