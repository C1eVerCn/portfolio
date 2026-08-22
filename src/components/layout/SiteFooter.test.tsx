import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("closes with the real profile byline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-06-15T12:00:00Z"));
    render(<SiteFooter content={zhContent} />);

    expect(screen.getByText(zhContent.footer)).toBeInTheDocument();
    expect(screen.getByText(`© 2026 · ${zhContent.profile.englishName}`)).toBeInTheDocument();
    expect(screen.queryByText(/Fine/)).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
