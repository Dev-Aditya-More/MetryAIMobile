import { saveToSecureStore } from "@/utils/secureStorage";
import { serviceHandler } from "@/utils/serviceHandler";
import * as Linking from "expo-linking";
import api from "../../constants/api";
import { supabase } from "../../utils/supabaseClient";

// this is deep url it will handle in root _layout.tsx file in useEffect
// redirectTo: 'MetryMobile://reset-password' when your app is standalone

export const AuthService = {
  //1 login user
  async login(email: string, password: string) {
    return serviceHandler(async () => {
      const response = await api.post("/api/auth/merchant/login", {
        email: email,
        password: password,
      });
      if (response.data.data?.token) {
        saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }
      return response.data;
    });
  },

  //2 signup user
  async signup(fullname: string, email: string, password: string) {
    return serviceHandler(async () => {
      const response = await api.post("/api/auth/merchant/register", {
        fullName: fullname,
        email: email,
        password: password,
      });

      if (response.data.data?.token) {
        saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }

      return response.data;
    });
  },

  // 3 setup profile
  async setupProfile(payload: {
    fullName: string;
    avatarUrl: string;
    phoneCode: string;
    phone: string;
  }) {
    return serviceHandler(async () => {
      const response = await api.put(
        "/api/auth/merchant/user",
        payload
      );

      return response.data;
    });
  },

  //4 reset password email supabase
  async resetPassword(email: string) {
    return serviceHandler(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Linking.createURL("reset-password"), // your frontend redirect 
        // redirectTo: "exp://192.168.29.102:8081/--/reset-password", // your frontend redirect
      });
      if (error) throw error;
      return data;
    });
  },

  //5 Update password
  async updatePassword(oldPassword: string, newPassword: string) {
    return serviceHandler(async () => {
      const response = await api.post(
        "/api/auth/merchant/user/update-pwd",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );
      return response.data;
    });
  },

  // 6 get the profile
  async getProfile() {
    return serviceHandler(async () => {
      const response = await api.get("/api/auth/merchant/user");

      return response.data;
    });
  }
};
