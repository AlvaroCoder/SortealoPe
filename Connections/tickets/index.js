import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_TICKETS } from "../APIURLS";

const { GET, GET_BY_ID, GET_STATUS, RESERVATION, BOOK_TICKETS, CONFIRM, RELEASE } =
  ENDPOINTS_TICKETS;

// GET /tickets?eventId=&collectionId=&ticketStatus=&page=&size=  (protegido)
// ticketStatus: 1=disponible  2=reservado  3=comprado  4=confirmado
export async function GetTickets(eventId, collectionId, ticketStatus, page = 0, size = 200) {
  return fetchWithAuth(
    `${GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=${ticketStatus}&page=${page}&size=${size}`,
  );
}

// GET /tickets/{ticketId}  (protegido)
export async function GetTicketById(ticketId) {
  return fetchWithAuth(`${GET_BY_ID}${ticketId}`);
}

// GET /tickets/status  (público — sin auth)
export async function GetTicketsStatus() {
  return fetch(GET_STATUS);
}

// POST /tickets/reservation?eventId={eventId}
// Body: { ticketCodes: [uuid, ...] }
// Returns: { id: "reservation-uuid", ... }
export async function CreateReservation(eventId, ticketCodes) {
  return fetchWithAuth(`${RESERVATION}?eventId=${eventId}`, {
    method: "POST",
    body: JSON.stringify({ ticketCodes }),
  });
}

// PATCH /tickets/bookTickets/{reservationCode}
// Confirma la reserva → tickets pasan a estado 3=comprado
export async function BookTickets(reservationCode) {
  return fetchWithAuth(`${BOOK_TICKETS}${reservationCode}`, { method: "PATCH" });
}

// PATCH /tickets/confirmTicket?eventId=&ticketCode=
// Body: { modalityId, operationNumber }
export async function ConfirmTicket(eventId, ticketCode, data) {
  return fetchWithAuth(
    `${CONFIRM}?eventId=${eventId}&ticketCode=${ticketCode}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

// PATCH /tickets/releaseTicket?eventId=&ticketCode=
export async function ReleaseTicket(eventId, ticketCode) {
  return fetchWithAuth(
    `${RELEASE}?eventId=${eventId}&ticketCode=${ticketCode}`,
    { method: "PATCH" },
  );
}