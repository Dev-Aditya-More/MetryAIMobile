// utils/imageHelper.ts

import { UploadService } from "@/api/upload";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

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
export const uploadImage = async (
  image: PickedImage | null
): Promise<any | null> => {
  if (!image) {
    Alert.alert("No image selected", "Please select an image first.");
    return null;
  }

  try {
    const formData = new FormData();

    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "photo.jpg",
      type: image.type || "image/jpeg",
    } as any);

    const response = await UploadService.uploadImage(formData);
    console.log("Upload response:", response);
    return null;
  } catch (err) {
    console.error("Upload error:", err);
    Alert.alert("Error", "Failed to upload image.");
    return null;
  }
};
