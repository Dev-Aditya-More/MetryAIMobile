import api from "@/constants/api";
import { handleApiResponse } from "@/utils/apiResponse";
import { getFromSecureStore } from "../utils/secureStorage";

export const StaffService = {
  // 1 add staff
  async addStaff(payload: {
    businessId: string;
    name: string;
    email: string;
    phoneCode: string;
    phone: string;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/staff/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // 2 update staff
  async updateStaff(payload: {
    id: string;
    businessId: string;
    name: string;
    email: string;
    fullPhone: string;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/staff/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // 3 get staff for current business
  async getStaff(businessId: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/biz/staff/list",
        {
          businessId: businessId,
          name: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // 4 delete staff
  async deleteStaff(id: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/biz/staff/delete",
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },
};
