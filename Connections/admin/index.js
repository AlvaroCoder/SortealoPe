import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_ADMIN } from "../APIURLS";

const { GET_EVENTS_TO_CONFIRM, GET_EVENT_TO_CONFIRM, APPROVE_EVENT } = ENDPOINTS_ADMIN;

// GET /admins/events/toConfirm
export async function GetEventsToConfirm() {
  return fetchWithAuth(GET_EVENTS_TO_CONFIRM);
}

// GET /admins/events/toConfirm/{eventId}
export async function GetEventToConfirm(eventId) {
  return fetchWithAuth(`${GET_EVENT_TO_CONFIRM}${eventId}`);
}

// PATCH /admins/events/toConfirm/{eventId}
export async function ApproveEvent(eventId, data) {
  return fetchWithAuth(`${APPROVE_EVENT}${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
