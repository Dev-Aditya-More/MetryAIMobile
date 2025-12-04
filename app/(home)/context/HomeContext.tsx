// app/_context/HomeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AuthService } from "@/api/auth";
import { BusinessService } from "@/api/business";
import { StaffService } from "@/api/staff";
import { getAppointments as fetchAppointments } from "@/helpers/appointments";
import { getCustomers } from "@/helpers/customers";
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
  metrics: Metric[];
  staffList: StaffItem[];
  customers: CustomerItem[];
  appointments: AppointmentItem[];
};

/* ---------------- Context ---------------- */

type HomeContextType = {
  state: HomeState;
  reload: () => Promise<void>;
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
    metrics: [],
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
      return {
        id: r.id,
        service_name: service?.name ?? service?.service_name ?? "",
        staff_name:
          staffUser?.full_name ??
          staffUser?.name ??
          r.staff_name ??
          r.staff_user_name ??
          "",
        customer_name:
          user?.full_name ??
          user?.name ??
          r.customer_name ??
          r.business_customer_name ??
          "",
        start_time: r.start_time,
        end_time: r.end_time,
        status: r.status,
      } as AppointmentItem;
    });
  }

  async function loadAll() {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      // 1) Profile (backend)

      const profile = await AuthService.getProfile();

      if (!profile) throw new Error("Profile not found");

      const welcomeName = profile.fullName || "";

      // 2) Businesses
      //    route: GET /api/businesses  (protected, returns user's businesses)
      const businessesRes = await BusinessService.getBusinesses();
      console.log("Businesses fetched:", businessesRes);

      const businesses = businessesRes ?? [];
      if (!Array.isArray(businesses) || businesses.length === 0) {
        throw new Error("No business found for current user");
      }
      // pick the first business (the owner likely has 1)
      const business = businesses[0];
      const businessId = business.id;

      // 3) Staff & customers
      const staffResp = await StaffService.getStaff(businessId);
      //why ?
      const customersResp = await getCustomers(businessId);

      // 4) Appointments
      const apptResp = await fetchAppointments(businessId);
      const rawAppointments = apptResp?.data ?? apptResp ?? [];
      const appointments = normalizeAppointments(rawAppointments);

      // 5) Build metrics (placeholder until analytics endpoint exists)
      const metrics: Metric[] = [
        { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
        {
          title: "Appointments",
          value: String(appointments.length || 0),
          deltaPct: 0,
        },
        {
          title: "Clients",
          value: String(customersResp?.length || 0),
          deltaPct: 0,
        },
      ];

      // 6) Map staff -> local shape and append customers as clients
      const staffList: StaffItem[] = [
        ...(Array.isArray(staffResp)
          ? staffResp.map((s: any) => ({
              id: s.id,
              name: s.name ?? s.full_name ?? s.user_name ?? "",
              role: s.role ?? s.title ?? s.designation ?? "",
              online: String(s.status ?? "").toLowerCase() === "online",
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
              online: String(c.status ?? "").toLowerCase() === "online",
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
          ? customersResp.map((c: any) => ({
              id: c.id,
              name: c.name ?? c.full_name ?? "",
            }))
          : [],
        appointments,
      });
    } catch (err: any) {
      console.error("HomeContext load error:", err);
      setState((s) => ({
        ...s,
        loading: false,
        error: String(err?.message ?? err),
      }));
    }
  }

  useEffect(() => {
    loadAll();
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
