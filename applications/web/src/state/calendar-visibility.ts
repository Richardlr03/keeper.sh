import { atomWithStorage } from "jotai/utils";

const CALENDAR_VISIBILITY_STORAGE_KEY = "keeper.hidden-calendar-ids";

export const hiddenCalendarIdsAtom = atomWithStorage<string[]>(
  CALENDAR_VISIBILITY_STORAGE_KEY,
  [],
);

export function isCalendarVisible(hiddenCalendarIds: readonly string[], calendarId: string): boolean {
  return !hiddenCalendarIds.includes(calendarId);
}

export function setCalendarVisible(
  hiddenCalendarIds: readonly string[],
  calendarId: string,
  visible: boolean,
): string[] {
  if (visible) return hiddenCalendarIds.filter((id) => id !== calendarId);
  if (hiddenCalendarIds.includes(calendarId)) return [...hiddenCalendarIds];
  return [...hiddenCalendarIds, calendarId];
}

export function filterVisibleCalendarItems<T extends { calendarId: string }>(
  items: readonly T[],
  hiddenCalendarIds: readonly string[],
): T[] {
  if (hiddenCalendarIds.length === 0) return [...items];
  const hidden = new Set(hiddenCalendarIds);
  return items.filter((item) => !hidden.has(item.calendarId));
}
