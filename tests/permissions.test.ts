import { describe, it, expect } from "vitest";
import { StaffPermission } from "@prisma/client";
import {
  ALL_PERMISSIONS,
  NOBODY,
  owner,
  can,
  held,
  grantable,
  refuseGrant,
  normalise,
} from "@/lib/permissions";

const { HOST_COMPETITIONS, MANAGE_QUESTIONS, MANAGE_ADMINS } = StaffPermission;
const staff = (...permissions: StaffPermission[]) => ({ isOwner: false, permissions });

describe("can", () => {
  it("gives the owner everything", () => {
    for (const p of ALL_PERMISSIONS) expect(can(owner(), p)).toBe(true);
  });

  it("gives a signed-in stranger nothing", () => {
    for (const p of ALL_PERMISSIONS) expect(can(NOBODY, p)).toBe(false);
  });

  it("gives an admin only what they hold", () => {
    const a = staff(HOST_COMPETITIONS);
    expect(can(a, HOST_COMPETITIONS)).toBe(true);
    expect(can(a, MANAGE_QUESTIONS)).toBe(false);
  });
});

describe("grantable", () => {
  it("is nothing without the right to manage admins", () => {
    expect(grantable(staff(HOST_COMPETITIONS, MANAGE_QUESTIONS))).toEqual([]);
  });

  it("never exceeds what the granter holds", () => {
    // The core rule: an admin who can appoint admins still cannot hand out a
    // right they do not have.
    expect(grantable(staff(MANAGE_ADMINS, HOST_COMPETITIONS))).toEqual([
      HOST_COMPETITIONS,
      MANAGE_ADMINS,
    ]);
  });

  it("is everything for the owner", () => {
    expect(grantable(owner())).toEqual(ALL_PERMISSIONS);
  });
});

describe("refuseGrant", () => {
  const other = { isSelf: false, isOwner: false };

  it("refuses anyone who cannot manage admins", () => {
    expect(refuseGrant(staff(HOST_COMPETITIONS), [HOST_COMPETITIONS], other)).toBe("not-allowed");
    expect(refuseGrant(NOBODY, [], other)).toBe("not-allowed");
  });

  it("allows granting a right the actor holds", () => {
    expect(refuseGrant(staff(MANAGE_ADMINS, MANAGE_QUESTIONS), [MANAGE_QUESTIONS], other)).toBeNull();
  });

  it("refuses granting a right the actor lacks", () => {
    // Privilege escalation, the thing this whole module exists to stop.
    expect(refuseGrant(staff(MANAGE_ADMINS), [MANAGE_QUESTIONS], other)).toBe("beyond-your-rights");
  });

  it("refuses an admin promoting themselves", () => {
    expect(
      refuseGrant(staff(MANAGE_ADMINS), [MANAGE_ADMINS], { isSelf: true, isOwner: false })
    ).toBe("cannot-change-self");
  });

  it("refuses touching the owner, even by the owner", () => {
    expect(refuseGrant(owner(), [], { isSelf: false, isOwner: true })).toBe("cannot-change-owner");
    expect(refuseGrant(owner(), [], { isSelf: true, isOwner: true })).toBe("cannot-change-owner");
  });

  it("lets the owner edit anyone else, including themselves as staff", () => {
    expect(refuseGrant(owner(), ALL_PERMISSIONS, other)).toBeNull();
    expect(refuseGrant(owner(), [MANAGE_QUESTIONS], { isSelf: true, isOwner: false })).toBeNull();
  });

  it("allows revoking everything from another admin", () => {
    expect(refuseGrant(staff(MANAGE_ADMINS), [], other)).toBeNull();
  });
});

describe("normalise", () => {
  it("drops anything that is not a real permission", () => {
    expect(normalise(["MANAGE_QUESTIONS", "BE_KING", 7, null])).toEqual([MANAGE_QUESTIONS]);
  });

  it("removes repeats and fixes the order", () => {
    expect(normalise([MANAGE_ADMINS, HOST_COMPETITIONS, MANAGE_ADMINS])).toEqual([
      HOST_COMPETITIONS,
      MANAGE_ADMINS,
    ]);
  });

  it("returns nothing for anything that is not a list", () => {
    expect(normalise(null)).toEqual([]);
    expect(normalise("MANAGE_ADMINS")).toEqual([]);
  });
});

describe("held", () => {
  it("reports an admin's rights in a stable order", () => {
    expect(held(staff(MANAGE_ADMINS, HOST_COMPETITIONS))).toEqual([
      HOST_COMPETITIONS,
      MANAGE_ADMINS,
    ]);
  });
});
