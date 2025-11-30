import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
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
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  // ---------- FORM STATE ----------
  const [serviceName, setServiceName] = useState("Nail Art");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("35");
  const [compareAtPrice, setCompareAtPrice] = useState("35");
  const [costPerItem, setCostPerItem] = useState("35");
  const [category, setCategory] = useState("");
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [publish, setPublish] = useState(true);

  useEffect(() => {
    if (!productId) {
      console.warn("No productId provided for editing.");
      return;
    }

    // fetch initial data for this product and fill the form

    console.log("Editing product with id:", productId);
  }, [productId]);

  const handleEditSave = () => {
    // You can collect everything here and send to your API
    const payload = {
      id: productId,
      serviceName,
      description,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice),
      costPerItem: Number(costPerItem),
      category,
      trackQuantity,
      publish,
    };

    console.log("Saving payload:", payload);

    // after successful save:
    router.push("/(products)");
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
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Compare at Price ($)</Text>
            <TextInput
              style={styles.input}
              value={compareAtPrice}
              onChangeText={setCompareAtPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cost per Item ($)</Text>
            <TextInput
              style={styles.input}
              value={costPerItem}
              onChangeText={setCostPerItem}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Select category"
              value={category}
              onChangeText={setCategory}
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
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Thumbnails */}
          <View style={styles.thumbnailRow}>
            <View style={styles.thumbnailWrapper}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/3993442/pexels-photo-3993442.jpeg",
                }}
                style={styles.thumbnail}
              />
              <TouchableOpacity style={styles.thumbClose}>
                <Text style={styles.thumbCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.thumbnailWrapper}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg",
                }}
                style={styles.thumbnail}
              />
              <TouchableOpacity style={styles.thumbClose}>
                <Text style={styles.thumbCloseText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.helperText}>The first page is main page</Text>
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
            <Text style={styles.summaryValue}>${price}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Stock</Text>
            <Text style={styles.summaryValue}>
              {trackQuantity ? "50" : "-"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Images</Text>
            <Text style={styles.summaryValue}>1</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleEditSave}>
          <Text style={styles.saveButtonText}>Save Edit</Text>
        </TouchableOpacity>
        {/* Cancel Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleEditSave}>
          <Text style={styles.saveButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F4F5",
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
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
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
    color: "#111827",
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  uploadIconText: {
    fontSize: 24,
  },
  uploadText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  uploadButton: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
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
    color: "#6B7280",
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  statusPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    color: "#15803D",
    fontWeight: "500",
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
