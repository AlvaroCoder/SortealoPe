import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { ENDPOINTS_USERS } from "../APIURLS";

const { GET_BY_ID, UPDATE } = ENDPOINTS_USERS;

// GET /users/{id}
export async function GetUserById(userId) {
  return fetchWithAuth(`${GET_BY_ID}${userId}`);
}

// PATCH /users/{id}
export async function UpdateUser(userId, data) {
  return fetchWithAuth(`${UPDATE}${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
