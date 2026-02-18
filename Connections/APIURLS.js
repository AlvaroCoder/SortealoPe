export const BASE_URL = "http://192.168.1.102:8087/api/v1";

export const ENDPOINTS_LOGIN = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  VERIFY: `${BASE_URL}/auth/verify`,
  RESEND_NOTIFICATION: `${BASE_URL}/auth/resend`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
};

export const ENDPOINTS_EVENTS = {
  GET_EVENTS_BY_ID: `${BASE_URL}/events?userId=`,
  GET_PACKS_EVENT: `${BASE_URL}/events/packs`,
  CREATE_EVENT: `${BASE_URL}/events`,
};
