import api from "@/constants/api";
import { handleApiResponse } from "@/utils/apiResponse";
import { getFromSecureStore } from "../../utils/secureStorage";

export const UploadService = {
  async uploadImage(formData: FormData) {
    try {
      const token = await getFromSecureStore("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Using fetch instead of axios for reliable FormData handling in RN
      const response = await fetch(`${api.defaults.baseURL}/api/biz/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is set automatically by fetch for FormData
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Upload raw response:", response.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid JSON response from server");
      }

      return handleApiResponse(data);
    } catch (err: any) {
      console.error("Upload service error:", err);
      throw err;
    }
  },
};
