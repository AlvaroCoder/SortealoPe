import {
  LoginUser,
  RegisterUser,
  VerifyUser,
} from "@/Connections/login_register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const AuthContext = createContext({
  loading: false,
  isLogged: false,
  userData: { email: "alvaro@gmail.com" },
  accessToken: "",
  signin: async () => {},
  signout: async () => {},
  signUp: async () => {},
  validateCode: async () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState({
    email: "alvaro89_piura@hotmail.com",
  });

  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    async function getCacheUserData() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        if (!token) return;
        setAccessToken(token);
        setIsLogged(true);
        const decodedPayload = jwtDecode(token);

        setUserData(decodedPayload);
      } catch (err) {
        console.log(err);

        Alert.alert("Error", "Error en la validación");
      } finally {
        setLoading(false);
      }
    }
    getCacheUserData();
  }, []);

  const signin = async (user) => {
    try {
      setLoading(true);
      const response = await LoginUser(user);
      const responseJSON = await response.json();

      if (!response.ok) {
        throw new Error(
          responseJSON?.message || "Ocurrió un error en el inicio de sesión",
        );
      }
      const token = String(responseJSON?.accessToken);
      await AsyncStorage.setItem("token", token);

      setAccessToken(token);

      const userToken = jwtDecode(token);
      setUserData(userToken);
      setIsLogged(true);
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
        const responseJSON = await response.json();
        throw new Error(
          responseJSON?.message || "Ocurrio un error en el registro",
        );
      }
      setUserData(user);
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
      const dataToSend = {
        email,
        verificationCode,
      };
      const response = await VerifyUser(dataToSend);

      if (!response.ok) {
        const responseJSON = await response.json();
        throw new Error(
          responseJSON?.message || "Ocurrio un error en la validación",
        );
      }
    } catch (err) {
      console.log("Error Validate:", err);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };
  const signout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      setIsLogged(false);
      setUserData(null);
    } catch (err) {
      console.log(err);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
