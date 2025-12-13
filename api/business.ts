import { handleApiResponse } from "@/utils/apiResponse";
import api from "../constants/api";
import { getFromSecureStore } from "../utils/secureStorage";

export const BusinessService = {
  //1 get businesses for current user
  async getBusinesses() {
    try {
      const token = await getFromSecureStore("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await api.get("/api/biz/business/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  //2 return 1st business id
  async getBusinessesId() {
    try {
      const businessesRes = await BusinessService.getBusinesses();

      const businesses = businessesRes ?? [];
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
    try {
      const token = await getFromSecureStore("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await api.post(
        "/api/biz/business/dropdown",
        {},
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
