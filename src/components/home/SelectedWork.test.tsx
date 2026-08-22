import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import { SelectedWork } from "./SelectedWork";

describe("SelectedWork", () => {
  it("renders two distinct project movements with their real product views", () => {
    const { container } = render(<SelectedWork content={zhContent} locale="zh" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/zh/work/hermes");
    expect(links[1]).toHaveAttribute("href", "/zh/work/bhms");

    const hermesMovement = container.querySelector(".hermes-home-movement");
    expect(hermesMovement).not.toBeNull();
    expect(
      within(hermesMovement as HTMLElement).getByRole("heading", {
        level: 3,
        name: zhContent.projects[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      within(hermesMovement as HTMLElement).getByRole("heading", {
        level: 4,
        name: "Hermes · Feishu Agent",
      }),
    ).toBeInTheDocument();
    expect(
      within(hermesMovement as HTMLElement).getByRole("heading", {
        level: 5,
        name: "dry-run 通过",
      }),
    ).toBeInTheDocument();
    expect(hermesMovement?.querySelector(".feishu-product-plate")).toBeInTheDocument();
    expect(hermesMovement?.querySelectorAll("[data-hermes-layer]")).toHaveLength(7);

    const bhmsMovement = container.querySelector(".bhms-home-movement");
    expect(bhmsMovement).not.toBeNull();
    expect(
      within(bhmsMovement as HTMLElement).getByRole("heading", {
        level: 3,
        name: zhContent.projects[1].title,
      }),
    ).toBeInTheDocument();
    expect(
      within(bhmsMovement as HTMLElement).getByRole("heading", {
        level: 4,
        name: "CALCE-CS2-35",
      }),
    ).toBeInTheDocument();
    expect(
      within(bhmsMovement as HTMLElement).getByRole("heading", {
        level: 5,
        name: "容量退化趋势",
      }),
    ).toBeInTheDocument();
    expect(bhmsMovement?.querySelector(".bhms-workspace-plate")).toBeInTheDocument();
    expect(bhmsMovement?.querySelectorAll("[data-evidence-node]")).toHaveLength(5);

    expect(
      screen.getByRole("link", {
        name: `${zhContent.workIntro.openCase}: ${zhContent.projects[0].title}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `${zhContent.workIntro.openCase}: ${zhContent.projects[1].title}`,
      }),
    ).toBeInTheDocument();

    expect(container.querySelectorAll("[data-movement]")).toHaveLength(2);
    expect(container.querySelector(".movement-notation")).not.toBeInTheDocument();
    expect(container.querySelector(".score-movements")).not.toBeInTheDocument();
    expect(container.querySelector(".project-shell")).not.toBeInTheDocument();
  });

  it.each(["hermes", "bhms"] as const)(
    "renders nothing when the %s project is missing",
    (missingSlug) => {
      const content = {
        ...zhContent,
        projects: zhContent.projects.filter(
          (project) => project.slug !== missingSlug,
        ),
      };

      const { container } = render(
        <SelectedWork content={content} locale="zh" />,
      );

      expect(container).toBeEmptyDOMElement();
      expect(container.querySelector("#work")).not.toBeInTheDocument();
    },
  );
});
