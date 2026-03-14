import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_EVENTS } from "../APIURLS";

const {
  GET_BY_USER,
  GET_BY_ID,
  GET_CATEGORIES,
  GET_PACKS,
  CREATE,
  UPDATE,
  UPDATE_TICKETS,
  FINISH,
} = ENDPOINTS_EVENTS;

// GET /events?userId={userId}&eventStatus={status}
export async function GetEventsByUser(userId, status) {
  const url = status
    ? `${GET_BY_USER}?userId=${userId}&eventStatus=${status}`
    : `${GET_BY_USER}?userId=${userId}`;
  return fetchWithAuth(url);
}

// GET /events/{eventId}
export async function GetEventById(eventId) {
  return fetchWithAuth(`${GET_BY_ID}${eventId}`);
}

// GET /events/categories
export async function GetEventCategories() {
  return fetchWithAuth(GET_CATEGORIES);
}

// GET /events/packs
export async function GetEventPacks() {
  return fetchWithAuth(GET_PACKS);
}

// POST /events
export async function CreateEvent(data) {
  return fetchWithAuth(CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PATCH /events/{eventId}
export async function UpdateEvent(eventId, data) {
  return fetchWithAuth(`${UPDATE}${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// PATCH /events/eventTickets/{eventId}
export async function UpdateEventTickets(eventId, data) {
  return fetchWithAuth(`${UPDATE_TICKETS}${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// PATCH /events/finish/{eventId}
export async function FinishEvent(eventId) {
  return fetchWithAuth(`${FINISH}${eventId}`, { method: "PATCH" });
}
