import { describe, expect, it } from "vitest";
import { portfolioContent } from "./index";

describe("portfolio content", () => {
  it("publishes the bilingual prelude copy", () => {
    const zhContent = portfolioContent.zh;
    const enContent = portfolioContent.en;

    expect(zhContent.hero.slogan).toBe("智绘万物");
    expect(zhContent.hero.sloganEn).toBe("Intelligence Shapes Everything.");
    expect(zhContent.hero.statement).toContain("可解释、可执行、可交付");
    expect(zhContent.hero.skipPrelude).toBe("跳过序章");
    expect(zhContent.hero.replayPrelude).toBe("重播序章");

    expect(enContent.hero.slogan).toBe("Intelligence Shapes Everything.");
    expect(enContent.hero.sloganEn).toBe("智绘万物");
    expect(enContent.hero.statement).toContain("explained, executed and delivered");
    expect(enContent.hero.skipPrelude).toBe("Skip Prelude");
    expect(enContent.hero.replayPrelude).toBe("Replay Prelude");
  });

  it("keeps the three Norn threads in narrative order", () => {
    for (const content of Object.values(portfolioContent)) {
      expect(content.threads).toHaveLength(3);
      expect(content.threads.map((thread) => thread.id)).toEqual([
        "past",
        "present",
        "future",
      ]);
    }
  });

  it("keeps bilingual capability and project identifiers aligned", () => {
    const zh = portfolioContent.zh;
    const en = portfolioContent.en;

    expect(zh.capabilities.map((item) => item.id)).toEqual(
      en.capabilities.map((item) => item.id),
    );
    expect(zh.projects.map((item) => item.slug)).toEqual(
      en.projects.map((item) => item.slug),
    );
  });

  it("publishes the verified contact details", () => {
    for (const content of Object.values(portfolioContent)) {
      expect(content.profile.email).toBe("19943221833@163.com");
      expect(content.profile.github).toBe("https://github.com/C1eVerCn");
      expect(content.profile.name).toBe("谌一航");
    }
  });

  it("keeps Hermes before BHMS", () => {
    expect(portfolioContent.zh.projects.map((project) => project.slug)).toEqual([
      "hermes",
      "bhms",
    ]);
  });
});
