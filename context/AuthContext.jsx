import {
  ForgotPassword,
  LoginUser,
  LoginWithGoogle,
  RegisterUser,
  ResendNotification,
  VerifyUser,
} from "@/Connections/login_register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  loading: false,
  isLogged: false,
  userData: null,
  accessToken: null,
  signin: async () => {},
  signout: async () => {},
  signUp: async () => {},
  validateCode: async () => {},
  signInWithGoogle: async () => {},
  resendCode: async () => {},
  forgotPassword: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        console.log("Token : ", token);

        if (!token) return;
        setAccessToken(token);
        setUserData(jwtDecode(token));
        setIsLogged(true);
      } catch (err) {
        console.log("Session restore error:", err);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Helper interno: almacena token JWT y actualiza estado
  const _storeToken = async (token) => {
    await AsyncStorage.setItem("token", token);
    setAccessToken(token);
    setUserData(jwtDecode(token));
    setIsLogged(true);
  };

  const signin = async (user) => {
    try {
      setLoading(true);
      const response = await LoginUser(user);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || "Error en el inicio de sesión");
      }
      console.log("Json de log : ", json);

      await _storeToken(String(json.accessToken));
    } catch (err) {
      console.log("Error Login:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (user) => {
    try {
      setLoading(true);
      const response = await RegisterUser(user);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.message || "Error en el registro");
      }
      // Solo almacena el email para mostrarlo en la pantalla de validación
      setUserData({ email: user.email });
    } catch (err) {
      console.log("Error Register:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (email, verificationCode) => {
    try {
      setLoading(true);
      const response = await VerifyUser({ email, verificationCode });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.message || "Error en la validación");
      }
    } catch (err) {
      console.log("Error Validate:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (email) => {
    try {
      setLoading(true);
      const response = await ResendNotification(email);
      if (!response.ok) {
        throw new Error("No se pudo reenviar el código");
      }
    } catch (err) {
      console.log("Error Resend:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (googleAccessToken) => {
    try {
      setLoading(true);
      const response = await LoginWithGoogle(googleAccessToken);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || "Error al autenticar con Google");
      }
      await _storeToken(String(json.accessToken));
    } catch (err) {
      console.log("Error Google Login:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await ForgotPassword(email);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.message || "Error al enviar el correo");
      }
    } catch (err) {
      console.log("Error ForgotPassword:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.multiRemove(["token", "userRole"]); // FIX: limpia ambos
      setIsLogged(false);
      setUserData(null);
      setAccessToken(null);
    } catch (err) {
      console.log("Signout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isLogged,
        userData,
        accessToken,
        signin,
        signout,
        signUp,
        validateCode,
        signInWithGoogle,
        resendCode,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
