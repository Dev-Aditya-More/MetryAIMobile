import React, { createContext, useContext, useMemo, useState } from "react";

export type Person = {
  id: string;
  name: string;
  avatar?: string;
  expert?: boolean;
  tags?: string[];
  online: boolean;
  isClient?: boolean;
};

type ContactState = {
  query: string;
  staff: Person[];
};

type ContactContextType = {
  state: ContactState;
  setQuery: (q: string) => void;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContactState>({
    query: "",
    staff: [
      { id: "1", name: "David", expert: true, tags: ["Expert", "Dye"], online: true },
      { id: "2", name: "Fred", expert: true, tags: ["Expert"], online: true },
      { id: "3", name: "Mike", online: false },
      { id: "4", name: "Lily", online: true, isClient: true },
      { id: "5", name: "Judy", online: false, isClient: true },
      { id: "6", name: "Vicky", online: false, isClient: true },
    ],
  });

  const setQuery = (q: string) => setState((s) => ({ ...s, query: q }));

  const value = useMemo(() => ({ state, setQuery }), [state]);
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used within ContactProvider");
  return ctx;
}


