import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WhenStep } from './WhenStep';
import { WhereStep } from './WhereStep';
import { WhoStep } from './WhoStep';

interface FilterFlowProps {
    onComplete: (data: any) => void;
}

export function FilterFlow({ onComplete }: FilterFlowProps) {
    const [step, setStep] = useState(0); // 0: Where, 1: When, 2: Who
    const [where, setWhere] = useState('');
    const [when, setWhen] = useState('');
    const [guests, setGuests] = useState({ adults: 0, children: 0 });

    const handleWhereNext = (location: string) => {
        setWhere(location);
        setStep(1);
    };

    const handleWhenNext = (dateRange: string) => {
        setWhen(dateRange);
        setStep(2);
    };

    const handleUpdateGuests = (key: string, val: number) => {
        setGuests(prev => ({ ...prev, [key]: val }));
    };

    const handleSearch = () => {
        onComplete({ where, when, guests });
    };

    const handleClearAll = () => {
        setWhere('');
        setWhen('');
        setGuests({ adults: 0, children: 0 });
        setStep(0);
    };

    return (
        <View style={styles.container}>
            {/* Where Step */}
            <TouchableOpacity onPress={() => setStep(0)} activeOpacity={1}>
                <WhereStep
                    isActive={step === 0}
                    onNext={handleWhereNext}
                    value={where}
                />
            </TouchableOpacity>

            {/* When Step */}
            {step >= 0 && (
                <TouchableOpacity onPress={() => setStep(1)} activeOpacity={1}>
                    <WhenStep
                        isActive={step === 1}
                        onNext={handleWhenNext}
                        value={when}
                    />
                </TouchableOpacity>
            )}

            {/* Who Step */}
            {step >= 1 && (
                <TouchableOpacity onPress={() => setStep(2)} activeOpacity={1}>
                    <WhoStep
                        isActive={step === 2}
                        onSearch={handleSearch}
                        onClear={handleClearAll}
                        guests={guests}
                        onUpdateGuests={handleUpdateGuests}
                    />
                </TouchableOpacity>
            )}

            <View style={styles.footerSpacing} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Light gray background for the overall screen
        padding: 20,
    },
    footerSpacing: {
        flex: 1,
    },
});
