const URL_CREATE_USER = process.env.CREATE_USER;
const URL_GET_ALL_USERS = process.env.GET_ALL_USERS;
const URL_UPDATE_USERS = process.env.UPDATE_USERS;

export async function CreateUser(data) {
    return await fetch(URL_CREATE_USER, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        mode: 'cors',
        body : JSON.stringify(data)
    })
};

export async function GetAllUsers() {
    return await fetch(URL_GET_ALL_USERS, {
        method: 'GET',
        mode : 'cors'
    })
};

export async function UpdateUser(data) {
    return await fetch(URL_UPDATE_USERS, {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        mode: 'cors',
        body : data
    })
};
