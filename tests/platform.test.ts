import { describe, expect, it } from "vitest";
import {
  assignableRoles,
  atLeast,
  can,
  canManageClass,
  canManageMember,
  canResetPassword,
  canViewStudent,
  opensEverySection,
  ORG_ROLES,
  roleChangeError,
  type OrgAction,
  type OrgRole,
} from "@/lib/auth/permissions";
import { formatCode, hashToken, invitationState, newJoinCode, newToken, normaliseCode, slugify } from "@/lib/org/codes";
import { allowed, nextWindow, POLICIES, retryIn } from "@/lib/security/limits";
import { safeNext } from "@/lib/auth/redirect";
import { chapterMastery, csvLine, examTable, gradebookHeader, gradebookRow, hardestSections, misconceptionTable } from "@/lib/analytics";
import { fillDays } from "@/lib/org/days";
import { AUDIT_LABEL, auditLabel } from "@/lib/auditLabels";
import { allNodes, course } from "@/lib/content";

describe("permissions", () => {
  it("ranks roles", () => {
    expect(atLeast("OWNER", "ADMIN")).toBe(true);
    expect(atLeast("ADMIN", "OWNER")).toBe(false);
    expect(atLeast("TEACHER", "TEACHER")).toBe(true);
    expect(atLeast("STUDENT", "TEACHER")).toBe(false);
  });

  it("students can do nothing administrative", () => {
    const actions: OrgAction[] = ["members.view", "members.manage", "invites.manage", "classes.create", "classes.viewAll", "audit.view", "org.settings", "content.edit", "analytics.org"];
    for (const a of actions) expect(can("STUDENT", a), a).toBe(false);
  });

  it("teachers create classes and write questions, but don't manage the organisation", () => {
    expect(can("TEACHER", "classes.create")).toBe(true);
    expect(can("TEACHER", "content.edit")).toBe(true);
    for (const a of ["members.manage", "invites.manage", "audit.view", "org.settings", "classes.viewAll", "analytics.org"] as OrgAction[]) expect(can("TEACHER", a), a).toBe(false);
  });

  it("admins open every section; teachers and students follow the prerequisites", () => {
    expect(opensEverySection("OWNER", false)).toBe(true);
    expect(opensEverySection("ADMIN", false)).toBe(true);
    expect(opensEverySection("TEACHER", false)).toBe(false);
    expect(opensEverySection("STUDENT", false)).toBe(false);
    expect(opensEverySection("STUDENT", true)).toBe(true);
    expect(opensEverySection(null, true)).toBe(true);
    expect(opensEverySection(null, false)).toBe(false);
  });

  it("teachers manage only the classes they teach; admins manage all", () => {
    expect(canManageClass("TEACHER", true)).toBe(true);
    expect(canManageClass("TEACHER", false)).toBe(false);
    expect(canManageClass("ADMIN", false)).toBe(true);
    expect(canManageClass("STUDENT", true)).toBe(false);
    expect(canViewStudent("TEACHER", false)).toBe(false);
    expect(canViewStudent("TEACHER", true)).toBe(true);
    expect(canViewStudent("OWNER", false)).toBe(true);
  });

  it("only someone ranked above may manage a member; nobody manages themselves", () => {
    expect(canManageMember("ADMIN", "TEACHER", false)).toBe(true);
    expect(canManageMember("ADMIN", "ADMIN", false)).toBe(false);
    expect(canManageMember("ADMIN", "OWNER", false)).toBe(false);
    expect(canManageMember("OWNER", "OWNER", false)).toBe(true);
    expect(canManageMember("TEACHER", "STUDENT", false)).toBe(false);
    for (const r of ORG_ROLES) expect(canManageMember(r, r, true)).toBe(false);
  });

  it("teachers reset passwords only for students in their classes", () => {
    expect(canResetPassword("TEACHER", "STUDENT", false, true)).toBe(true);
    expect(canResetPassword("TEACHER", "STUDENT", false, false)).toBe(false);
    expect(canResetPassword("TEACHER", "TEACHER", false, true)).toBe(false);
    expect(canResetPassword("ADMIN", "STUDENT", false, false)).toBe(true);
    expect(canResetPassword("ADMIN", "ADMIN", false, false)).toBe(false);
  });

  it("admins can't mint owners or admins", () => {
    expect(assignableRoles("ADMIN")).toEqual(["TEACHER", "STUDENT"]);
    expect(assignableRoles("OWNER")).toEqual(ORG_ROLES);
    expect(assignableRoles("TEACHER")).toEqual([]);
  });

  it("role changes keep at least one owner and respect rank", () => {
    const base = { self: false, owners: 2 };
    expect(roleChangeError({ ...base, actor: "OWNER", target: "STUDENT", next: "ADMIN" })).toBeNull();
    expect(roleChangeError({ ...base, actor: "ADMIN", target: "STUDENT", next: "ADMIN" })).toMatch(/can't make/);
    expect(roleChangeError({ ...base, actor: "ADMIN", target: "ADMIN", next: "STUDENT" })).toMatch(/permission/);
    expect(roleChangeError({ actor: "OWNER", target: "OWNER", next: "ADMIN", self: false, owners: 1 })).toMatch(/at least one owner/);
    expect(roleChangeError({ actor: "OWNER", target: "OWNER", next: "ADMIN", self: false, owners: 2 })).toBeNull();
    expect(roleChangeError({ actor: "OWNER", target: "OWNER", next: "ADMIN", self: true, owners: 3 })).toMatch(/own role/);
  });

  it("every role pair is covered without throwing", () => {
    for (const a of ORG_ROLES) for (const t of ORG_ROLES) for (const n of ORG_ROLES as (OrgRole | null)[]) roleChangeError({ actor: a, target: t, next: n, self: false, owners: 1 });
  });
});

describe("join codes and tokens", () => {
  it("codes are 6 characters with no look-alikes", () => {
    for (let i = 0; i < 500; i++) {
      const c = newJoinCode();
      expect(c).toMatch(/^[A-HJKMNP-Z2-9]{6}$/);
    }
  });

  it("typed codes normalise", () => {
    expect(normaliseCode(" k7q-4mz ")).toBe("K7Q4MZ");
    expect(normaliseCode("k7q 4mz")).toBe("K7Q4MZ");
    expect(formatCode("K7Q4MZ")).toBe("K7Q-4MZ");
    expect(normaliseCode(formatCode("ABC234"))).toBe("ABC234");
  });

  it("tokens are long, unique and stored only as hashes", () => {
    const a = newToken();
    const b = newToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(32);
    expect(hashToken(a)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(a)).toBe(hashToken(a));
    expect(hashToken(a)).not.toBe(a);
  });

  it("slugs are URL-safe", () => {
    expect(slugify("St. Xavier's Academy")).toBe("st-xaviers-academy");
    expect(slugify("  Café Élite  ")).toBe("cafe-elite");
    expect(slugify("!!!")).toBe("org");
    expect(slugify("a".repeat(100)).length).toBeLessThanOrEqual(40);
  });

  it("invitation state", () => {
    const now = new Date("2026-10-19T12:00:00Z");
    const later = new Date("2026-10-20T12:00:00Z");
    const earlier = new Date("2026-10-18T12:00:00Z");
    expect(invitationState({ expiresAt: later, revokedAt: null, uses: 0, maxUses: 1 }, now)).toBe("active");
    expect(invitationState({ expiresAt: earlier, revokedAt: null, uses: 0, maxUses: 1 }, now)).toBe("expired");
    expect(invitationState({ expiresAt: later, revokedAt: null, uses: 1, maxUses: 1 }, now)).toBe("used");
    expect(invitationState({ expiresAt: later, revokedAt: earlier, uses: 0, maxUses: 5 }, now)).toBe("revoked");
  });
});

describe("rate limit windows", () => {
  const p = { limit: 3, windowSec: 60 };
  it("counts within a window and resets after it", () => {
    const t0 = new Date("2026-10-19T12:00:00Z");
    let w = nextWindow(null, p, t0);
    expect(w.count).toBe(1);
    w = nextWindow(w, p, new Date(t0.getTime() + 10_000));
    w = nextWindow(w, p, new Date(t0.getTime() + 20_000));
    expect(w.count).toBe(3);
    expect(allowed(w, p)).toBe(true);
    w = nextWindow(w, p, new Date(t0.getTime() + 30_000));
    expect(allowed(w, p)).toBe(false);
    expect(retryIn(w, new Date(t0.getTime() + 30_000))).toBe("1 minute");
    w = nextWindow(w, p, new Date(t0.getTime() + 61_000));
    expect(w.count).toBe(1);
  });

  it("policies are sane", () => {
    for (const [name, pol] of Object.entries(POLICIES)) {
      expect(pol.limit, name).toBeGreaterThan(0);
      expect(pol.windowSec, name).toBeGreaterThanOrEqual(60);
    }
  });
});

describe("safe redirects", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/join/abc")).toBe("/join/abc");
    expect(safeNext("/learn?x=1")).toBe("/learn?x=1");
  });
  it("rejects anything that could leave the site", () => {
    for (const bad of ["//evil.com", "/\\evil.com", "https://evil.com", "evil.com", "javascript:alert(1)", "/\u0000x", "", null, 42]) expect(safeNext(bad)).toBe("/learn");
  });
});

