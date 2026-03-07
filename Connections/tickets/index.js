import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_TICKETS } from "../APIURLS";

const { GET_BY_COLLECTION, GET_BY_USER, GET_BY_ID, GET_STATUS, BOOK, CONFIRM, RELEASE, GENERATE } =
  ENDPOINTS_TICKETS;

// GET /tickets?collectionId={id}  (protegido)
export async function GetTicketsByCollection(collectionId) {
  return fetchWithAuth(`${GET_BY_COLLECTION}?collectionId=${collectionId}`);
}

// GET /tickets?userId={id}  (protegido)
export async function GetTicketsByUser(userId) {
  return fetchWithAuth(`${GET_BY_USER}?userId=${userId}`);
}

// GET /tickets/{ticketId}  (protegido)
export async function GetTicketById(ticketId) {
  return fetchWithAuth(`${GET_BY_ID}${ticketId}`);
}

// GET /tickets/status  (público — sin auth)
export async function GetTicketsStatus() {
  return fetch(GET_STATUS);
}

// PATCH /tickets/bookTicket?buyerId={buyerId}&ticketCode={code}
export async function BookTicket(buyerId, ticketCode) {
  return fetchWithAuth(`${BOOK}?buyerId=${buyerId}&ticketCode=${ticketCode}`, {
    method: "PATCH",
  });
}

// PATCH /tickets/confirmTicket/{ticketCode}
export async function ConfirmTicket(ticketCode, data) {
  return fetchWithAuth(`${CONFIRM}${ticketCode}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// PATCH /tickets/releaseTicket/{ticketCode}
export async function ReleaseTicket(ticketCode) {
  return fetchWithAuth(`${RELEASE}${ticketCode}`, { method: "PATCH" });
}

// POST /tickets/generateTicket/{ticketCode}
export async function GenerateTicket(ticketCode) {
  return fetchWithAuth(`${GENERATE}${ticketCode}`, { method: "POST" });
}
