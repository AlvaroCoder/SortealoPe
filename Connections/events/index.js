const URL_CREATE_EVENT = process.env.CREATE_EVENT;
const URL_GET_EVENT_BY_ID_USER = process.env.EVENT_BY_ID_USER;
const URL_GET_EVENT_BY_ID_EVENT = process.env.EVENT_BY_ID_EVENT;
const URL_GET_EVENTS_CATEGORIES = process.env.EVENT_CATEGORIES;
const URL_GET_EVENTS_PACKS = process.env.EVENTS_PACKS;
const URL_ADD_COLLECTIONS_TICKETS = process.env.ADD_COLLECTIONS_TICKETS;
const URL_UPDATE_EVENT = process.env.UPDATE_EVENT;

export async function CreateEvent(data, token) {
    return await fetch(URL_CREATE_EVENT, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authentication' : `Bearer ${token}`
        },
        mode: 'cors',
        body : JSON.stringify(data)
    })
}

export async function GetEventByIdUser(idUser, token) {
    return await fetch(`${URL_GET_EVENT_BY_ID_USER}?userId=${idUser}`, {
        method: 'GET',
        headers: {
            'Authentication' : `Bearer ${token}`
        },
        mode: 'cors'
    })
};

export async function GetEventByIdEvent(idEvent=1, token) {
    return await fetch(`${URL_GET_EVENT_BY_ID_EVENT}/${idEvent}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function GetEventCategories(token) {
    return await fetch(URL_GET_EVENTS_CATEGORIES, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function GetEventsPacks(token) {
    return await fetch(URL_GET_EVENTS_PACKS, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function AddCollectionsAndTickets(idTicket,token) {
    return await fetch(`${URL_ADD_COLLECTIONS_TICKETS}/${idTicket}`, {
        method: 'PATCH',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function UpdateEvent(data, idEvent, token) {
    return await fetch(`${URL_UPDATE_EVENT}/${idEvent}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        mode: 'cors',
        body : JSON.stringify(data)
    })
};



