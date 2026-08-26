import { describe, it, expect } from "vitest";
import { isAdmin, adminEmails } from "@/lib/admin";

describe("isAdmin", () => {
  it("admits nobody when the list is unset", () => {
    // The important direction: a missing environment variable must not open
    // the question bank to everyone who is signed in.
    expect(isAdmin("someone@example.com", undefined)).toBe(false);
    expect(isAdmin("someone@example.com", "")).toBe(false);
    expect(isAdmin("someone@example.com", "  ,  ")).toBe(false);
  });

  it("admits a listed address", () => {
    expect(isAdmin("owner@example.com", "owner@example.com")).toBe(true);
  });

  it("ignores case and surrounding spaces on both sides", () => {
    expect(isAdmin(" Owner@Example.COM ", "owner@example.com")).toBe(true);
    expect(isAdmin("owner@example.com", " OWNER@EXAMPLE.COM ")).toBe(true);
  });

  it("reads a comma-separated list", () => {
    expect(isAdmin("second@example.com", "first@example.com, second@example.com")).toBe(true);
    expect(isAdmin("third@example.com", "first@example.com, second@example.com")).toBe(false);
  });

  it("refuses a missing address even when a list exists", () => {
    expect(isAdmin(null, "owner@example.com")).toBe(false);
    expect(isAdmin(undefined, "owner@example.com")).toBe(false);
    expect(isAdmin("", "owner@example.com")).toBe(false);
  });

  it("does not treat a partial match as a match", () => {
    expect(isAdmin("owner@example.com.attacker.net", "owner@example.com")).toBe(false);
    expect(isAdmin("notowner@example.com", "owner@example.com")).toBe(false);
  });
});

describe("adminEmails", () => {
  it("drops blank entries", () => {
    expect(adminEmails("a@b.com,,  , c@d.com")).toEqual(["a@b.com", "c@d.com"]);
  });
});
