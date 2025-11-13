import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Typography } from '../../../constants/theme';

WebBrowser.maybeCompleteAuthSession();

export default function ButtonLoginGoogle() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '258869415345-muaua0e6vfvd34r6j1b261g7kb01igpq.apps.googleusercontent.com',
    iosClientId: '258869415345-h6ct4c8dsrj15vdm9kr7lktp0f85ks4d.apps.googleusercontent.com',
    webClientId: '258869415345-j7m21vbdmv4ncv5pcn36cjkghh3uogmi.apps.googleusercontent.com',
  });

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('✅ Token de acceso:', authentication.accessToken);
      setLoading(false);
      // Aquí podrías redirigir o autenticar con tu backend.
    } else if (response?.type === 'error') {
      console.log('❌ Error en el inicio de sesión:', response.error);
      setLoading(false);
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.log('Error al iniciar sesión con Google:', error);
      setLoading(false);
    }
  };

  return (
    <Pressable
      disabled={!request || loading}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed || loading ? 0.8 : 1 },
      ]}
      onPress={handleLogin}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <View style={styles.content}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dabyqnijl/image/upload/v1762924676/logo_google_zlsawc.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.text}>Iniciar sesión con Google</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 22,
    height: 22,
  },
  text: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: '#333',
    fontFamily: Typography.fonts.display,
  },
});