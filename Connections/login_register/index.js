import { ENDPOINTS_LOGIN } from "@/Connections/APIURLS";

const {
  LOGIN,
  REGISTER,
  VERIFY,
  RESEND_NOTIFICATION,
  REFRESH_TOKEN,
  GOOGLE_AUTH,
  FORGOT_PASSWORD,
} = ENDPOINTS_LOGIN;

export async function LoginUser(data) {
  return await fetch(LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function RegisterUser(data) {
  return await fetch(REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function VerifyUser(data) {
  return await fetch(VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function ResendNotification(email) {
  return await fetch(`${RESEND_NOTIFICATION}?email=${email}`, {
    method: "POST",
  });
}

export async function RefreshToken(token) {
  return await fetch(REFRESH_TOKEN, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function LoginWithGoogle(accessToken) {
  return await fetch(GOOGLE_AUTH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
}

export async function ForgotPassword(email) {
  return await fetch(FORGOT_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
