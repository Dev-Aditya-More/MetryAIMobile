import api from "@/constants/api";

export async function getAppointments(businessId: string) {
  const res = await api.get(
    `/businesses/${businessId}/appointments`
  );
  return res.data.data; // backend wraps result as { data: [...] }
}
