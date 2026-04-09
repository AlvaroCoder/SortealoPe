export const BASE_URL = "http://192.168.1.100:8087/api/v1";

export const ENDPOINTS_LOGIN = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  VERIFY: `${BASE_URL}/auth/verify`,
  RESEND_NOTIFICATION: `${BASE_URL}/auth/resend`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
  GOOGLE_AUTH: `${BASE_URL}/auth/google`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
};

export const ENDPOINTS_EVENTS = {
  // GET /events?userId=&eventStatus=
  GET_BY_USER: `${BASE_URL}/events`,
  // GET /events/{eventId}
  GET_BY_ID: `${BASE_URL}/events/`,
  // GET /events/categories
  GET_CATEGORIES: `${BASE_URL}/events/categories`,
  // GET /events/packs
  GET_PACKS: `${BASE_URL}/events/packs`,
  // POST /events
  CREATE: `${BASE_URL}/events`,
  // PATCH /events/{eventId}
  UPDATE: `${BASE_URL}/events/`,
  // PATCH /events/eventTickets/{eventId}
  UPDATE_TICKETS: `${BASE_URL}/events/eventTickets/`,
  // PATCH /events/finish/{eventId}
  FINISH: `${BASE_URL}/events/finish/`,
};

// ─── Collections (protegidos) ─────────────────────────────────────────────────
export const ENDPOINTS_COLLECTIONS = {
  // GET /collections?eventId=
  GET_BY_EVENT: `${BASE_URL}/collections`,
  // GET /collections/{collectionId}?eventId=
  GET_BY_ID: `${BASE_URL}/collections/`,
  // POST /collections/create  Body: { eventId, ticketsQuantity }  → retorna CollectionDto con { code, ... }
  CREATE: `${BASE_URL}/collections/create`,
  // POST /collections/create/excel?eventId=
  CREATE_EXCEL: `${BASE_URL}/collections/create/excel`,
  // PATCH /collections/confirm/{code}  → asigna la colección al vendedor autenticado
  CONFIRM: `${BASE_URL}/collections/confirm/`,
};

// ─── Tickets ──────────────────────────────────────────────────────────────────
export const ENDPOINTS_TICKETS = {
  // GET /tickets?eventId=&collectionId=&ticketStatus=&page=&size=  (protegido, todos los params obligatorios)
  GET: `${BASE_URL}/tickets`,
  // GET /tickets/{ticketId}      (protegido)
  GET_BY_ID: `${BASE_URL}/tickets/`,
  // GET /tickets/status          (público)
  GET_STATUS: `${BASE_URL}/tickets/status`,
  // POST /tickets/reservation?eventId=  Body: { ticketCodes: [uuid, ...] }
  RESERVATION: `${BASE_URL}/tickets/reservation`,
  // PATCH /tickets/bookTickets/{reservationCode}
  BOOK_TICKETS: `${BASE_URL}/tickets/bookTickets/`,
  // PATCH /tickets/confirmTicket?eventId=&ticketCode=  Body: { modalityId, operationNumber }
  CONFIRM: `${BASE_URL}/tickets/confirmTicket`,
  // PATCH /tickets/releaseTicket?eventId=&ticketCode=
  RELEASE: `${BASE_URL}/tickets/releaseTicket`,
  // GET /tickets/buyer?eventId=&ticketStatus=&page=&size=  (comprador, sin collectionId)
  GET_BUYER: `${BASE_URL}/tickets/buyer`,
};

// ─── Users (protegidos) ───────────────────────────────────────────────────────
export const ENDPOINTS_USERS = {
  // GET   /users/{id}
  GET_BY_ID: `${BASE_URL}/users/`,
  // PATCH /users/{id}
  UPDATE: `${BASE_URL}/users`,
};

// ─── Images (protegido) ───────────────────────────────────────────────────────
export const ENDPOINTS_IMAGES = {
  // POST /images  (multipart/form-data, field: "file") → ImageDto { url }
  UPLOAD: `${BASE_URL}/images`,
  // POST /images/user  (multipart: "file" + "userId") → ImageDto { url }, actualiza user.photo
  UPLOAD_USER: `${BASE_URL}/images/user`,
};

// ─── Admin (protegidos) ───────────────────────────────────────────────────────
export const ENDPOINTS_ADMIN = {
  // GET   /admins/events/toConfirm
  GET_EVENTS_TO_CONFIRM: `${BASE_URL}/admins/events/toConfirm`,
  // GET   /admins/events/toConfirm/{eventId}
  GET_EVENT_TO_CONFIRM: `${BASE_URL}/admins/events/toConfirm/`,
  // PATCH /admins/events/toConfirm/{eventId}
  APPROVE_EVENT: `${BASE_URL}/admins/events/toConfirm/`,
};
