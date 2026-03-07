import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_COLLECTIONS } from "../APIURLS";

const { GET_BY_EVENT, GET_BY_ID, CREATE, CREATE_EXCEL } = ENDPOINTS_COLLECTIONS;

// GET /collections?eventId={eventId}
export async function GetCollectionsByEvent(eventId) {
  return fetchWithAuth(`${GET_BY_EVENT}?eventId=${eventId}`);
}

// GET /collections/{collectionId}
export async function GetCollectionById(collectionId) {
  return fetchWithAuth(`${GET_BY_ID}${collectionId}`);
}

// POST /collections/create
export async function CreateCollection(data) {
  return fetchWithAuth(CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /collections/create/excel?eventId={eventId}
// body: FormData with Excel file
export async function CreateCollectionsByExcel(eventId, formData) {
  return fetchWithAuth(`${CREATE_EXCEL}?eventId=${eventId}`, {
    method: "POST",
    headers: {},  // omit Content-Type so fetch sets multipart boundary automatically
    body: formData,
  });
}
