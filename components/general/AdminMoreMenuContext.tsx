import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import AdminMoreMenuModal from "./AdminMoreMenuModal";

type AdminMoreMenuContextValue = {
  open: () => void;
  close: () => void;
};

const AdminMoreMenuContext = createContext<AdminMoreMenuContextValue | null>(null);

export function AdminMoreMenuProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <AdminMoreMenuContext.Provider value={value}>
      {children}
      <AdminMoreMenuModal visible={visible} onClose={close} />
    </AdminMoreMenuContext.Provider>
  );
}

export function useAdminMoreMenu() {
  const ctx = useContext(AdminMoreMenuContext);
  if (!ctx) {
    throw new Error("useAdminMoreMenu must be used within AdminMoreMenuProvider");
  }
  return ctx;
}

export function useOptionalAdminMoreMenu() {
  return useContext(AdminMoreMenuContext);
}
