import api from "@/constants/api";

export type StaffResponse = {
  id: string;
  name: string;
  role: string;
  status: "online" | "offline";
  avatarUrl?: string;
  skills?: string[];
};

export async function getStaff(businessId: string): Promise<StaffResponse[]> {
  const res = await api.get(`/businessUsers/businesses/${businessId}/staff`);
  return res.data;
}
