import { getFromSecureStore, saveToSecureStore } from "@/utils/secureStorage";
import { serviceHandler } from "@/utils/serviceHandler";
import * as Linking from "expo-linking";
import api from "../../constants/api";
import { supabase } from "../../utils/supabaseClient";

export const CustomerAuthService = {
  // 1. login customer
  async login(email: string, password: string) {
    return serviceHandler(async () => {
      const response = await api.post("/api/auth/customer/login", {
        email,
        password,
      });

      if (response.data.data?.token) {
        await saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }

      return response.data;
    });
  },

  // 2. signup customer
  async signup(fullname: string, email: string, password: string) {
    return serviceHandler(async () => {
      const response = await api.post("/api/auth/customer/register", {
        fullName: fullname,
        email,
        password,
      });

      if (response.data.data?.token) {
        await saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }

      return response.data;
    });
  },

  // 3. setup profile / update profile
  async setupProfile(payload: {
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
  }) {
    return serviceHandler(async () => {
      const token = await getFromSecureStore("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await api.put(
        "/api/auth/customer/user",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    });
  },

  // 4. reset password
  async resetPassword(email: string) {
    return serviceHandler(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Linking.createURL("reset-password"),
      });

      if (error) throw error;

      return data;
    });
  },

  // 5. update password
  async updatePassword(oldPassword: string, newPassword: string) {
    return serviceHandler(async () => {
      const token = await getFromSecureStore("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await api.post(
        "/api/auth/customer/user/update-pwd",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    });
  },

  // 6. get profile
  async getProfile() {
    return serviceHandler(async () => {
      const token = await getFromSecureStore("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await api.get("/api/auth/customer/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    });
  },
};
