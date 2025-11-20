import { axiosClient } from "./axiosClient";

export type StaffResponse = {
  id: string;
  name: string;
  role: string;
  status: "online" | "offline";
  avatarUrl?: string;
  skills?: string[];
};

export async function getStaff(businessId: string): Promise<StaffResponse[]> {
  const res = await axiosClient.get(`/businessUsers/businesses/${businessId}/staff`);
  return res.data;
}
