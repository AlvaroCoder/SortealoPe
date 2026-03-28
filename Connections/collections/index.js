import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_COLLECTIONS } from "../APIURLS";

const { GET_BY_EVENT, GET_BY_ID, CREATE, CREATE_EXCEL, CONFIRM } =
  ENDPOINTS_COLLECTIONS;

// GET /collections?eventId={eventId}
export async function GetCollectionsByEvent(eventId) {
  return fetchWithAuth(`${GET_BY_EVENT}?eventId=${eventId}`);
}

// GET /collections/{collectionId}?eventId=
export async function GetCollectionById(collectionId, eventId) {
  return fetchWithAuth(`${GET_BY_ID}${collectionId}?eventId=${eventId}`);
}

// POST /collections/create
export async function CreateCollection(data) {
  return fetchWithAuth(CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PATCH /collections/confirm/{code}
// Asigna la colección al vendedor autenticado (el JWT identifica al vendedor)
export async function ConfirmCollection(code) {
  return fetchWithAuth(`${CONFIRM}${code}`, { method: "POST" });
}

// POST /collections/create/excel?eventId={eventId}
// body: FormData with Excel file
// Uses AsyncStorage directly (NOT fetchWithAuth) because fetchWithAuth injects
// Content-Type: application/json which corrupts the multipart/form-data boundary.
export async function CreateCollectionsByExcel(eventId, formData) {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${CREATE_EXCEL}?eventId=${eventId}`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      // NO Content-Type — let fetch set the multipart boundary automatically
    },
    body: formData,
  });
}
