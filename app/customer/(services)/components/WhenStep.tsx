import { colors } from '@/theme/colors';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WhenStepProps {
    onNext: (dateRange: string) => void;
    isActive: boolean;
    value: string;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function WhenStep({ onNext, isActive, value }: WhenStepProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    if (!isActive) {
        return (
            <View style={styles.collapsedContainer}>
                <Text style={styles.collapsedLabel}>When</Text>
                <Text style={styles.collapsedValue}>{value || 'Add dates'}</Text>
            </View>
        );
    }

    const generateDays = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startDay = startOfMonth.day();
        const daysInMonth = currentMonth.daysInMonth();

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(currentMonth.date(i));
        }
        return days;
    };

    const days = generateDays();

    const handleDatePress = (day: dayjs.Dayjs) => {
        const formatted = day.format('MMM D');
        setSelectedDate(formatted);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>When?</Text>

            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Dates</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Months</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Flexible</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
                <View style={styles.monthHeader}>
                    <Text style={styles.monthTitle}>{currentMonth.format('MMMM YYYY')}</Text>
                    {/* Arrows could go here */}
                </View>

                <View style={styles.daysHeader}>
                    {DAYS.map((d, i) => (
                        <Text key={i} style={styles.dayLabel}>{d}</Text>
                    ))}
                </View>

                <View style={styles.daysGrid}>
                    {days.map((day, index) => {
                        const isSelected = day && day.format('MMM D') === selectedDate;
                        const isToday = day && day.isSame(dayjs(), 'day');

                        return (
                            <View key={index} style={styles.dayCell}>
                                {day ? (
                                    <TouchableOpacity
                                        onPress={() => handleDatePress(day)}
                                        style={[
                                            styles.dayBtn,
                                            isSelected && styles.selectedDayBtn,
                                            isToday && !isSelected && styles.todayBtn
                                        ]}>
                                        <Text style={[
                                            styles.dayText,
                                            isSelected && styles.selectedDayText
                                        ]}>{day.date()}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={() => setSelectedDate(null)}>
                    <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextBtn, !selectedDate && styles.disabledNextBtn]}
                    onPress={() => selectedDate && onNext(selectedDate)}
                    disabled={!selectedDate}
                >
                    <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 24,
    },
    collapsedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 10,
    },
    collapsedLabel: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    collapsedValue: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
        color: colors.textPrimary,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    activeTabText: {
        fontWeight: '600',
    },
    calendarContainer: {
        marginBottom: 20,
    },
    monthHeader: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    daysHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    selectedDayBtn: {
        backgroundColor: colors.textPrimary, // Black usually
    },
    todayBtn: {
        borderWidth: 1,
        borderColor: colors.textPrimary,
    },
    dayText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    clearBtn: {
        padding: 8,
    },
    clearText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
        color: colors.textPrimary,
    },
    nextBtn: {
        backgroundColor: '#E51D53', // Brand color
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    disabledNextBtn: {
        backgroundColor: '#ccc',
    },
    nextText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
