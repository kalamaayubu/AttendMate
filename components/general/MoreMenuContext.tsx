import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import StudentMoreMenuModal from "./StudentMoreMenuModal";

type MoreMenuContextValue = {
  open: () => void;
  close: () => void;
};

const MoreMenuContext = createContext<MoreMenuContextValue | null>(null);

export function MoreMenuProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <MoreMenuContext.Provider value={value}>
      {children}
      <StudentMoreMenuModal visible={visible} onClose={close} />
    </MoreMenuContext.Provider>
  );
}

export function useMoreMenu() {
  const ctx = useContext(MoreMenuContext);
  if (!ctx) {
    throw new Error("useMoreMenu must be used within MoreMenuProvider");
  }
  return ctx;
}

export function useOptionalMoreMenu() {
  return useContext(MoreMenuContext);
}
