import api from "@/constants/api";
import { handleApiResponse } from "@/utils/apiResponse";
import { getFromSecureStore } from "../../utils/secureStorage";

export const ProductService = {
  // 1 add products
  async addProducts(payload: {
    businessId: string;
    name: string;
    serviceTypeId: string;
    duration: number;
    price: number;
    currency: string;
    chairs: number;
    rooms: number;
    description: string;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/service/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // 2 update products
  async updateProducts(payload: {
    id: string;
    businessId: string;
    name: string;
    serviceTypeId: string;
    duration: number;
    price: number;
    currency: string;
    chairs: number;
    rooms: number;
    description: string;
  }) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await api.post("/api/biz/service/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // 3 search products
  async searchProduct(name: string, pageNo: string, pageSize: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const id = await getFromSecureStore("businessId")

      const response = await api.post(
        "/api/biz/service/search",
        {
          name: name ?? "",
          id: id ?? "",
          pageNo: pageNo,
          pageSize: pageSize,
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

  // 4 delete products
  async delteProduct(serviceId: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/biz/service/delete",
        {
          id: serviceId,
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
