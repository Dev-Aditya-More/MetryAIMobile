// app/_context/HomeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppointmentService } from "@/api/appointment";
import { AuthService } from "@/api/auth";
import { BusinessService } from "@/api/business";
import { StaffService } from "@/api/staff";

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
  service_name?: string;   // we’ll show customerName here in Home cards
  staff_name?: string;
  customer_name?: string;
  start_time?: string;     // ISO string
  end_time?: string;       // ISO string
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

/* ---------------- Raw API types (new backend) ---------------- */

type ProfileApi = {
  avatarUrl?: string;
  fullName?: string;
  phoneCode?: string;
  phone?: string;
  fullPhone?: string;
  email?: string;
};

type StaffApi = {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  email: string;
  fullPhone: string;
  merchantId: string;
};

type AppointmentApi = {
  id: string;
  staffId: string;
  serviceId: string;
  customerName: string;
  timeSlot: string;       // "14:00-15:00"
  businessId: string;
  merchantId: string;
  appointmentTime: number; // epoch ms (date)
  updateTime: number;
  createTime: number;
  email: string | null;
  phone: string | null;
  orderItemId: string | null;
  customerUserId: string | null;
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

  // helper: build ISO start/end time from appointmentTime + timeSlot "HH:mm-HH:mm"
  function buildStartEndIso(a: AppointmentApi): { start: string; end: string } | null {
    if (!a.timeSlot || !a.appointmentTime) return null;

    const parts = a.timeSlot.split("-");
    if (parts.length !== 2) return null;

    const parseTime = (t: string): { h: number; m: number } | null => {
      const [hh, mm] = t.split(":");
      const h = Number(hh);
      const m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return { h, m };
    };

    const startParts = parseTime(parts[0]);
    const endParts = parseTime(parts[1]);
    if (!startParts || !endParts) return null;

    const base = new Date(a.appointmentTime);

    const start = new Date(base);
    start.setHours(startParts.h, startParts.m, 0, 0);

    const end = new Date(base);
    end.setHours(endParts.h, endParts.m, 0, 0);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  async function loadAll() {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      /* 1) Profile */
      const profileRaw = (await AuthService.getProfile()) as ProfileApi | null;
      if (!profileRaw) throw new Error("Profile not found");

      const welcomeName = profileRaw.fullName || "";

      /* 2) Businesses */
      const businessesRes = await BusinessService.getBusinesses();
      console.log("Businesses fetched:", businessesRes);

      const businesses = businessesRes ?? [];
      if (!Array.isArray(businesses) || businesses.length === 0) {
        throw new Error("No business found for current user");
      }
      const business = businesses[0];
      const businessId = business.id;

      /* 3) Staff */
      const staffResp = (await StaffService.getStaff(businessId)) as StaffApi[] | null;
      const staffArray: StaffApi[] = Array.isArray(staffResp) ? staffResp : [];

      /* 4) Appointments (new API) */
      const apptResp = (await AppointmentService.getAppoints(
        businessId
      )) as AppointmentApi[] | null;
      const apptArray: AppointmentApi[] = Array.isArray(apptResp) ? apptResp : [];

      // map staffId -> name
      const staffMap: Record<string, StaffApi> = {};
      for (const s of staffArray) {
        staffMap[s.id] = s;
      }

      // normalize new appointment shape to AppointmentItem used by home UI
      const appointments: AppointmentItem[] = apptArray.map((a) => {
        const staff = staffMap[a.staffId];
        const times = buildStartEndIso(a);

        return {
          id: a.id,
          // show customerName as the main title in "Today's Appointments" card
          service_name: a.customerName || "Appointment",
          staff_name: staff?.name ?? "",
          customer_name: a.customerName,
          start_time: times?.start,
          end_time: times?.end,
          status: undefined, // backend currently has no status field here
        };
      });

      /* 5) Customers – none yet, keep as empty list */
      const customersResp: any[] = []; // placeholder until you wire customers API

      /* 6) Metrics (simple derived numbers) */
      const metrics: Metric[] = [
        { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
        {
          title: "Appointments",
          value: String(appointments.length || 0),
          deltaPct: 0,
        },
        {
          title: "Clients",
          value: String(customersResp.length || 0),
          deltaPct: 0,
        },
      ];

      /* 7) Map staff -> StaffItem */
      const staffList: StaffItem[] = Array.isArray(staffArray)
        ? staffArray.map((s) => ({
            id: s.id,
            name: s.name ?? "",
            role: "",             // no role data in new API
            online: false,        // no status in new API (can wire later)
            avatar: null,
            badges: [],
            isClient: false,
          }))
        : [];

      setState({
        loading: false,
        error: null,
        welcomeName,
        metrics,
        staffList,
        customers: [],
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
