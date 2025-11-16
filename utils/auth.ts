import * as Linking from "expo-linking";
import { supabase } from "./supabaseClient";
// this is deep url it will handle in root _layout.tsx file in useEffect
// redirectTo: 'MetryMobile://reset-password' when your app is standalone

export const AuthService = {
  // Request password reset email
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL("reset-password"), // your frontend redirect
      // redirectTo: "exp://192.168.29.102:8081/--/reset-password", // your frontend redirect
    });
    return { data, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    console.log(data, error);
    return { data, error };
  },
};
