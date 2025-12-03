import { saveToSecureStore } from "@/utils/secureStorage";
import * as Linking from "expo-linking";
import api from "../constants/api";
import { supabase } from "../utils/supabaseClient";

// this is deep url it will handle in root _layout.tsx file in useEffect
// redirectTo: 'MetryMobile://reset-password' when your app is standalone

export const AuthService = {
  // login user
  async login(email: string, password: string) {
    try {
      const response = await api.post("/api/auth/customer/login", {
        email: email,
        password: password
      });
      if (response.data?.session.token) {
        saveToSecureStore({
          access_token: response.data.session.token,
          user_id: response.data.user.id,
        });
      }
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  // signup user
  async signup(eamil: string, password: string, userType: string) {
    try {
      const response = await api.post("/auth/signup", {
        email: eamil,
        password: password,
        user_type: userType,
        redirect_to: "auth",
      });
      if (response.data?.session.access_token) {
        saveToSecureStore({
          access_token: response.data.session.access_token,
          user_id: response.data.user.id,
        });
      }
      return response.data;
    } catch (err) {
      console.log("🔥 Signup API Error (Raw):", err);
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
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    console.log(data, error);
    return { data, error };
  },
};
