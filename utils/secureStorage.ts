import * as SecureStore from "expo-secure-store";

export const saveToSecureStore = async (items = {}) => {
  try {
    const entries = Object.entries(items);

    for (const [key, value] of entries) {
      await SecureStore.setItemAsync(key, String(value));
      // console.log(`🔐 Saved ${key} successfully`);
    }
  } catch (error) {
    // console.log("❌ SecureStore save error:", error);
  }
};


export const getFromSecureStore = async (key: string, defaultValue = null) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ?? defaultValue;
  } catch (error) {
    console.log("❌ SecureStore get error:", error);
    return defaultValue;
  }
};
