import { axiosClient } from "./axiosClient";

export async function getAppointments(businessId: string) {
  const res = await axiosClient.get(
    `/businesses/${businessId}/appointments`
  );
  return res.data.data; // backend wraps result as { data: [...] }
}
