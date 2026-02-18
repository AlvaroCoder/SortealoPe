import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function useUser() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await AsyncStorage.getItem("token");
        const data = response ? jwtDecode(response) : null;
        setUserData(data);
        setToken(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return { userData, loading, token };
}
