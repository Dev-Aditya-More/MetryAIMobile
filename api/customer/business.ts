import { Business, BusinessListResponse } from "@/types/api/business";
import { serviceHandler } from "@/utils/serviceHandler";
import api from "../../constants/api";

export const BusinessService = {
  //1 get shop by id
  async getBusinesses(id: string) {
    return serviceHandler<Business>(async () => {
      const response = await api.get(`/api/biz/customer/business/get?id=${id}`);
      return response.data;
    });
  },

  //2 get all shops
  async getBusinessesDropDown(payload: { name: string | null; pageNo: number; pageSize: number } = { name: null, pageNo: 1, pageSize: 10 }) {
    return serviceHandler<BusinessListResponse>(async () => {
      const response = await api.post(
        "/api/biz/customer/business/page",
        payload
      );
      return response.data;
    });
  },
};