import api from "@/constants/api";
import { getFromSecureStore } from "../utils/secureStorage";

export const ProductService = {
  // assuming that we have Owner can have one business only
  async fetchProducts(
    businessId: string = "10f5b737-06ad-4afa-a68a-3cd08ec9e33d"
  ) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.get(`/services/business/${businessId}`, {
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
