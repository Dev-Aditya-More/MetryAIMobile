import { handleApiResponse } from "@/utils/apiResponse";
import api from "../../constants/api";
import { getFromSecureStore } from "../../utils/secureStorage";

export const AppointmentService = {
  // 1 get appointments for current business
  async getAppoints(businessId: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/biz/appointment/search",
        { businessId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  //   2 add appointments for current business
  async addAppoint(payload: {
    businessId: string;
    staffId: string;
    serviceId: string;
    customerName: string;
    timeSlot: string;
    appointmentTime: number;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/appointment", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (err) {
      throw err;
    }
  },

  //  3 update appointments
  async updateAppoint(payload: {
    id: string;
    businessId: string;
    staffId: string;
    serviceId: string;
    customerName: string;
    timeSlot: string;
    appointmentTime: number;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/appointment/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (err) {
      throw err;
    }
  },

  //  4 delete appointment
  async deleteAppoints(id: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/biz/appointment/delete",
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
