import { ENDPOINTS_EVENTS } from "../APIURLS";

const URL_CREATE_EVENT = ENDPOINTS_EVENTS.CREATE_EVENT;
const URL_GET_EVENT_BY_ID_USER = ENDPOINTS_EVENTS.GET_EVENTS_BY_ID_USER;
const URL_GET_EVENT_BY_ID_EVENT = ENDPOINTS_EVENTS.GET_EVENT_BY_ID_EVENT;
const URL_GET_EVENTS_CATEGORIES = ENDPOINTS_EVENTS.GET_EVENTS_CATEGORIES;
const URL_GET_EVENTS_PACKS = ENDPOINTS_EVENTS.GET_PACKS_EVENT;
const URL_ADD_COLLECTIONS_TICKETS = ENDPOINTS_EVENTS.ADD_COLLECTIONS_TICKETS;
const URL_UPDATE_EVENT = ENDPOINTS_EVENTS.UPDATE_EVENT;
const URL_UPLOAD_IMAGE = ENDPOINTS_EVENTS.UPLOAD_IMAGE;

export async function CreateEvent(data, token) {
  return await fetch(URL_CREATE_EVENT, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    body: JSON.stringify(data),
  });
}

export async function GetEventByIdUser(idUser, token) {
  return await fetch(`${URL_GET_EVENT_BY_ID_USER}?userId=${idUser}`, {
    method: "GET",
    headers: {
      Authentication: `Bearer ${token}`,
    },
    mode: "cors",
  });
}

export async function GetEventByIdEvent(idEvent = 1, token) {
  return await fetch(`${URL_GET_EVENT_BY_ID_EVENT}/${idEvent}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  });
}

export async function GetEventCategories(token) {
  return await fetch(URL_GET_EVENTS_CATEGORIES, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  });
}

export async function GetEventsPacks(token) {
  return await fetch(URL_GET_EVENTS_PACKS, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  });
}

export async function AddCollectionsAndTickets(idTicket, token) {
  return await fetch(`${URL_ADD_COLLECTIONS_TICKETS}/${idTicket}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  });
}

export async function UpdateEvent(data, idEvent, token) {
  return await fetch(`${URL_UPDATE_EVENT}/${idEvent}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    body: JSON.stringify(data),
  });
}

export async function UploadImage(image, token) {
  const formData = new FormData();
  formData.append("file", image);

  return await fetch(URL_UPLOAD_IMAGE, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}
