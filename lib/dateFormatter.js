export function useDateFormatter() {
  const formatDateToSpanish = (dateString, options = {}) => {
    const { includeTime = false } = options;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let formattedDate = `${day} de ${month}, ${year}`;

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      formattedDate += ` a las ${hours}:${minutes}`;
    }

    return formattedDate;
  };

  return { formatDateToSpanish };
}

export const formatterDateToISO = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
