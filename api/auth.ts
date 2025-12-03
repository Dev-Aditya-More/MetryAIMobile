import { handleApiResponse } from "@/utils/apiResponse";
import { saveToSecureStore } from "@/utils/secureStorage";
import * as Linking from "expo-linking";
import api from "../constants/api";
import { getFromSecureStore } from "../utils/secureStorage";
import { supabase } from "../utils/supabaseClient";

// this is deep url it will handle in root _layout.tsx file in useEffect
// redirectTo: 'MetryMobile://reset-password' when your app is standalone

export const AuthService = {
  // login user
  async login(email: string, password: string) {
    try {
      const response = await api.post("/api/auth/customer/login", {
        email: email,
        password: password,
      });
      if (response.data.data?.token) {
        saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }
      return handleApiResponse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // signup user
  async signup(fullname: string, email: string, password: string) {
    try {
      const response = await api.post("/api/auth/customer/register", {
        fullName: fullname,
        email: email,
        password: password,
      });

      if (response.data.data?.token) {
        console.log("Access Token:", response.data.data?.token);
        saveToSecureStore({
          access_token: response.data.data.token,
          refresh_token: response.data.data.refreshToken,
        });
      }

      return handleApiResponse(response.data);
    } catch (err) {
      console.log("🔥 Signup API Error (Raw):", err);
      throw err;
    }
  },

  // setup profile
  async setupProfile(
    fullname: string,
    avatarUrl: string,
    phoneCode: string,
    phone: string
  ) {
    try {
      const token = await getFromSecureStore("access_token");

      console.log("access token:", token);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.put(
        "/api/auth/customer/user",
        {
          avatarUrl: avatarUrl,
          fullName: fullname,
          phoneCode: phoneCode,
          phone: phone,
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

  // reset password email supabase
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL("reset-password"), // your frontend redirect
      // redirectTo: "exp://192.168.29.102:8081/--/reset-password", // your frontend redirect
    });
    return { data, error };
  },

  //   Update password
  async updatePassword(oldPassword: string, newPassword: string) {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.post(
        "/api/auth/customer/user/update-pwd",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
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
