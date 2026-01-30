import api from "@/constants/api";
import { serviceHandler } from "@/utils/serviceHandler";

export const StaffService = {
  // 1 add staff
  async addStaff(payload: {
    businessId: string;
    name: string;
    email: string;
    phoneCode: string;
    phone: string;
  }) {
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/staff/add", payload);
      return response.data;
    });
  },

  // 2 update staff
  async updateStaff(payload: {
    id: string;
    businessId: string;
    name: string;
    email: string;
    fullPhone: string;
  }) {
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/staff/update", payload);
      return response.data;
    });
  },

  // 3 get staff for current business
  async getStaff(businessId: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/staff/list",
        {
          businessId: businessId,
          name: "",
        }
      );
      return response.data;
    });
  },

  // 4 delete staff
  async deleteStaff(id: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/staff/delete",
        { id }
      );
      return response.data;
    });
  },
};
