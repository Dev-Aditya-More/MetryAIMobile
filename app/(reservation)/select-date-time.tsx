import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // 0 = Jan, 11 = Dec
const currentYear = currentDate.getFullYear();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const START_DAY_INDEX = new Date(currentYear, currentMonth, 1).getDay(); // Sunday = 0, Monday = 1, ... Saturday = 6

// const CALENDAR_DATES = [{date:1, available:true}]
const CALENDAR_DATES = Array.from({ length: daysInMonth }, (_, i) => ({
  date: i + 1,
  available: Math.random() > 0.2, //  replace with real data
}));

// Add empty slots before the first date
const paddedDates = [
  ...Array(START_DAY_INDEX).fill({ date: null, available: false }),
  ...CALENDAR_DATES,
];

// Adding Padding At End (Ensure total items are multiple of 7 so the grid is complete)
const totalCells = paddedDates.length;
const remainder = totalCells % 7;
if (remainder !== 0) {
  const emptyCells = 7 - remainder;
  paddedDates.push(...Array(emptyCells).fill({ date: null, available: false }));
}

const SERVICE_DURATION_MINUTES = 30;

const MONTH_YEAR = "October 2024";
const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const TIME_SLOTS = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: true },
  { time: "10:30", available: false },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "12:30", available: true },
  { time: "13:00", available: false },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
  { time: "19:00", available: false },
  { time: "19:30", available: true },
  { time: "20:00", available: true },
  { time: "20:30", available: true },
];

export default function SelectDateTime() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const isContinueEnabled =
    selectedDate !== undefined && selectedTimes.length > 0;

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const handleDatePress = (dateObj) => {
    if (!dateObj.available) {
      showPopup("This date is full or unavailable.");
      return;
    }
    setSelectedDate(dateObj.date);
  };

  const handleTimePress = (slotObj) => {
    if (!slotObj.available) {
      showPopup("This time slot is full or unavailable.");
      return;
    }

    if (SERVICE_DURATION_MINUTES === 60) {
      const currentIndex = TIME_SLOTS.findIndex((s) => s.time === slotObj.time);
      const nextSlot = TIME_SLOTS[currentIndex + 1];
      if (nextSlot && nextSlot.available) {
        setSelectedTimes([slotObj.time, nextSlot.time]);
      } else {
        showPopup("The next slot is not available for a 1-hour booking.");
      }
    } else {
      setSelectedTimes([slotObj.time]);
    }
  };

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
      {/* Popup Modal */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{popupMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select Date & Time</Text>
          <Text style={styles.stepText}>Step 3 of 5</Text>
        </View>

        <View style={styles.divider} />

        {/* Calendar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>

          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity>
                <Text style={styles.navArrow}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>{MONTH_YEAR}</Text>
              <TouchableOpacity>
                <Text style={styles.navArrow}>{">"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {DAYS_OF_WEEK.map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.datesGrid}>
              {paddedDates.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  disabled={!d.date}
                  style={[
                    styles.dateItem,
                    !d.available && d.date && styles.unavailableItem,
                    selectedDate === d.date &&
                      d.available &&
                      styles.selectedDateItem,
                  ]}
                  onPress={() => d.date && handleDatePress(d)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !d.available && d.date && styles.unavailableText,
                      selectedDate === d.date &&
                        d.available &&
                        styles.selectedDateText,
                    ]}
                  >
                    {d.date ? d.date : ""}
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
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableItem,
                  selectedTimes.includes(slot.time) &&
                    slot.available &&
                    styles.selectedTimeSlot,
                ]}
                onPress={() => handleTimePress(slot)}
              >
                <Text
                  style={[
                    styles.timeText,
                    !slot.available && styles.unavailableText,
                    selectedTimes.includes(slot.time) &&
                      slot.available &&
                      styles.selectedTimeText,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueBtn,
              !isContinueEnabled && styles.disabledBtn,
            ]}
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
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: { marginBottom: 12 },
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
  section: { marginBottom: 28 },
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
  weekDay: { flex: 1, textAlign: "center", fontWeight: "500", color: "#AAA" },
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
  selectedDateItem: { backgroundColor: "#BFA78A" },
  unavailableItem: { backgroundColor: "#F2F2F2" },
  dateText: {
    fontSize: 15,
    color: "#444",
  },
  selectedDateText: {
    color: "#FFF",
    fontWeight: "600",
  },
  unavailableText: { color: "#BBB" },
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
  footer: { marginTop: 10 },
  continueBtn: {
    backgroundColor: "#BFA78A",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#E0E0E0" },
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
  backText: { color: "#7A7A7A", fontSize: 16, fontWeight: "500" },

  // Popup styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "75%",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#BFA78A",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  modalButtonText: { color: "#FFF", fontWeight: "600" },
});
