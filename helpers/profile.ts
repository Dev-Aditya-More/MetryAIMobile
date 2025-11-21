import api from "@/constants/api";
import { getFromSecureStore } from "@/utils/secureStorage";

export async function getProfile() {
  const access_token = await getFromSecureStore("access_token");
  const user_id = await getFromSecureStore("user_id");

  if (!access_token || !user_id) {
    console.log("No access token or user ID found");
    return null;
  }

  try {
    const res = await api.get(`/profile/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (res.data?.error) {
      console.log("Profile API error:", res.data.error);
      return null;
    }

    return res.data.data; // actual profile from API
  } catch (err) {
    console.log("Profile fetch failed:", err);
    return null;
  }
}
