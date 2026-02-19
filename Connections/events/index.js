const URL_CREATE_EVENT = "http://192.168.1.102:8087/api/v1/events";
const URL_GET_EVENT_BY_ID_USER = "http://192.168.1.102:8087/api/v1/events";
const URL_GET_EVENT_BY_ID_EVENT = "http://192.168.1.102:8087/api/v1/events";
const URL_GET_EVENTS_CATEGORIES =
  "http://192.168.1.102:8087/api/v1/events/categories";
const URL_GET_EVENTS_PACKS = "http://192.168.1.102:8087/api/v1/events/packs";
const URL_ADD_COLLECTIONS_TICKETS =
  "http://192.168.1.102:8087/api/v1/events/eventTickets/2";
const URL_UPDATE_EVENT = "http://192.168.1.102:8087/api/v1/events";
const URL_UPLOAD_IMAGE = "http://192.168.1.102:8087/api/v1/images";

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
