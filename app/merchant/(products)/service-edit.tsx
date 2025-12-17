import { ProductService } from "@/api/products";
import { colors } from "@/theme/colors";
import { pickImage, uploadImage } from "@/utils/pickImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceEditScreen() {
  const { productId, service } = useLocalSearchParams<{
    productId?: string;
    service?: string; // 👈 add this
  }>();

  // console.log("productID:", productId);
  // console.log("service:", service);

  const parsedService = React.useMemo(() => {
    if (!service) return null;

    try {
      return JSON.parse(service as string);
    } catch (e) {
      console.warn("Failed to parse service param", e);
      return null;
    }
  }, [service]);

  useEffect(() => {
    if (!parsedService) return;

    setServiceName(parsedService.name ?? "");
    setDescription(parsedService.description ?? "");
    setCurrency(parsedService.currency ?? "");
    setPrice(
      parsedService.price !== undefined && parsedService.price !== null
        ? String(parsedService.price)
        : ""
    );
    setDuration(
      parsedService.duration !== undefined && parsedService.duration !== null
        ? String(parsedService.duration)
        : ""
    );
    setChairs(
      parsedService.chairs !== undefined && parsedService.chairs !== null
        ? String(parsedService.chairs)
        : ""
    );
    setRooms(
      parsedService.rooms !== undefined && parsedService.rooms !== null
        ? String(parsedService.rooms)
        : ""
    );
    setPublish(parsedService.isActive);
  }, [parsedService]);

  const router = useRouter();

  // ---------- FORM STATE ----------
  // name, description, price, duration, chairs, rooms, currency
  const [serviceName, setServiceName] = useState(""); // name
  const [description, setDescription] = useState(""); // description
  const [price, setPrice] = useState(""); // price (string -> number later)
  const [duration, setDuration] = useState(""); // duration (minutes)
  const [chairs, setChairs] = useState(""); // chairs
  const [rooms, setRooms] = useState(""); // rooms
  const [currency, setCurrency] = useState(""); // fixed currency for now

  // keep existing switches (design unchanged)
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [publish, setPublish] = useState(false);

  const handleEdit = async () => {
    //
    // convert numeric fields
    const priceNumber = Number(price) || 0;
    const durationNumber = Number(duration) || 0;
    const chairsNumber = Number(chairs) || 0;
    const roomsNumber = Number(rooms) || 0;
    const serviceTypeId = `${serviceName}001`;

    // send full payload (adjust to your API signature if needed)
    const payload = {
      id: parsedService.id,
      businessId: parsedService.businessId,
      name: serviceName,
      serviceTypeId,
      description,
      price: priceNumber,
      duration: durationNumber,
      currency,
      chairs: chairsNumber,
      rooms: roomsNumber,
    };

    try {
      const res = await ProductService.updateProducts(payload);
      Alert.alert("Service Updated Successfully!");
      router.push("/merchant/(products)");
    } catch (err) {
      console.log("Update Occur While Updating Service:", err);
      Alert.alert("Something wrong happens not able to update!");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(),
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const res = await ProductService.delteProduct(productId ?? "");
      Alert.alert("Service Deleted Successfully");
    } catch (err) {
      console.log("Delete Service Error:", err);
      Alert.alert("Something went wrong , Not able to delete");
    }
    router.push("/merchant/(products)");
  };

  const handleCancel = () => {
    router.push("/merchant/(products)");
  };

  const handleUpload = async () => {
    const image = await pickImage();
    const uploadedData = uploadImage(image);
    console.log(uploadedData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Information */}
        <Text style={styles.sectionTitle}>Service Information</Text>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              style={styles.input}
              value={serviceName}
              onChangeText={setServiceName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter service description"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={currency}
              onChangeText={setCurrency}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          {/* Reused for duration */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          {/* Reused for chairs */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Chairs</Text>
            <TextInput
              style={styles.input}
              value={chairs}
              onChangeText={setChairs}
              keyboardType="numeric"
            />
          </View>

          {/* Reused for rooms */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rooms</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of rooms"
              value={rooms}
              onChangeText={setRooms}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleItem}>
              <Switch value={trackQuantity} onValueChange={setTrackQuantity} />
              <Text style={styles.toggleLabel}>Track quantity</Text>
            </View>

            <View style={styles.toggleItem}>
              <Switch value={publish} onValueChange={setPublish} />
              <Text style={styles.toggleLabel}>Publish</Text>
            </View>
          </View>
        </View>

        {/* Images */}
        <Text style={styles.sectionTitle}>Images</Text>
        <View style={styles.card}>
          {/* Upload Area */}
          <View style={styles.uploadBox}>
            <View style={styles.uploadIconCircle}>
              <Text style={styles.uploadIconText}>📷</Text>
            </View>
            <Text style={styles.uploadText}>Browse or drag image</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUpload}
            >
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Thumbnails */}
          <View style={styles.thumbnailRow}>
            <View style={styles.thumbnailWrapper}>
              {/* implement logic after upload a image preview is here */}
            </View>
          </View>
        </View>

        {/* Service Summary */}
        <Text style={styles.sectionTitle}>Service Summary</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>
                {publish ? "Published" : "Draft"}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>{price ? `$${price}` : "-"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>
              {duration ? `${duration} min` : "-"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Chairs</Text>
            <Text style={styles.summaryValue}>{chairs ? chairs : "-"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rooms</Text>
            <Text style={styles.summaryValue}>{rooms ? rooms : "-"}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
          <Text style={styles.saveButtonText}>Update Service</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
          <Text style={styles.saveButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Delete Button */}

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  fieldGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  toggleLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.surface,
  },

  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  uploadIconText: {
    fontSize: 24,
  },

  uploadText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },

  uploadButton: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  uploadButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  thumbnailRow: {
    flexDirection: "row",
    gap: 12,
  },

  thumbnailWrapper: {
    position: "relative",
    width: 120,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  thumbClose: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  thumbCloseText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: -1,
  },

  helperText: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  summaryValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },

  statusPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },

  saveButton: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  deleteButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },
});

