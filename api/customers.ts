import { axiosClient } from "./axiosClient";

export type CustomerResponse = {
  id: string;
  name: string;
  status: "online" | "offline";
};

export async function getCustomers(businessId: string): Promise<CustomerResponse[]> {
  const res = await axiosClient.get(
    `/bussinessCustomers/businesses/${businessId}/customers`
  );
  return res.data;
}
