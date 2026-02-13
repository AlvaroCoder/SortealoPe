const URL_GET_COLLECTIONS_BY_ID_EVENT = process.env.COLLECTIONS_BY_ID_EVENT;
const URL_GET_COLLECTIONS_BY_ID_COLLECTIONS = process.env.COLLECTION_BY_ID_COLLECTION;
const URL_UPDATE_SELLER_BY_ID_USER = process.env.UPDATE_SELLER_BY_ID_USER;
const URL_CREATE_COLLECTIONS = process.env.CREATE_COLLECTIONS;
const URL_CREATE_COLLECTION_BY_EXCEL = process.env.CREATE_COLLECTION_BY_EXCEL;

export async function GetCollectionsbyIdEvent(idCollection, token) {
    return await fetch(`${URL_GET_COLLECTIONS_BY_ID_EVENT}?eventId=${idCollection}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode: 'cors',
    })
};

export async function GetCollectionsByIdCollections(idCollection, token) {
    return await fetch(`${URL_GET_COLLECTIONS_BY_ID_COLLECTIONS}/${idCollection}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function UpdateSellerByUserId(idSeller, collectionCode, data, token) {
    return await fetch(`${URL_UPDATE_SELLER_BY_ID_USER}?sellerId=${idSeller}&collectionCode=${collectionCode}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors'
    })
};

export async function CreateCollections(data, token) {
    return await fetch(URL_CREATE_COLLECTIONS, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(data)
    })
};

export async function CreateCollectionByExcel(idEvent, excel, token) {
    return await fetch(`${URL_CREATE_COLLECTION_BY_EXCEL}?eventId=${idEvent}`, {
        method: 'POST',
        headers: { 
            'Authorization' : `Bearer ${token}`
        },
        body : excel
    })
};
