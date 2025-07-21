export function getDayShortName(dateStr: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

export function isDayIncluded(dayOfWeek: string, targetDay: string): boolean {
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const parts = dayOfWeek.split(',');
  
  for (let part of parts) {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      const startIndex = dayOrder.indexOf(start);
      const endIndex = dayOrder.indexOf(end);

      if (startIndex <= endIndex) {
        const range = dayOrder.slice(startIndex, endIndex + 1);
        if (range.includes(targetDay)) return true;
      } else {
        const range = [...dayOrder.slice(startIndex), ...dayOrder.slice(0, endIndex + 1)];
        if (range.includes(targetDay)) return true;
      }
    } else if (part === targetDay) {
      return true;
    }
  }

  return false;
}
