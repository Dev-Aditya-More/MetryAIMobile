import { serviceHandler } from "@/utils/serviceHandler";
import api from "../../constants/api";

export const AppointmentService = {
  // 1 get appointments for current business
  async getAppoints(businessId: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/appointment/search",
        { businessId }
      );
      return response.data;
    });
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
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/appointment", payload);
      return response.data;
    });
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
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/appointment/update", payload);
      return response.data;
    });
  },

  //  4 delete appointment
  async deleteAppoints(id: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/appointment/delete",
        { id }
      );
      return response.data;
    });
  },
};
