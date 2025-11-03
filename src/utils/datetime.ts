// src/utils/datetime.ts
export function parseDatetimeForBackend(datetimeISO: string) {
  const date = new Date(datetimeISO);
  const start = new Date(date.getTime() - 4 * 60 * 60 * 1000); // UTC-4
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h duración
  return {
    selected_date: start.toISOString().split("T")[0],
    starting_time: start.toISOString(),
    finishing_time: end.toISOString(),
  };
}

export function formatHourForDisplay(datetimeISO: string) {
  const date = new Date(datetimeISO);
  const hour = date.getHours();
  return hour < 10 ? `0${hour}:00` : `${hour}:00`;
}