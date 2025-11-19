import BottomNav from "@/components/BottomNav";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
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

dayjs.extend(customParseFormat);

type ApiAppointment = {
  id: string;
  created_at: string;
  date: string; // "2025-01-20"
  slot: string; // "7:30 PM - 8.00 PM" or "10:30 AM"
  status: string;
  customer?: {
    id: string;
    full_name: string;
  };
  staff?: {
    id: string;
    user?: {
      full_name: string;
    };
  };
  service?: {
    id: string;
    name: string;
    room: string | null;
    price: number;
    duration_minutes?: number;
  };
  business?: {
    id: string;
    name: string;
    rooms: any;
    chairs: any;
  };
};

type CalendarAppointment = {
  id: string;
  title: string;
  staff: string;
  start: number;
  end: number;
  date: string;
  color: string;
};

type LaidOutEvent = CalendarAppointment & {
  column: number;
  columnsCount: number;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week")
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("All Staff");

  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [staffList, setStaffList] = useState<string[]>(["All Staff"]);

  const [eventAreaWidth, setEventAreaWidth] = useState(0); // 👈 width of area right of time labels

  const days = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // --- Time parsing helpers ---

  const parseTimeToDecimal = (
    timeStr: string,
    dateStr: string
  ): number | null => {
    if (!timeStr) return null;

    const raw = timeStr.trim();
    const normalized = raw.replace(".", ":"); // "8.00 PM" → "8:00 PM"

    const dateTimeStr = `${dateStr} ${normalized}`;
    const formats = ["YYYY-MM-DD h:mm A", "YYYY-MM-DD h A"];

    let m: dayjs.Dayjs | null = null;

    for (const fmt of formats) {
      const candidate = dayjs(dateTimeStr, fmt, true);
      if (candidate.isValid()) {
        m = candidate;
        break;
      }
    }

    if (!m) {
      console.warn("Could not parse time:", timeStr, "for date:", dateStr);
      return null;
    }

    return m.hour() + m.minute() / 60;
  };

  const parseSlotToStartEnd = (
    slot: string,
    dateStr: string,
    durationMinutes: number = 30
  ): { start: number; end: number } | null => {
    if (!slot) return null;

    const parts = slot.split("-").map((p) => p.trim());

    if (parts.length === 1) {
      const start = parseTimeToDecimal(parts[0], dateStr);
      if (start == null) return null;
      const end = start + durationMinutes / 60;
      return { start, end };
    }

    const start = parseTimeToDecimal(parts[0], dateStr);
    const endRaw = parseTimeToDecimal(parts[1], dateStr);

    if (start == null || endRaw == null) return null;

    let end = endRaw;
    if (end <= start) {
      end = start + durationMinutes / 60;
    }

    return { start, end };
  };

  // --- API ---

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

  const goToPreviousWeek = () => {
    const newWeek = currentWeekStart.subtract(1, "week");
    setCurrentWeekStart(newWeek);
    setSelectedDate(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = currentWeekStart.add(1, "week");
    setCurrentWeekStart(newWeek);
    setSelectedDate(newWeek);
  };

  // --- Fetch data ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAppointments();
        console.log("Appointments raw response:", JSON.stringify(res, null, 2));

        if (!Array.isArray(res)) {
          console.warn("Unexpected appointments response shape");
          return;
        }

        const mapped: CalendarAppointment[] = res
          .map((item: ApiAppointment) => {
            const dateStr = item.date;
            const duration =
              item.service?.duration_minutes !== undefined
                ? item.service.duration_minutes
                : 30;

            const slotParsed = parseSlotToStartEnd(
              item.slot,
              dateStr,
              duration
            );

            if (!slotParsed) return null;

            const staffName =
              item.staff?.user?.full_name || item.staff?.id || "Unknown Staff";

            const title = item.service?.name || "Service";

            return {
              id: item.id,
              title,
              staff: staffName,
              start: slotParsed.start,
              end: slotParsed.end,
              date: dateStr,
              color: "#E3E3FF", // soft lilac
            };
          })
          .filter(Boolean) as CalendarAppointment[];

        setAppointments(mapped);

        const staffNames = Array.from(
          new Set(mapped.map((a) => a.staff).filter(Boolean))
        );
        setStaffList(["All Staff", ...staffNames]);
      } catch (error) {
        console.error("Error in useEffect fetchData:", error);
      }
    };

    fetchData();
  }, []);

  // keep selected date within current week
  useEffect(() => {
    if (
      selectedDate.isBefore(currentWeekStart) ||
      selectedDate.isAfter(currentWeekStart.add(6, "day"))
    ) {
      setSelectedDate(currentWeekStart);
    }
  }, [currentWeekStart, selectedDate]);

  // Filter for selected day + staff
  const filteredAppointments = useMemo(
    () =>
      appointments
        .filter(
          (a) =>
            a.date === selectedDate.format("YYYY-MM-DD") &&
            (selectedStaff === "All Staff" || a.staff === selectedStaff)
        )
        .sort((a, b) => a.start - b.start || a.end - b.end),
    [appointments, selectedDate, selectedStaff]
  );

  // --- Overlap layout (side-by-side columns) ---

  const laidOutEvents: LaidOutEvent[] = useMemo(() => {
    if (filteredAppointments.length === 0) return [];

    // Greedy column assignment
    const result: LaidOutEvent[] = [];
    let active: LaidOutEvent[] = [];

    for (const ev of filteredAppointments) {
      // remove finished events
      active = active.filter((a) => a.end > ev.start);

      const usedColumns = active.map((a) => a.column);
      let col = 0;
      while (usedColumns.includes(col)) col++;

      const laid: LaidOutEvent = { ...ev, column: col, columnsCount: 1 };
      active.push(laid);
      result.push(laid);
    }

    // compute max columns overlapping each event
    for (const ev of result) {
      let maxCol = ev.column;
      for (const other of result) {
        if (other === ev) continue;
        const overlap = other.start < ev.end && other.end > ev.start;
        if (overlap && other.column > maxCol) {
          maxCol = other.column;
        }
      }
      ev.columnsCount = maxCol + 1;
    }

    return result;
  }, [filteredAppointments]);

  const handleEventAreaLayout = (e: LayoutChangeEvent) => {
    if (eventAreaWidth === 0) {
      setEventAreaWidth(e.nativeEvent.layout.width);
    }
  };

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
                styles.shadowEffect,
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

      {/* Staff Dropdown */}
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
      <ScrollView
        style={{ marginTop: 10, marginBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        {laidOutEvents.length === 0 ? (
          <Text style={styles.noEvents}>No appointments for this day</Text>
        ) : (
          <View style={{ height: 24 * 80 }}>
            {hours.map((hour, index) => (
              <View key={hour} style={styles.timeRow}>
                <Text style={styles.timeLabel}>
                  {dayjs().hour(hour).minute(0).format("h A")}
                </Text>
                <View
                  style={styles.eventColumn}
                  // measure width once (on first row)
                  onLayout={index === 0 ? handleEventAreaLayout : undefined}
                />
              </View>
            ))}

            {laidOutEvents.map((event) => {
              const top = event.start * 80;
              const height = (event.end - event.start) * 80;

              let width = eventAreaWidth - 8; // default full width minus padding
              let left = 60; // time label (50) + marginRight (10)

              if (eventAreaWidth > 0 && event.columnsCount > 0) {
                const colWidth = eventAreaWidth / event.columnsCount;
                width = colWidth - 8; // small gap between columns
                left = 60 + colWidth * event.column + 4; // 4px padding
              }

              const startLabel = dayjs(selectedDate)
                .hour(Math.floor(event.start))
                .minute((event.start % 1) * 60)
                .format("h:mm A");

              const endLabel = dayjs(selectedDate)
                .hour(Math.floor(event.end))
                .minute((event.end % 1) * 60)
                .format("h:mm A");

              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventCard,
                    {
                      position: "absolute",
                      top,
                      height,
                      left,
                      width,
                      backgroundColor: event.color,
                    },
                  ]}
                >
                  <View style={styles.eventAccent} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventFooterRow}>
                      <Text style={styles.eventStaff}>{event.staff}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.eventTime}>
                        {startLabel} - {endLabel}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="more-vert" size={18} color="#666" />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
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
    borderRadius: 12,
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
    borderRadius: 12,
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
    borderRadius: 12,
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

  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    height: 80,
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

  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  eventAccent: {
    width: 4,
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#8D7BFF",
    marginRight: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  eventFooterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventStaff: { fontSize: 12, color: "#555", fontWeight: "500" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#777",
    marginHorizontal: 6,
    opacity: 0.6,
  },
  eventTime: { fontSize: 12, color: "#555" },

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
});
