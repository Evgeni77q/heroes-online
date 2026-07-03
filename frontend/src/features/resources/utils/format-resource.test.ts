import { describe, expect, it } from "vitest";
import {
  formatProductionRate,
  formatResourceAmount,
} from "./format-resource";

describe("formatResourceAmount", () => {
  it("formats numbers with locale grouping", () => {
    expect(formatResourceAmount(12500)).toMatch(/12\s?500/);
    expect(formatResourceAmount(500)).toBe("500");
  });
});

describe("formatProductionRate", () => {
  it("formats production per minute", () => {
    expect(formatProductionRate(12)).toMatch(/\+12\/min/);
  });
});
