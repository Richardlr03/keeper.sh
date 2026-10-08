import { describe, expect, it } from "vitest";
import {
  filterVisibleCalendarItems,
  isCalendarVisible,
  setCalendarVisible,
} from "../../src/state/calendar-visibility";

describe("calendar visibility", () => {
  it("shows calendars by default", () => {
    expect(isCalendarVisible([], "calendar-a")).toBe(true);
  });

  it("hides and shows one calendar without changing the others", () => {
    const hidden = setCalendarVisible(["calendar-a"], "calendar-b", false);
    expect(hidden).toEqual(["calendar-a", "calendar-b"]);
    expect(setCalendarVisible(hidden, "calendar-a", true)).toEqual(["calendar-b"]);
  });

  it("filters items by calendar id", () => {
    const events = [
      { id: "event-a", calendarId: "calendar-a" },
      { id: "event-b", calendarId: "calendar-b" },
    ];

    expect(filterVisibleCalendarItems(events, ["calendar-a"])).toEqual([events[1]]);
  });
});
