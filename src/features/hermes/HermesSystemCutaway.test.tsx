import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HermesArchitecture } from "./HermesArchitecture";
import { HermesSystemCutaway } from "./HermesSystemCutaway";

describe("HermesSystemCutaway", () => {
  it("renders all seven architecture layers and explicit ACL permissions", () => {
    const { container } = render(<HermesSystemCutaway locale="zh" />);

    expect(container.querySelectorAll("[data-hermes-layer]")).toHaveLength(7);
    expect(screen.getByText("ACL Guard")).toBeInTheDocument();
    expect(screen.getByText(/五角色显式权限/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Feishu WebSocket" }),
    ).toBeInTheDocument();
  });

  it("selects a layer and updates its live detail panel", () => {
    const { container } = render(<HermesSystemCutaway locale="zh" />);
    const websocket = screen.getByRole("button", { name: /Feishu WebSocket/ });
    const acl = screen.getByRole("button", { name: /ACL Guard/ });

    expect(websocket).toHaveAttribute("aria-pressed", "true");
    expect(acl).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(acl);

    expect(websocket).toHaveAttribute("aria-pressed", "false");
    expect(acl).toHaveAttribute("aria-pressed", "true");
    const detail = container.querySelector(".hermes-layer-detail");
    expect(detail).not.toBeNull();
    expect(within(detail as HTMLElement).getByText("ACL Guard")).toBeInTheDocument();
    expect(within(detail as HTMLElement).getByText(/五角色显式权限/)).toBeInTheDocument();
  });

  it("powers the public architecture wrapper with the same seven layers", () => {
    const { container } = render(<HermesArchitecture locale="en" />);

    expect(container.querySelectorAll("[data-hermes-layer]")).toHaveLength(7);
  });

  it("keeps all compact layer controls and the selected detail while hiding per-node detail", () => {
    const { container } = render(<HermesSystemCutaway locale="en" compact />);

    expect(container.querySelectorAll("[data-hermes-layer]")).toHaveLength(7);
    expect(container.querySelectorAll("[data-hermes-layer] strong")).toHaveLength(7);
    expect(container.querySelectorAll("[data-hermes-layer] span")).toHaveLength(0);
    expect(container.querySelector(".hermes-layer-detail")).toHaveTextContent(
      "Push delivery without a public callback endpoint.",
    );
  });
});
