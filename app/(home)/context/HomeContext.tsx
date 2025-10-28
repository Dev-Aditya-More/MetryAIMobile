import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Staff = {
  id: string;
  name: string;
  role: string;
  online: boolean;
  avatar?: string;
  badges?: string[];
  isClient?: boolean;
};

type Metric = {
  title: string;
  value: string;
  deltaPct?: number;
};

type HomeState = {
  welcomeName: string;
  metrics: Metric[];
  staffList: Staff[];
};

type HomeContextType = {
  state: HomeState;
  setWelcomeName: (name: string) => void;
  toggleOnline: (id: string, online: boolean) => void;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HomeState>({
    welcomeName: "John Kuy",
    metrics: [
      { title: "Today's Revenue", value: "$1,214", deltaPct: 36 },
      { title: "Appointments", value: "1214", deltaPct: -36 },
      { title: "Clients", value: "1214", deltaPct: -36 },
    ],
    staffList: [
      { id: "1", name: "David", role: "Expert", online: true, badges: ["Expert", "Dye"], avatar: undefined },
      { id: "2", name: "Fred", role: "Expert", online: true, badges: ["Expert"], avatar: undefined },
      { id: "3", name: "Mike", role: "Stylist", online: false, avatar: undefined },
      { id: "4", name: "Lily", role: "Client", online: true, isClient: true },
      { id: "5", name: "Judy", role: "Client", online: false, isClient: true },
      { id: "6", name: "Vicky", role: "Client", online: false, isClient: true },
    ],
  });

  useEffect(() => {
    (async () => {
      try {
        const SecureStore = (require("expo-secure-store") as any).default || require("expo-secure-store");
        const saved = await SecureStore.getItemAsync?.("customer_name");
        if (saved) setState((s) => ({ ...s, welcomeName: saved }));
      } catch {}
    })();
  }, []);

  const setWelcomeName = (name: string) => setState((s) => ({ ...s, welcomeName: name }));
  const toggleOnline = (id: string, online: boolean) =>
    setState((s) => ({
      ...s,
      staffList: s.staffList.map((m) => (m.id === id ? { ...m, online } : m)),
    }));

  const value = useMemo(
    () => ({ state, setWelcomeName, toggleOnline }),
    [state]
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be used within HomeProvider");
  return ctx;
}


