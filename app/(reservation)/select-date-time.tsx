import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// --- Mock Data ---
const MONTH_YEAR = "October 2024";
const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CALENDAR_DATES = [
  null, null, null, null, null, null, null,
  1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28,
  29, 30, 31, null, null, null, null,
];
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

export default function SelectDateTime() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const isContinueEnabled = selectedDate !== undefined && selectedTime !== undefined;

  const handleContinue = () => {
    if (isContinueEnabled) {
      router.push("/customer-details");
    }
  };

  const handleBack = () => {
    router.push("/select-staff");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Date & Time</Text>
          <Text style={styles.stepText}>Step 3 of 5</Text>
        </View>

        <View style={styles.divider} />

        {/* Calendar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>

          <View style={styles.calendar}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity>
                <Text style={styles.navArrow}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>{MONTH_YEAR}</Text>
              <TouchableOpacity>
                <Text style={styles.navArrow}>{">"}</Text>
              </TouchableOpacity>
            </View>

            {/* Week Days */}
            <View style={styles.weekDays}>
              {DAYS_OF_WEEK.map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* Dates Grid */}
            <View style={styles.datesGrid}>
              {CALENDAR_DATES.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    selectedDate === date && styles.selectedDateItem,
                  ]}
                  onPress={() => date && setSelectedDate(date)}
                  disabled={!date}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === date && styles.selectedDateText,
                      !date && { color: "transparent" },
                    ]}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !isContinueEnabled && styles.disabledBtn]}
            disabled={!isContinueEnabled}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1C",
  },
  stepText: {
    fontSize: 14,
    color: "#8C8C8C",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 10,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E2C2C",
    marginBottom: 10,
  },
  calendar: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  navArrow: {
    fontSize: 20,
    color: "#666",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontWeight: "500",
    color: "#AAA",
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dateItem: {
    width: (width - 80) / 7,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginVertical: 3,
  },
  selectedDateItem: {
    backgroundColor: "#BFA78A",
  },
  dateText: {
    fontSize: 15,
    color: "#444",
  },
  selectedDateText: {
    color: "#FFF",
    fontWeight: "600",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: (width - 80) / 4,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: "#BFA78A",
    borderColor: "#BFA78A",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTimeText: {
    color: "#FFF",
    fontWeight: "600",
  },
  footer: {
    marginTop: 10,
  },
  continueBtn: {
    backgroundColor: "#BFA78A",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#E0E0E0",
  },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    color: "#7A7A7A",
    fontSize: 16,
    fontWeight: "500",
  },
});
