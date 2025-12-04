import api from "@/constants/api";
import { handleApiResponse } from "@/utils/apiResponse";
import { getFromSecureStore } from "../utils/secureStorage";

export const UploadService = {
  async uploadImage(formData: FormData) {
    try {
      const token = await getFromSecureStore("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post("/api/biz/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload raw response:", response.status, response.data);

      // Now see if handleApiResponse is causing the error
      return handleApiResponse(response.data);
    } catch (err: any) {
      throw err;
    }
  },
};
