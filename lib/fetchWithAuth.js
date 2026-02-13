import AsyncStorage from "@react-native-async-storage/async-storage";
import { RefreshToken } from "../Connections/login_register";

export async function fetchWithAuth(url, options = {}) {
  try {
    let token = await AsyncStorage.getItem("token");

    const updatedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };

    let response = await fetch(url, updatedOptions);

    if (response.status !== 401) return response;

    console.log("Token expirado ➜ intentando refresh...");

    const refreshResponse = await RefreshToken();

    if (!refreshResponse.ok) {
      console.log("Refresh Token inválido ❌");
      await AsyncStorage.removeItem("token");
      return response;
    }

    const { accessToken } = await refreshResponse.json();
    await AsyncStorage.setItem("token", accessToken);

    updatedOptions.headers.Authorization = `Bearer ${accessToken}`;

    return fetch(url, updatedOptions);
  } catch (err) {
    console.log("Error fetchWithAuth ❌:", err);
    throw new Error(err.message || "Error inesperado en fetchWithAuth");
  }
}
