import { LoginUser, RegisterUser, VerifyUser } from "@/Connections/login_register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    loading : false,
  isLogged: false,
  userData: { email: "alvaro@gmail.com" },
  signin: async () => {},
  signout: async () => {},
    signUp: async () => { },
  validateCode : async ()=>{}, 
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

  const signin = async (user) => {
      try {
          setLoading(true);
      const response = await LoginUser(user);
    const responseJSON = await response.json();
    if (!response.ok) {
        throw new Error(responseJSON?.message || "Ocurrio un error en el inicio de sesión");
    }
          setIsLogged(true);
    await AsyncStorage.setItem("token", responseJSON?.accessToken);
    } catch (err) {
      console.log(err);
      } finally {
          setLoading(false);
    }
  };

  const signUp = async (user) => {
    try {
      setLoading(true);
      const response = await RegisterUser(user);
      console.log(response.status);
      
      if (!response.ok) {
         const responseJSON = await response.json();
        throw new Error(
          responseJSON?.message || "Ocurrio un error en el registro"
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
        console.log(dataToSend);
        
        const response = await VerifyUser(dataToSend);
        
        if (!response.ok) {
          const responseJSON = await response.json();
          throw new Error(
            responseJSON?.message || "Ocurrio un error en la validación"
          );
        }
      } catch (err) {
        console.log("Error Validate:", err);
        return { error: err.message };
      } finally {
        setLoading(false);
      }
    };
  const signout = async (user) => {
    try {
    } catch (err) {
      console.log(err);
    }
  };
    

  return (
    <AuthContext.Provider
          value={{
              loading,
              isLogged,
              userData,
              signin, signout, signUp, validateCode
          }}
    >
      {children}
    </AuthContext.Provider>
  );
}
