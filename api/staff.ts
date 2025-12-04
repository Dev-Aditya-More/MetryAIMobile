import api from "@/constants/api";
import { handleApiResponse } from "@/utils/apiResponse";
import { getFromSecureStore } from "../utils/secureStorage";

export const StaffService = {
  //1 get staff for current business
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
};
