import { describe, expect, it } from "vitest";
import { hermesArchitectureLayers, hermesProductScenario } from "./portfolio-data";

describe("Hermes anonymized portfolio data", () => {
  it("preserves the verified architecture layer order", () => {
    expect(hermesArchitectureLayers.map((layer) => layer.id)).toEqual([
      "websocket",
      "dedup-queue",
      "routing",
      "agent-mcp",
      "acl",
      "ocl",
      "commit",
    ]);
  });

  it("uses an anonymized booking scenario", () => {
    expect(hermesProductScenario.vehicle).toBe("E-17");
    expect(hermesProductScenario.user).toBe("飞书用户 A");
    expect(JSON.stringify(hermesProductScenario)).not.toMatch(
      /@163\.com|open_id|19943221833/,
    );
    expect(hermesProductScenario.start).toBe("2026-08-04 09:00");
    expect(hermesProductScenario.end).toBe("2026-08-04 11:00");
  });

  it("states that identity data is injected by the server", () => {
    expect(hermesProductScenario.securityBoundary).toMatch(/服务端.*注入/);
  });
});
