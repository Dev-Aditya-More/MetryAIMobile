// app/_context/HomeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/utils/supabaseClient";
import { Database } from "@/types/database";

import { getProfile } from "@/api/profile";
import { getStaff } from "@/api/staff";
import { getCustomers } from "@/api/customers";
import { getAppointments as fetchAppointments } from "@/api/appointments";

/* ---------------- Types ---------------- */

export type StaffItem = {
  id: string;
  name: string;
  role?: string;
  online?: boolean;
  avatar?: string | null;
  badges?: string[];
  isClient?: boolean;
};

export type CustomerItem = {
  id: string;
  name: string;
  status?: string;
};

export type AppointmentItem = {
  id: string;
  service_name?: string;
  staff_name?: string;
  customer_name?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
};

export type Metric = {
  title: string;
  value: string;
  deltaPct?: number;
};

export type HomeState = {
  loading: boolean;
  error?: string | null;
  welcomeName: string;
  metrics: Metric[]; // analytics stub until backend provides real endpoint
  staffList: StaffItem[];
  customers: CustomerItem[];
  appointments: AppointmentItem[];
};

/* ---------------- Context ---------------- */

type HomeContextType = {
  state: HomeState;
  reload: () => Promise<void>;
  // small helpers for UI usage:
  setWelcomeName: (name: string) => void;
  toggleOnline: (id: string, online: boolean) => void;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

/* ---------------- Provider ---------------- */

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HomeState>({
    loading: true,
    error: null,
    welcomeName: "",
    metrics: [], // filled after load (mocked until analytics exist)
    staffList: [],
    customers: [],
    appointments: [],
  });

  // normalize appointment payloads returned by backend
  function normalizeAppointments(raw: any[]): AppointmentItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => {
      const service = r.service_id ?? r.service ?? null;
      const staffUser = r.staff_user_id?.user_id ?? r.staff_user ?? null;
      const user = r.user_id ?? null;
      // different backends sometimes return nested shapes; handle both
      return {
        id: r.id,
        service_name: service?.name ?? service?.service_name ?? "",
        staff_name: staffUser?.full_name ?? staffUser?.name ?? (r.staff_name ?? ""),
        customer_name: user?.full_name ?? user?.name ?? (r.customer_name ?? ""),
        start_time: r.start_time,
        end_time: r.end_time,
        status: r.status,
      } as AppointmentItem;
    });
  }

  async function loadAll() {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      // 1) Profile (Supabase)
      const profile = await getProfile();
      if (!profile) {
        throw new Error("Profile not found");
      }

      // build welcome name from schema first_name/last_name or fallback to full_name
      const first = (profile as any).first_name ?? (profile as any).full_name ?? "";
      const last = (profile as any).last_name ?? "";
      const welcomeName = `${first} ${last}`.trim() || (profile as any).full_name || "";

      type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
      const { data: business, error: businessError } = await supabase
        .from<BusinessRow>("businesses")
        .select("*")
        .eq("owner_id", profile.id)
        .single();

      if (businessError || !business) {
        throw new Error("Business not found for current user");
      }
      const businessId = business.id;

      // 3) Staff & customers (backend)
      const staffResp = await getStaff(businessId);
      const customersResp = await getCustomers(businessId);

      // 4) Appointments (backend)
      const apptResp = await fetchAppointments(businessId);
      // backend sometimes wraps result as { data: [...] } as in your code—handle both
      const rawAppointments = apptResp?.data ?? apptResp ?? [];
      const appointments = normalizeAppointments(rawAppointments);

      // 5) Build metrics (for now keep safe mock until analytics endpoint exists)
      const metrics: Metric[] = [
        { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
        { title: "Appointments", value: String(appointments.length || 0), deltaPct: 0 },
        { title: "Clients", value: String(customersResp.length || 0), deltaPct: 0 },
      ];

      // 6) Map staff -> local shape and append customers as clients
      const staffList: StaffItem[] = [
        ...(Array.isArray(staffResp)
          ? staffResp.map((s: any) => ({
              id: s.id,
              name: s.name ?? s.full_name ?? s.user_name ?? "",
              role: s.role ?? s.title ?? s.designation ?? "",
              online: (s.status ?? "").toLowerCase() === "online",
              avatar: s.avatarUrl ?? s.avatar_url ?? null,
              badges: s.skills ?? s.badges ?? [],
              isClient: false,
            }))
          : []),
        ...(Array.isArray(customersResp)
          ? customersResp.map((c: any) => ({
              id: c.id,
              name: c.name ?? c.full_name ?? "",
              role: "Client",
              online: (c.status ?? "").toLowerCase() === "online",
              isClient: true,
            }))
          : []),
      ];

      setState({
        loading: false,
        error: null,
        welcomeName,
        metrics,
        staffList,
        customers: Array.isArray(customersResp)
          ? customersResp.map((c: any) => ({ id: c.id, name: c.name ?? c.full_name ?? "" }))
          : [],
        appointments,
      });
    } catch (err: any) {
      console.error("HomeContext load error:", err);
      setState((s) => ({ ...s, loading: false, error: String(err?.message ?? err) }));
    }
  }

  useEffect(() => {
    loadAll();
    // no deps — run once on mount. You can expose reload() for manual refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = async () => {
    await loadAll();
  };

  const setWelcomeName = (name: string) =>
    setState((s) => ({ ...s, welcomeName: name }));

  const toggleOnline = (id: string, online: boolean) =>
    setState((s) => ({
      ...s,
      staffList: s.staffList.map((m) => (m.id === id ? { ...m, online } : m)),
    }));

  const value = useMemo(
    () => ({ state, reload, setWelcomeName, toggleOnline }),
    [state]
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

/* ---------------- Hook ---------------- */

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be used within HomeProvider");
  return ctx;
}