describe("analytics", () => {
  const u = course.units[0];
  it("chapter mastery averages over students and sections", () => {
    const counts = [
      { nodeId: u.nodes[0].id, status: "SOLID" as const, n: 2 },
      { nodeId: u.nodes[1].id, status: "LANDED" as const, n: 2 },
    ];
    const rows = chapterMastery(counts, 2);
    expect(rows).toHaveLength(course.units.length);
    expect(rows[0].chapter).toBe(1);
    expect(rows[0].learned).toBeCloseTo(4 / (2 * u.nodes.length));
    expect(rows[0].mastered).toBeCloseTo(2 / (2 * u.nodes.length));
    expect(rows[1].learned).toBe(0);
    expect(chapterMastery([], 0).every((r) => r.learned === 0)).toBe(true);
  });

  it("hardest sections need enough answers and sort by accuracy", () => {
    const rows = hardestSections([
      { nodeId: u.nodes[0].id, correct: 5, total: 50 },
      { nodeId: u.nodes[1].id, correct: 1, total: 5 },
      { nodeId: u.nodes[2].id, correct: 30, total: 40 },
      { nodeId: "no-such-section", correct: 0, total: 100 },
    ]);
    expect(rows.map((r) => r.nodeId)).toEqual([u.nodes[0].id, u.nodes[2].id]);
  });

  it("misconception table drops unknown ids", () => {
    const node = allNodes.find((n) => Object.keys(n.misconceptions).length > 0)!;
    const mis = Object.keys(node.misconceptions)[0];
    const t = misconceptionTable([
      { nodeId: node.id, misconceptionId: mis, n: 3 },
      { nodeId: node.id, misconceptionId: "nope", n: 9 },
    ]);
    expect(t).toHaveLength(1);
    expect(t[0].students).toBe(3);
  });

  it("tests sort in syllabus order with the mock last", () => {
    const t = examTable([
      { scope: "mock", attempts: 1, takers: 1, mean: 0.5, best: 0.5 },
      { scope: course.units[1].id, attempts: 1, takers: 1, mean: 0.5, best: 0.5 },
      { scope: course.units[0].id, attempts: 1, takers: 1, mean: 0.5, best: 0.5 },
    ]);
    expect(t.map((r) => r.scope)).toEqual([course.units[0].id, course.units[1].id, "mock"]);
  });

  it("gradebook rows line up with the header", () => {
    const row = gradebookRow({
      name: "A",
      email: "a@x.test",
      classes: ["One", "Two"],
      lastActiveOn: "2026-10-01",
      streakDays: 3,
      progress: [{ nodeId: u.nodes[0].id, status: "SOLID", misconceptionId: null }],
      exams: [
        { scope: "mock", score: 3, total: 4 },
        { scope: "mock", score: 1, total: 4 },
      ],
    });
    expect(row).toHaveLength(gradebookHeader().length);
    expect(row[5]).toBe("1");
    expect(row[7]).toBe(`1/${u.nodes.length}`);
    expect(row[row.length - 1]).toBe("50");
  });
});

