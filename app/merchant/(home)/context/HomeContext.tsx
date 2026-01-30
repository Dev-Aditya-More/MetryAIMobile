// app/_context/HomeContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppointmentService } from "@/api/merchant/appointment";
import { AuthService } from "@/api/merchant/auth";
import { BusinessService } from "@/api/merchant/business";
import { StaffService } from "@/api/merchant/staff";
import {
  getFromSecureStore,
  saveToSecureStore,
} from "@/utils/secureStorage";

/* ---------------- Types ---------------- */

export type BusinessItem = {
  id: string;
  name: string;
};

export type StaffItem = {
  id: string;
  name: string;
  role?: string;
  online?: boolean;
  avatar?: string | null;
  badges?: string[];
  isClient?: boolean;
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
  customers: any[];
  appointments: AppointmentItem[];

  /* ---- business switcher ---- */
  businesses: BusinessItem[];
  selectedBusinessId?: string;
};

/* ---------------- Raw API types ---------------- */

type ProfileApi = {
  fullName?: string;
};

type StaffApi = {
  id: string;
  name: string;
};

type AppointmentApi = {
  id: string;
  staffId: string;
  customerName: string;
  timeSlot: string; // "14:00-15:00"
  appointmentTime: number;
};

/* ---------------- Context ---------------- */

type HomeContextType = {
  state: HomeState;
  reload: () => Promise<void>;
  setBusinessId: (id: string) => Promise<void>;
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
    businesses: [],
    selectedBusinessId: undefined,
  });

  // helper: build ISO start/end time from appointmentTime + timeSlot
  function buildStartEndIso(a: AppointmentApi) {
    const [start, end] = a.timeSlot.split("-");
    const base = new Date(a.appointmentTime);

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const s = new Date(base);
    s.setHours(sh, sm, 0, 0);

    const e = new Date(base);
    e.setHours(eh, em, 0, 0);

    return {
      start: s.toISOString(),
      end: e.toISOString(),
    };
  }

  /* ---------------- MAIN LOADER ---------------- */
  async function loadAll(businessOverride?: string) {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      /* 1) Profile */
      const profileRes = await AuthService.getProfile();
      if (!profileRes.success) throw new Error(profileRes.error);
      const profile = profileRes.data as ProfileApi;
      const welcomeName = profile?.fullName || "";

      /* 2) Businesses dropdown */
      const businessDropDownRes = await BusinessService.getBusinessesDropDown();
      const businessDropDown = businessDropDownRes.success ? businessDropDownRes.data : [];

      const businesses: BusinessItem[] = (businessDropDown as any[]).map((b: any) => ({
        id: b.id,
        name: b.name,
      }));

      /* 3) Resolve active businessId (IMPORTANT PART) */

      // NEW: get saved businessId from secure storage
      const storedBusinessId =
        businessOverride || (await getFromSecureStore("businessId"));

      const selectedBusinessId =
        storedBusinessId ||
        state.selectedBusinessId ||
        businesses[0]?.id;

      if (!selectedBusinessId) {
        throw new Error("No business selected");
      }

      // NEW: persist resolved businessId
      await saveToSecureStore({ businessId: selectedBusinessId });

      /* 4) Staff */
      const staffRes = await StaffService.getStaff(selectedBusinessId);
      const staffResp = staffRes.success ? (staffRes.data as StaffApi[]) : [];

      /* 5) Appointments */
      const apptRes = await AppointmentService.getAppoints(selectedBusinessId);
      const apptResp = apptRes.success ? (apptRes.data as AppointmentApi[]) : [];

      const staffMap: Record<string, StaffApi> = {};
      staffResp.forEach((s) => (staffMap[s.id] = s));

      const appointments: AppointmentItem[] = apptResp.map((a) => {
        const times = buildStartEndIso(a);
        return {
          id: a.id,
          service_name: a.customerName,
          staff_name: staffMap[a.staffId]?.name,
          customer_name: a.customerName,
          start_time: times.start,
          end_time: times.end,
        };
      });

      /* 6) Metrics */
      const metrics: Metric[] = [
        { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
        {
          title: "Appointments",
          value: String(appointments.length),
          deltaPct: 0,
        },
        { title: "Clients", value: "0", deltaPct: 0 },
      ];

      /* 7) Staff list */
      const staffList: StaffItem[] = staffResp.map((s) => ({
        id: s.id,
        name: s.name,
        online: false,
        isClient: false,
      }));

      setState({
        loading: false,
        error: null,
        welcomeName,
        metrics,
        staffList,
        customers: [],
        appointments,
        businesses,
        selectedBusinessId,
      });
    } catch (err: any) {
      console.error("HomeContext load error:", err);
      setState((s) => ({
        ...s,
        loading: false,
        error: err?.message ?? "Failed to load home data",
      }));
    }
  }

  /* ---------------- Initial load ---------------- */
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Actions ---------------- */

  const reload = async () => {
    await loadAll();
  };

  /* ---- business switch (called from dropdown) ---- */
  const setBusinessId = async (id: string) => {
    await saveToSecureStore({ businessId: id });
    await loadAll(id);
  };

  const value = useMemo(
    () => ({
      state,
      reload,
      setBusinessId,
    }),
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
