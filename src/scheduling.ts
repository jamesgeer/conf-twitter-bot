export interface SchedulingConfig {
  nextDate: Date;
  everyNDays: number;

  /** in minutes since midnight, UTC */
  earliestTime: number;

  /** in minutes since midnight, UTC */
  latestTime: number;
}

export interface SchedulingConfigJson {
  nextDate: string;
  everyNDays: number;

  /** in minutes since midnight, UTC */
  earliestTime: number;

  /** in minutes since midnight, UTC */
  latestTime: number;
}

export function afterNDays(aDate: Date, nDays: number): Date {
  const nextDate = new Date(aDate);
  nextDate.setDate(aDate.getDate() + nDays);
  return nextDate;
}

export function hourMinuteStrToMinutesSinceMidnightUTC(str: string): number {
  const parts = str.split(':');
  if (parts.length !== 2) {
    return 0;
  }

  const hoursAsMinutes = Number(parts[0]) * 60;
  const minutes = Number(parts[1]);

  const d = new Date();
  d.setMinutes(0);
  d.setHours(0);
  d.setMinutes(hoursAsMinutes + minutes);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function getRandomMinute(min: number, max: number): number {
  const diff = max - min;
  const minutes = (Math.random() * diff) + min;
  return minutes;
}

export function isBetweenMinutesUTC(minutesUTC: number, minUTC: number, maxUTC: number): boolean {
  return minUTC <= minutesUTC && minutesUTC <= maxUTC;
}

export function isWithinScheduleParameters(expectedDate: Date, actualDate: Date, config: SchedulingConfig): boolean {
  return expectedDate.getUTCFullYear() === actualDate.getUTCFullYear()
        && expectedDate.getUTCMonth() === actualDate.getUTCMonth()
        && expectedDate.getUTCDate() === actualDate.getUTCDate()
        && isBetweenMinutesUTC(actualDate.getUTCMinutes(), config.earliestTime, config.latestTime);
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

export function formatDateOnly(date: Date): string {
  const month = new String(date.getMonth() + 1).padStart(2, '0');
  const day = new String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatMinutesAsHHmm(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mm = minutes % 60;
  const hoursStr = new String(hours).padStart(2, '0');
  const minutesStr = new String(mm).padStart(2, '0');
  return `${hoursStr}:${minutesStr}`;
}
