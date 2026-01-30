import { Business } from "@/types/api/business";
import { serviceHandler } from "@/utils/serviceHandler";
import api from "../../constants/api";

export const BusinessService = {
  //1 get businesses for current user
  async getBusinesses() {
    return serviceHandler<Business[]>(async () => {
      const response = await api.get("/api/biz/business/list");
      return response.data;
    });
  },

  //2 return 1st business id
  async getBusinessesId() {
    try {
      const businessesRes = await BusinessService.getBusinesses();

      if (!businessesRes.success) {
        throw new Error(businessesRes.error);
      }

      const businesses = businessesRes.data;
      if (!Array.isArray(businesses) || businesses.length === 0) {
        throw new Error("No business found for current user");
      }
      // pick the first business (the owner likely has 1)
      const business = businesses[0];
      const businessId = business.id;

      return businessId;
    } catch (err) {
      throw err;
    }
  },

  //3 getting all the business dropdown list
  async getBusinessesDropDown() {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/business/dropdown",
        {}
      );
      return response.data;
    });
  },

  //4 create new business
  async createBusiness(payload: {
    name: string,
    logoUrl: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
  }) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/business/add",
        payload
      );
      return response.data;
    });
  },

  // update business
  async updateBusiness(payload: {
    id: string,
    name: string,
    logoUrl: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
  }) {
    return serviceHandler(async () => {
      const response = await api.post(
        `/api/biz/business/update`, payload
      );
      return response.data;
    });
  },

  // 6 delete business
  async deleteBusiness(businessId: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        `/api/biz/business/delete`, {
        id: businessId
      }
      );
      return response.data;
    });
  },
};