describe("CSV", () => {
  it("quotes and escapes", () => {
    expect(csvLine(["a", "b,c", 'say "hi"', "x\ny"])).toBe('a,"b,c","say ""hi""","x\ny"\r\n');
  });
  it("defuses spreadsheet formulas", () => {
    expect(csvLine(["=HYPERLINK(1)"])).toBe("'=HYPERLINK(1)\r\n");
    expect(csvLine(["+1", "-2", "@x"])).toBe("'+1,'-2,'@x\r\n");
    expect(csvLine(["=1,2"])).toBe(`"'=1,2"\r\n`);
  });
});

describe("activity days", () => {
  it("fills missing days with zeros, oldest first", () => {
    const today = new Date("2026-10-19T08:00:00Z");
    const rows = fillDays([{ day: "2026-10-18", answers: 5, learners: 2 }], 3, today);
    expect(rows).toEqual([
      { day: "2026-10-17", answers: 0, learners: 0 },
      { day: "2026-10-18", answers: 5, learners: 2 },
      { day: "2026-10-19", answers: 0, learners: 0 },
    ]);
  });
});

describe("audit labels", () => {
  it("every action has a human label", () => {
    for (const [k, v] of Object.entries(AUDIT_LABEL)) {
      expect(k).toMatch(/^[a-z]+\.[a-z_]+$/);
      expect(v.length).toBeGreaterThan(5);
    }
    expect(auditLabel("unknown.thing")).toBe("unknown.thing");
  });
});
