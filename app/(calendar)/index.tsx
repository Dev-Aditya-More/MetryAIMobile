import BottomNav from "@/components/BottomNav";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../constants/api";
import { getFromSecureStore } from "../../utils/secureStorage";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week")
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("All Staff");

  const staffList = ["All Staff", "David", "Sarah Johnson", "Lily", "Anna"];

  const days = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  // Appointments
  const appointments = [
    {
      id: "1",
      title: "Milbon 4-Step",
      staff: "David",
      start: 1,
      end: 3,
      date: dayjs().startOf("week").format("YYYY-MM-DD"),
      color: "#FFF3D4",
    },
    {
      id: "3",
      title: "Hair Styling",
      staff: "David",
      start: 4,
      end: 5,
      date: dayjs().startOf("week").format("YYYY-MM-DD"),
      color: "#E5E7FF",
    },
    {
      id: "2",
      title: "Hair Styling",
      staff: "Sarah Johnson",
      start: 8,
      end: 10,
      date: dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"),
      color: "#E5E7FF",
    },
    {
      id: "3",
      title: "Hair Cut",
      staff: "Lily",
      start: 10,
      end: 13,
      date: dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"),
      color: "#F2F4F6",
    },
    {
      id: "4",
      title: "Balayage",
      staff: "Anna",
      start: 10.5,
      end: 14,
      date: dayjs().startOf("week").add(3, "day").format("YYYY-MM-DD"),
      color: "#FFD5E5",
    },
  ];

  // Sort appointments automatically and filter based on selection
  const filteredAppointments = appointments
    .filter(
      (a) =>
        a.date === selectedDate.format("YYYY-MM-DD") &&
        (selectedStaff === "All Staff" || a.staff === selectedStaff)
    )
    .sort((a, b) => a.start - b.start);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Move to previous week
  const goToPreviousWeek = () => {
    const newWeek = currentWeekStart.subtract(1, "week");
    setCurrentWeekStart(newWeek);
    setSelectedDate(newWeek); // reset to first day of new week
  };

  // Move to next week
  const goToNextWeek = () => {
    const newWeek = currentWeekStart.add(1, "week");
    setCurrentWeekStart(newWeek);
    setSelectedDate(newWeek);
  };

  const getAppointments = async () => {
    try {
      const token = await getFromSecureStore("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await api.get("/calendar/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Error fetching appointments:",
        error?.response?.data || error?.message || error
      );

      return {
        success: false,
        message:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
        status: error?.response?.status || 500,
      };
    }
  };

  // Keep selected date within new week’s range
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAppointments();
        console.log("Appointments response:", JSON.stringify(res, null, 2));
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();

    if (
      selectedDate.isBefore(currentWeekStart) ||
      selectedDate.isAfter(currentWeekStart.add(6, "day"))
    ) {
      setSelectedDate(currentWeekStart);
    }
  }, [currentWeekStart]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#777" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <MaterialIcons name="chevron-left" size={26} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerDate}>
            {selectedDate.format("DD MMMM")}
          </Text>
          <MaterialIcons name="calendar-today" size={18} color="#777" />
        </View>

        <TouchableOpacity onPress={goToNextWeek}>
          <MaterialIcons name="chevron-right" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekRow}>
        {days.map((day, index) => {
          const isSelected =
            day.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                isSelected && styles.daySelected,
                styles.shadowEffect, // 🔥 Added shadow
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Text
                style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
              >
                {day.format("dd").toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayLabelSelected,
                ]}
              >
                {day.format("D")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Dropdown */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown((prev) => !prev)}
      >
        <View style={styles.dropdownLeft}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.dropdownText}>{selectedStaff}</Text>
        </View>
        <MaterialIcons
          name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color="#777"
        />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownList}>
          {staffList.map((staff, i) => (
            <TouchableOpacity
              key={i}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedStaff(staff);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{staff}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Schedule */}
      {/* Schedule (scrollable area only) */}
      <ScrollView
        style={{ marginTop: 10, marginBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredAppointments.length === 0 ? (
          <Text style={styles.noEvents}>No appointments for this day</Text>
        ) : (
          <View style={{ height: 24 * 80 }}>
            {/* 80px per hour (adjust for your design) */}
            {hours.map((hour) => (
              <View key={hour} style={styles.timeRow}>
                <Text style={styles.timeLabel}>
                  {dayjs().hour(hour).format("h A")}
                </Text>
                <View style={styles.eventColumn} />
              </View>
            ))}

            {/* Absolute-positioned events covering start → end time */}
            {filteredAppointments.map((event) => {
              const top = event.start * 80; // 80 = height per hour
              const height = (event.end - event.start) * 80;
              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventCard,
                    {
                      position: "absolute",
                      left: 60, // keep room for time labels
                      right: 10,
                      top,
                      height,
                      backgroundColor: event.color,
                    },
                  ]}
                >
                  <View style={styles.eventCardHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <MaterialIcons name="more-vert" size={18} color="#555" />
                  </View>

                  <View style={styles.eventFooterRow}>
                    <Text style={styles.eventStaff}>{event.staff}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.eventTime}>
                      {`${event.start}:00 - ${event.end}:00`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ✅ Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

// 🧱 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerDate: { fontSize: 18, fontWeight: "600", color: "#333" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  daySelected: { backgroundColor: "#C2B19C" },
  shadowEffect: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  dayLabel: { fontSize: 12, color: "#777" },
  dayNumber: { fontSize: 16, color: "#333", fontWeight: "600" },
  dayLabelSelected: { color: "#fff" },

  dropdown: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  dropdownText: { fontSize: 15, fontWeight: "500", color: "#333" },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: { fontSize: 15, color: "#333" },

  eventCard: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#333", flexShrink: 1 },
  eventFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  eventStaff: { fontSize: 13, color: "#555", fontWeight: "500" },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#555",
    marginHorizontal: 6,
    opacity: 0.6,
  },
  eventTime: { fontSize: 13, color: "#555" },

  noEvents: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 20,
  },
  bottomNavContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    height: 80, // height per hour
  },
  timeLabel: {
    width: 50,
    color: "#999",
    fontSize: 12,
    textAlign: "right",
    marginRight: 10,
  },
  eventColumn: {
    flex: 1,
  },
});
