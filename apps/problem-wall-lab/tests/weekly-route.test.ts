import { afterEach, describe, expect, it, vi } from "vitest";

const runWeeklyRefresh = vi.fn(async () => ({
  weekOf: "2026-07-13", refreshedAt: "2026-07-13T12:00:00Z", mode: "demo",
  persistenceErrors: [], refresh: { signals: [], sourcesAttempted: 0, sourcesSucceeded: 0, failures: [], refreshedAt: "2026-07-13T12:00:00Z" }, candidates: []
}));

vi.mock("../src/lib/weekly-refresh", () => ({ runWeeklyRefresh }));

afterEach(() => { delete process.env.CRON_SECRET; runWeeklyRefresh.mockClear(); });

describe("weekly refresh route", () => {
  it("protects cron GET when configured and lets manual POST use the shared runner", async () => {
    process.env.CRON_SECRET = "secret";
    const { GET, POST } = await import("../src/app/api/weekly-refresh/route");
    const denied = await GET(new Request("http://localhost/api/weekly-refresh", { headers: { authorization: "Bearer wrong" } }));
    expect(denied.status).toBe(401);
    expect(runWeeklyRefresh).not.toHaveBeenCalled();

    const allowed = await GET(new Request("http://localhost/api/weekly-refresh", { headers: { authorization: "Bearer secret" } }));
    expect(allowed.status).toBe(200);
    await POST();
    expect(runWeeklyRefresh).toHaveBeenCalledTimes(2);
  });
});
