const URL_LOGIN_USER = process.env.LOGIN_USER;
const URL_REGISTER_USER = process.env.REGISTER_USER;
const URL_VERIFY_USER = process.env.VERIFY_USER;
const URL_RESEND_NOTIFICATION = process.env.RESEND_NOTIFICATION;
const URL_REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export async function LoginUser(data) {
    return await fetch(URL_LOGIN_USER, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
    });
};

export async function RegisterUser(data) {
    return await fetch(URL_REGISTER_USER, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        mode: 'cors',
        body : JSON.stringify(data)
    })
};

export async function VerifyUser(data) {
    return await fetch(URL_VERIFY_USER, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        mode: 'cors',
        body : JSON.stringify(data)
    })
};

export async function ResendNotification(email) {
    return await fetch(`${URL_RESEND_NOTIFICATION}?email=${email}`, {
        method: 'POST',
        mode : 'cors'
    })
};

export async function RefreshToken(token) {
    return await fetch(URL_REFRESH_TOKEN, {
        method: 'POST',
        mode : 'cors'
    })
}