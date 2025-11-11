import * as SecureStore from "expo-secure-store";
 
 export const saveToSecureStore = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`🔐 Saved ${key} successfully`);
    } catch (error) {
      console.log("❌ SecureStore save error:", error);
    }
  };