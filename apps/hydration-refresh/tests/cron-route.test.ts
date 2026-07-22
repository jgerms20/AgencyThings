import { afterEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/cron/daily/route";

const originalSecret = process.env.CRON_SECRET;

afterEach(() => {
  if (originalSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = originalSecret;
});

describe("daily refresh cron", () => {
  it("fails closed when the cron secret is not configured", async () => {
    delete process.env.CRON_SECRET;
    const response = await GET(new Request("https://example.com/api/cron/daily"));
    expect(response.status).toBe(503);
  });

  it("rejects a request with the wrong secret", async () => {
    process.env.CRON_SECRET = "expected";
    const response = await GET(new Request("https://example.com/api/cron/daily", { headers: { authorization: "Bearer wrong" } }));
    expect(response.status).toBe(401);
  });
});
