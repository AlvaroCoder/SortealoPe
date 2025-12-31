import { ENDPOINTS_LOGIN } from "@/Connections/APIURLS";
const URL_LOGIN_USER = ENDPOINTS_LOGIN.LOGIN;
const URL_REGISTER_USER = ENDPOINTS_LOGIN.REGISTER;
const URL_VERIFY_USER = ENDPOINTS_LOGIN.VERIFY;
const URL_RESEND_NOTIFICATION = ENDPOINTS_LOGIN.RESEND_NOTIFICATION;
const URL_REFRESH_TOKEN = ENDPOINTS_LOGIN.REFRESH_TOKEN;

export async function LoginUser(data) {
    return await fetch(URL_LOGIN_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export async function RegisterUser(data) {
    return await fetch(URL_REGISTER_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
};

export async function VerifyUser(data) {
    return await fetch(URL_VERIFY_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
};

export async function ResendNotification(email) {
    return await fetch(`${URL_RESEND_NOTIFICATION}?email=${email}`, {
        method: 'POST',
    })
};

export async function RefreshToken(token) {
    return await fetch(URL_REFRESH_TOKEN, {
        method: 'POST',
    })
}