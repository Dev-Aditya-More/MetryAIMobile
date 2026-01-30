import api from "@/constants/api";
import { serviceHandler } from "@/utils/serviceHandler";
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
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/service/add", payload);
      return response.data;
    });
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
    return serviceHandler(async () => {
      const response = await api.post("/api/biz/service/update", payload);
      return response.data;
    });
  },

  // 3 search products
  async searchProduct(name: string, pageNo: string, pageSize: string) {
    return serviceHandler(async () => {
      const id = await getFromSecureStore("businessId");

      const response = await api.post(
        "/api/biz/service/search",
        {
          name: name ?? "",
          id: id ?? "",
          pageNo: pageNo,
          pageSize: pageSize,
        }
      );
      return response.data;
    });
  },

  // 4 delete products
  async delteProduct(serviceId: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/biz/service/delete",
        {
          id: serviceId,
        }
      );
      return response.data;
    });
  },
};
