export function afterNDays(aDate: Date, nDays: number): Date {
  const nextDate = new Date(aDate);
  nextDate.setDate(aDate.getDate() + nDays);
  return nextDate;
}

export function hourMinuteStrToMinutesSinceMidnight(str: string): number {
  const parts = str.split(':');
  console.assert(parts.length === 2);

  const hoursAsMinutes = Number(parts[0]) * 60;
  const minutes = Number(parts[1]);
  return hoursAsMinutes + minutes;
}

export function getRandomMinute(min: number, max: number): number {
  const diff = max - min;
  const minutes = (Math.random() * diff) + min;
  return minutes;
}

export function formatDateStrWithTime(dateStr: string): string {
  const date = new Date(dateStr);
  return formatDateWithTime(date);
}

export function formatDateWithTime(date: Date): string {
  const month = new String(date.getMonth() + 1).padStart(2, '0');
  const day = new String(date.getDate()).padStart(2, '0');
  const hours = new String(date.getHours()).padStart(2, '0');
  const minutes = new String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
}
