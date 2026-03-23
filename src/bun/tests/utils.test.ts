import { describe, expect, test } from "bun:test";
import { timeAgo } from "../../mainview/utils";

// Note: getGreeting() depends on current time and is hard to test without
// mocking Date. applyTheme() depends on DOM (document/window).
// timeAgo() is the most valuable utility to test as it has date math.

describe("timeAgo", () => {
  function daysAgoISO(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  test("returns 'today' for current date", () => {
    expect(timeAgo(new Date().toISOString())).toBe("today");
  });

  test("returns 'today' for date string of today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(timeAgo(today)).toBe("today");
  });

  test("returns 'yesterday' for 1 day ago", () => {
    expect(timeAgo(daysAgoISO(1))).toBe("yesterday");
  });

  test("returns 'Xd ago' for 2-6 days", () => {
    expect(timeAgo(daysAgoISO(2))).toBe("2d ago");
    expect(timeAgo(daysAgoISO(3))).toBe("3d ago");
    expect(timeAgo(daysAgoISO(6))).toBe("6d ago");
  });

  test("returns 'Xw ago' for 7-27 days", () => {
    expect(timeAgo(daysAgoISO(7))).toBe("1w ago");
    expect(timeAgo(daysAgoISO(14))).toBe("2w ago");
    expect(timeAgo(daysAgoISO(20))).toBe("2w ago");
    expect(timeAgo(daysAgoISO(27))).toBe("3w ago");
  });

  test("returns 'Xmo ago' for 30-364 days", () => {
    expect(timeAgo(daysAgoISO(30))).toBe("1mo ago");
    expect(timeAgo(daysAgoISO(60))).toBe("2mo ago");
    expect(timeAgo(daysAgoISO(90))).toBe("3mo ago");
    expect(timeAgo(daysAgoISO(364))).toBe("12mo ago");
  });

  test("returns 'Xy ago' for 365+ days", () => {
    expect(timeAgo(daysAgoISO(365))).toBe("1y ago");
    expect(timeAgo(daysAgoISO(730))).toBe("2y ago");
  });

  test("handles ISO date strings", () => {
    const result = timeAgo(daysAgoISO(5));
    expect(result).toBe("5d ago");
  });

  test("handles date-only strings (YYYY-MM-DD)", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(timeAgo(today)).toBe("today");
  });
});
