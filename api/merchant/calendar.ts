import { serviceHandler } from "@/utils/serviceHandler";
import api from "../../constants/api";

export const CalendarService = {
  // fetch appointments
  async getAppointments() {
    return serviceHandler(async () => {
      const response = await api.get("/calendar/appointments");
      return response.data;
    });
  },
};
