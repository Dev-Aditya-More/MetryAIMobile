import { AppointmentService } from "@/api/merchant/appointment";
import { BusinessService } from "@/api/merchant/business";
import { StaffService } from "@/api/merchant/staff";
import BottomNav from "@/components/BottomNav";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
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

/* ---------- Raw API type ---------- */

type StaffApi = {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  email: string;
  fullPhone: string;
  merchantId: string;
};

type AppointmentApi = {
  id: string;
  staffId: string;
  serviceId: string;
  customerName: string;
  timeSlot: string; // "14:00-15:00"
  businessId: string;
  merchantId: string;
  appointmentTime: number; // epoch ms
  updateTime: number;
  createTime: number;
  email: string | null;
  phone: string | null;
  orderItemId: string | null;
  customerUserId: string | null;
};

/* ---------- Internal calendar types ---------- */

type CalendarAppointment = {
  id: string;
  title: string; // we’ll use customerName for now
  staff: string; // staff display name
  start: number; // decimal hour
  end: number; // decimal hour
  date: string; // "YYYY-MM-DD"
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

  const [eventAreaWidth, setEventAreaWidth] = useState(0);

  const [loading, setLoading] = useState(true); // 🆕 loading state

  const days = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);

  /* ---------- Helpers to parse new timeSlot format ---------- */

  // timeSlot: "14:00-15:00"
  const parseSlot24ToStartEnd = (
    slot: string
  ): { start: number; end: number } | null => {
    if (!slot) return null;
    const parts = slot.split("-");
    if (parts.length !== 2) return null;

    const parse = (t: string): number | null => {
      const [hStr, mStr] = t.split(":");
      const h = Number(hStr);
      const m = Number(mStr);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h + m / 60;
    };

    const start = parse(parts[0]);
    const end = parse(parts[1]);

    if (start == null || end == null) return null;
    return { start, end };
  };

  /* ---------- Navigation between weeks ---------- */

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

  /* ---------- Fetch staff + appointments using new APIs ---------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // 🆕 start loading

        const businessId = await BusinessService.getBusinessesId();

        const [staffRes, apptRes] = await Promise.all([
          StaffService.getStaff(businessId),
          AppointmentService.getAppoints(businessId),
        ]);

        console.log("Staff response:", JSON.stringify(staffRes, null, 2));
        console.log("Appointments response:", JSON.stringify(apptRes, null, 2));

        // Assume both APIs return plain arrays like your samples
        const staffArray: StaffApi[] = Array.isArray(staffRes) ? staffRes : [];
        const apptArray: AppointmentApi[] = Array.isArray(apptRes)
          ? apptRes
          : [];

        // Map staffId → staff name
        const staffIdToName: Record<string, string> = {};
        for (const s of staffArray) {
          staffIdToName[s.id] = s.name || "Unnamed Staff";
        }

        // Convert raw appointments into CalendarAppointment objects
        const mapped: CalendarAppointment[] = apptArray
          .map((item) => {
            const slotParsed = parseSlot24ToStartEnd(item.timeSlot);
            if (!slotParsed) return null;

            const dateStr = dayjs(item.appointmentTime).format("YYYY-MM-DD");

            const staffName =
              staffIdToName[item.staffId] || item.staffId || "Unknown Staff";

            const title = item.customerName || "Appointment";

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

        // Staff list for dropdown – all staff, not just who has appointments
        const staffNames = Array.from(
          new Set(staffArray.map((s) => s.name || "Unnamed Staff"))
        );
        setStaffList(["All Staff", ...staffNames]);
      } catch (error) {
        console.error("Error loading calendar data:", error);
      } finally {
        setLoading(false); // 🆕 done loading
      }
    };

    loadData();
  }, []);

  /* ---------- Keep selected date inside current week ---------- */

  useEffect(() => {
    if (
      selectedDate.isBefore(currentWeekStart) ||
      selectedDate.isAfter(currentWeekStart.add(6, "day"))
    ) {
      setSelectedDate(currentWeekStart);
    }
  }, [currentWeekStart, selectedDate]);

  /* ---------- Filter appointments for selected day + staff ---------- */

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

  /* ---------- Overlap layout (columns) ---------- */

  const laidOutEvents: LaidOutEvent[] = useMemo(() => {
    if (filteredAppointments.length === 0) return [];

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

    // compute max overlapping columns for each event
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

  /* ---------- UI ---------- */

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

      {/* Header with date + arrows */}
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

      {/* Week days */}
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

      {/* Staff dropdown */}
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

      {/* Schedule area */}
      <ScrollView
        style={{ marginTop: 10, marginBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          // 🆕 show loading text while fetching
          <Text style={styles.noEvents}>Loading appointments...</Text>
        ) : laidOutEvents.length === 0 ? (
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
                  onLayout={index === 0 ? handleEventAreaLayout : undefined}
                />
              </View>
            ))}

            {laidOutEvents.map((event) => {
              const top = event.start * 80;
              const height = (event.end - event.start) * 80;

              let width = eventAreaWidth - 8;
              let left = 60;

              if (eventAreaWidth > 0 && event.columnsCount > 0) {
                const colWidth = eventAreaWidth / event.columnsCount;
                width = colWidth - 8;
                left = 60 + colWidth * event.column + 4;
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

      {/* Bottom nav */}
      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  /* Week selector */
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
    backgroundColor: colors.surface,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dayNumber: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  dayLabelSelected: {
    color: "#FFFFFF",
  },

  /* Dropdown */
  dropdown: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: colors.background,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* Time grid */
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    height: 80,
  },
  timeLabel: {
    width: 50,
    color: colors.muted,
    fontSize: 12,
    textAlign: "right",
    marginRight: 10,
  },
  eventColumn: {
    flex: 1,
  },

  /* Event card */
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.eventBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  eventAccent: {
    width: 4,
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventFooterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventStaff: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
    marginHorizontal: 6,
  },
  eventTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  noEvents: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 20,
  },

  /* Bottom nav */
  bottomNavContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
  },
});
