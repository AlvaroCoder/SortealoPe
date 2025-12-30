const URL_GET_TICKETS_BY_ID_COLLECTIONS = process.env.TICKETS_ID_COLLECTIONS;
const URL_GET_TICKETS_STATUS = process.env.TICKETS_STATUS;
const URL_GET_TICKETS_BY_ID = process.env.TICKETS_BY_ID;
const URL_BOOKED_TICKET = process.env.TICKETS_BOOKE;
const URL_TICKET_CONFIRM = process.env.TICKETS_CONFIRM;
const URL_GENERATE_TICKET = process.env.TICKET_GENERATE;
const URL_RELEASE_TICKET = process.env.TICKET_RELEASE;

export async function GetTicketsByIdCollection(idCollection, token) {
    return await fetch(`${URL_GET_TICKETS_BY_ID_COLLECTIONS}?collectionId=${idCollection}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
};

export async function GetTicketsStatus(token) {
    return await fetch(URL_GET_TICKETS_STATUS, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
};

export async function GetTicketById(idTicket, token) {
    return await fetch(`${URL_GET_TICKETS_BY_ID}/${idTicket}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
};

export async function BookedTicket(buyerId, ticketCode, token) {
    return await fetch(`${URL_BOOKED_TICKET}${buyerId}&ticketCode=${ticketCode}`, {
        method: 'PATCH',
        headers: {
            'Authorization' :`Bearer ${token}`
        }
    })
};

export async function ConfirmTicket(ticketCode, token, body) {
    return await fetch(`${URL_TICKET_CONFIRM}${ticketCode}`, {
        method: 'PATCH',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(body)
    })
};

export async function GenerateTicket(ticketCode, token) {
    return await fetch(`${URL_GENERATE_TICKET}${ticketCode}`, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
    })
};

export async function ReleaseTicket(ticketCode, token) {
    return await fetch(`${URL_RELEASE_TICKET}${ticketCode}`, {
        method: 'PATCH',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
};
