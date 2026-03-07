import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS_IMAGES } from "../APIURLS";

// POST /images  (multipart/form-data)
// formData: FormData object with the image file appended as "file"
// fetchWithAuth is intentionally NOT used here because it always injects
// Content-Type: application/json, which breaks multipart boundaries.
// The Authorization header is added manually after reading the token.
export async function UploadImage(formData) {
  const token = await AsyncStorage.getItem("token");
  return fetch(ENDPOINTS_IMAGES.UPLOAD, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      // Content-Type is intentionally omitted so fetch sets the
      // correct multipart/form-data boundary automatically.
    },
    body: formData,
  });
}
