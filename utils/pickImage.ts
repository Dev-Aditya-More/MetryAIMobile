// utils/imageHelper.ts

import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { getFromSecureStore } from "./secureStorage";

export interface PickedImage {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

// -------------------------------------------
// 1) PICK IMAGE
// -------------------------------------------
export const pickImage = async (): Promise<PickedImage | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo access.");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        type: asset.type,
        fileName: asset.fileName,
      };
    }

    return null;
  } catch (err) {
    console.error("Pick image error:", err);
    Alert.alert("Error", "Could not pick image.");
    return null;
  }
};

// -------------------------------------------
// 2) UPLOAD IMAGE
// -------------------------------------------

// export const uploadImage = async (
//   image: PickedImage | null
// ): Promise<any | null> => {
//   if (!image) {
//     Alert.alert("No image selected", "Please select an image first.");
//     return null;
//   }

//   try {
//     const formData = new FormData();

//     formData.append("file", {
//       uri: image.uri,
//       name: image.fileName || "photo.jpg",
//       type: image.type || "image/jpeg",
//     } as any);

//     const response = await UploadService.uploadImage(formData);
//     console.log("Upload response:", response);
//     return null;
//   } catch (err) {
//     console.error("Upload error:", err);
//     Alert.alert("Error", "Failed to upload image.");
//     return null;
//   }
// };

export const uploadImage = async (image: PickedImage | null) => {
  if (!image) {
    Alert.alert("No image selected", "Please select an image first.");
    return null;
  }

  try {
    const token = await getFromSecureStore("access_token");
    if (!token) {
      Alert.alert("Auth error", "Authentication token not found");
      return null;
    }

    const formData = new FormData();

    // FIELD NAME MUST BE "file" (your backend)
    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "photo.jpg",
      type: "image/jpeg", // Do NOT use image.type ("image")
    } as any);

    console.log("Uploading file:", {
      uri: image.uri,
      name: image.fileName,
      type: "image/jpeg",
    });

    const response = await fetch(
      "https://express-micro-gateway.vercel.app/api/biz/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT SET "Content-Type"
          // fetch will automatically add correct boundary
        },
        body: formData,
      }
    );

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return json;
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    throw error;
  }
};
