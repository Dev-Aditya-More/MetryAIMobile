import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WhoStepProps {
    onSearch: () => void;
    onClear: () => void;
    isActive: boolean;
    guests: { adults: number; children: number };
    onUpdateGuests: (key: string, val: number) => void;
}

export function WhoStep({ onSearch, onClear, isActive, guests, onUpdateGuests }: WhoStepProps) {
    if (!isActive) {
        return (
            <View style={styles.collapsedContainer}>
                <Text style={styles.collapsedLabel}>Who</Text>
                <Text style={styles.collapsedValue}>
                    {guests.adults + guests.children > 0 ? `${guests.adults + guests.children} guests` : 'Add guests'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Who?</Text>

            <View style={styles.counterRow}>
                <View>
                    <Text style={styles.counterLabel}>Adults</Text>
                    <Text style={styles.counterSubLabel}>Ages 13 or above</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={() => onUpdateGuests('adults', Math.max(0, guests.adults - 1))}
                        style={[styles.circleBtn, guests.adults === 0 && styles.disabledBtn]}>
                        <IconSymbol name="minus" size={16} color={guests.adults === 0 ? "#ccc" : "#000"} />
                    </TouchableOpacity>
                    <Text style={styles.countValue}>{guests.adults}</Text>
                    <TouchableOpacity
                        onPress={() => onUpdateGuests('adults', guests.adults + 1)}
                        style={styles.circleBtn}>
                        <IconSymbol name="plus" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.counterRow}>
                <View>
                    <Text style={styles.counterLabel}>Children</Text>
                    <Text style={styles.counterSubLabel}>Ages 2-12</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={() => onUpdateGuests('children', Math.max(0, guests.children - 1))}
                        style={[styles.circleBtn, guests.children === 0 && styles.disabledBtn]}>
                        <IconSymbol name="minus" size={16} color={guests.children === 0 ? "#ccc" : "#000"} />
                    </TouchableOpacity>
                    <Text style={styles.countValue}>{guests.children}</Text>
                    <TouchableOpacity
                        onPress={() => onUpdateGuests('children', guests.children + 1)}
                        style={styles.circleBtn}>
                        <IconSymbol name="plus" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
                    <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
                    <Text style={styles.searchText}>Search</Text>
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
        marginBottom: 10,
        color: colors.textPrimary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 10,
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
    searchBtn: {
        backgroundColor: '#E51D53',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    searchText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    counterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    counterSubLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {
        borderColor: '#f0f0f0',
        opacity: 0.5,
    },
    countValue: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
});
