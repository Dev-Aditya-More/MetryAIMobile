import api from "../constants/api";
import { getFromSecureStore } from "../utils/secureStorage";

export const CalendarService = {
  // fetch appointments
  async getAppointments() {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.get("/calendar/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Error fetching appointments:",
        error?.response?.data || error?.message || error
      );

      return {
        success: false,
        message:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
        status: error?.response?.status || 500,
      };
    }
  },
};
