import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface WhereStepProps {
    onNext: (location: string) => void;
    isActive: boolean;
    value: string;
}

export function WhereStep({ onNext, isActive, value }: WhereStepProps) {
    if (!isActive) {
        return (
            <View style={styles.collapsedContainer}>
                <Text style={styles.collapsedLabel}>Where</Text>
                <Text style={styles.collapsedValue}>{value || "I'm flexible"}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Where?</Text>

            <View style={styles.searchContainer}>
                <IconSymbol name="magnifyingglass" size={20} color={colors.textPrimary} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="I'm flexible"
                    placeholderTextColor={colors.textSecondary}
                    autoFocus={true}
                />
            </View>

            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggested destinations</Text>

                <TouchableOpacity style={styles.suggestionItem} onPress={() => onNext('Nearby')}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="location.fill" size={24} color={colors.textPrimary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.suggestionName}>Nearby</Text>
                        <Text style={styles.suggestionDesc}>Find what's around you</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.suggestionItem} onPress={() => onNext('Vancouver, British Columbia')}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="map.fill" size={24} color={colors.textPrimary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.suggestionName}>Vancouver, British Columbia</Text>
                        <Text style={styles.suggestionDesc}>For sights like Stanley Park</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.suggestionItem} onPress={() => onNext('Calgary, Alberta')}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="building.2.fill" size={24} color={colors.textPrimary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.suggestionName}>Calgary, Alberta</Text>
                        <Text style={styles.suggestionDesc}>For nature-lovers</Text>
                    </View>
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
        // shadow for container if standalone, but parent might handle it
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    suggestionsContainer: {
        marginTop: 10,
    },
    suggestionsTitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    suggestionName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    suggestionDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
