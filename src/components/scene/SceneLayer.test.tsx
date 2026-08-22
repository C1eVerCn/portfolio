import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SceneLayer } from "./SceneLayer";

vi.mock("next/dynamic", () => ({
  default: () => function SceneCanvasMock() {
    return <div data-testid="scene-canvas" />;
  },
}));

describe("SceneLayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("releases its probe context before activating the real canvas", async () => {
    const loseContext = vi.fn();
    const getExtension = vi.fn(() => ({ loseContext }));
    const context = { getExtension } as unknown as WebGL2RenderingContext;

    Object.defineProperty(window, "WebGLRenderingContext", {
      configurable: true,
      value: function WebGLRenderingContextMock() {},
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      ((contextId: string) => contextId === "webgl2" ? context : null) as typeof HTMLCanvasElement.prototype.getContext,
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    const { container, getByTestId } = render(<SceneLayer />);

    await waitFor(() => {
      expect(container.querySelector(".paper-scene-layer")).toHaveAttribute("data-webgl", "active");
    });
    expect(getExtension).toHaveBeenCalledWith("WEBGL_lose_context");
    expect(loseContext).toHaveBeenCalledOnce();
    expect(getByTestId("scene-canvas")).toBeInTheDocument();
  });

  it("reacts to reduced-motion changes and cleans up the modern listener", async () => {
    let reduced = false;
    const listeners = new Set<(event: { matches: boolean }) => void>();
    const media = {
      get matches() { return reduced; },
      addEventListener: vi.fn((_type: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener)),
      removeEventListener: vi.fn((_type: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener)),
    };
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn(() => media) });
    Object.defineProperty(window, "WebGLRenderingContext", { configurable: true, value: function WebGLRenderingContextMock() {} });
    const loseContext = vi.fn();
    const context = { getExtension: vi.fn(() => ({ loseContext })) } as unknown as WebGL2RenderingContext;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      ((contextId: string) => contextId === "webgl2" ? context : null) as typeof HTMLCanvasElement.prototype.getContext,
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { callback(0); return 1; });

    const view = render(<SceneLayer />);
    await waitFor(() => expect(view.getByTestId("scene-canvas")).toBeInTheDocument());

    act(() => {
      reduced = true;
      for (const listener of listeners) listener({ matches: true });
    });
    expect(view.queryByTestId("scene-canvas")).not.toBeInTheDocument();
    expect(view.container.querySelector(".paper-scene-layer")).toHaveAttribute("data-webgl", "fallback");

    act(() => {
      reduced = false;
      for (const listener of listeners) listener({ matches: false });
    });
    await waitFor(() => expect(view.getByTestId("scene-canvas")).toBeInTheDocument());
    expect(loseContext).toHaveBeenCalledTimes(2);

    view.unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(listeners.size).toBe(0);
  });

  it("uses symmetric legacy reduced-motion listener cleanup", () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true, addListener, removeListener })),
    });

    const view = render(<SceneLayer />);
    expect(addListener).toHaveBeenCalledWith(expect.any(Function));
    view.unmount();
    expect(removeListener).toHaveBeenCalledWith(expect.any(Function));
  });
});
