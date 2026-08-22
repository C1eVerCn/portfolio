"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PreludeReplayContextValue {
  replayToken: number;
  replayPrelude(): void;
}

const PreludeReplayContext = createContext<
  PreludeReplayContextValue | undefined
>(undefined);

export function PreludeReplayProvider({ children }: { children: ReactNode }) {
  const [replayToken, setReplayToken] = useState(0);
  const replayPrelude = useCallback(() => {
    setReplayToken((token) => token + 1);
  }, []);
  const value = useMemo(
    () => ({ replayPrelude, replayToken }),
    [replayPrelude, replayToken],
  );

  return (
    <PreludeReplayContext.Provider value={value}>
      {children}
    </PreludeReplayContext.Provider>
  );
}

export function usePreludeReplay(): PreludeReplayContextValue {
  const context = useContext(PreludeReplayContext);

  if (!context) {
    throw new Error(
      "usePreludeReplay must be used within PreludeReplayProvider",
    );
  }

  return context;
}
