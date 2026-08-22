import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  PreludeReplayProvider,
  usePreludeReplay,
} from "./PreludeReplayContext";

function ReplayConsumer() {
  const { replayPrelude, replayToken } = usePreludeReplay();

  return (
    <>
      <output aria-label="replay token">{replayToken}</output>
      <button type="button" onClick={replayPrelude}>
        Replay
      </button>
    </>
  );
}

describe("PreludeReplayContext", () => {
  it("increments the replay token when replay is requested", () => {
    render(
      <PreludeReplayProvider>
        <ReplayConsumer />
      </PreludeReplayProvider>,
    );

    expect(screen.getByLabelText("replay token")).toHaveTextContent("0");

    fireEvent.click(screen.getByRole("button", { name: "Replay" }));

    expect(screen.getByLabelText("replay token")).toHaveTextContent("1");
  });

  it("throws a clear error when used outside its provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ReplayConsumer />)).toThrow(
      "usePreludeReplay must be used within PreludeReplayProvider",
    );

    consoleError.mockRestore();
  });
});
