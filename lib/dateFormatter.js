export function useDateFormatter() {
  const formatDateToSpanish = (dateString, options = {}) => {
    const { includeTime = false } = options;
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
      };
    
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let formattedDate = `${day} de ${month}, ${year}`;
    
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      formattedDate += ` a las ${hours}:${minutes}`;
    }
    
    return formattedDate;
  };

  return { formatDateToSpanish };
}
