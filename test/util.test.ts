import { describe, expect, test } from "bun:test";
import Source from "../src/source";
import { parseOptions, parseSource } from "../src/util";

describe("parseSource", () => {
  test("returns the correct source when provided a valid source", () => {
    expect(parseSource(Source.MongoDB)).toBe(Source.MongoDB);
    expect(parseSource(Source.Redis)).toBe(Source.Redis);
    expect(parseSource(Source.MySQL)).toBe(Source.MySQL);
    expect(parseSource(Source.Postgres)).toBe(Source.Postgres);
  });

  test("throws CronyxServerError when provided an invalid source", () => {
    expect(() => parseSource("invalid")).toThrow("Unsupported source: invalid");
  });

  test("throws CronyxServerError when no source is provided", () => {
    expect(() => parseSource(undefined)).toThrow("Unsupported source: undefined");
  });
});

describe("parseOptions", () => {
  test("returns undefined when no JSON string is provided", () => {
    expect(parseOptions(undefined)).toBeUndefined();
  });

  test("returns the correct object when provided a valid JSON string", () => {
    expect(parseOptions('{"key": "value"}')).toEqual({ key: "value" });
  });

  test("throws CronyxServerError when provided an invalid JSON string", () => {
    expect(() => parseOptions("{key: value")).toThrow(`Cannot parse options: {key: value`);
  });
});
