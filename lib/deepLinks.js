import * as Linking from "expo-linking";

/**
 * Genera la URL de reclamación de tickets para el QR.
 *
 * En desarrollo (Expo Go): exp://192.168.1.x:8081/--/tickets/claim?reservationCode=...
 * En producción (standalone): sortealope://tickets/claim?reservationCode=...
 *
 * Usar siempre esta función en lugar de construir la URL manualmente,
 * para garantizar que el deep link funcione en ambos entornos.
 *
 * @param {string} reservationCode - El UUID de la reserva (reservation.id del backend)
 * @returns {string} URL completa del deep link
 */
export function createTicketClaimURL(reservationCode) {
  return Linking.createURL("tickets/claim", {
    queryParams: { reservationCode },
  });
}
