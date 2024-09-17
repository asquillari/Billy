import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

interface BalanceCardProps {
    balance: number | null;
    incomes: number | null;
    outcomes: number | null;
    refreshData: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, incomes, outcomes, refreshData }) => {

    refreshData();

    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#3B3B3B';

    return (
        <View style={styles.box}>
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.08)']}
                style={styles.balanceCard}
            >
                <ThemedText type="subtitle" style={[styles.balanceTotalText, { color: textColor }]}>Balance total:</ThemedText>
                <ThemedText type="title" style={[styles.balanceAmount, { color: textColor }]}>${balance !== null ? balance.toFixed(2) : '0.00'}</ThemedText>
                <View style={styles.ingresosGastosCard}>
                    <View style={styles.ingresosCard}>
                        <View style={styles.ingresoPlata}>
                            <ThemedText style={[styles.textWrapper, { color: textColor }]}>Ingresos</ThemedText>
                            <ThemedText style={[styles.amount, { color: textColor }]}>
                                ${incomes?.toFixed(2) ?? '0.00'}
                            </ThemedText>
                        </View>
                    </View>
                    <View style={styles.gastosCard}>
                        <View style={styles.gastoPlata}>
                            <ThemedText style={[styles.textWrapper, { color: textColor }]}>Gastos</ThemedText>
                            <ThemedText style={[styles.amount, { color: textColor }]}>
                                ${outcomes?.toFixed(2) ?? '0.00'}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        height: 201,
        width: 345,
    },
    balanceCard: {
        height: 201,
        width: 345,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    balanceTotalText: {
        fontSize: 14,
        fontWeight: '400',
        position: 'absolute',
        top: 25,
        left: 79,
        letterSpacing: -0.28,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: '400',
        position: 'absolute',
        top: 45,
        left: 79,
        letterSpacing: -2,
        lineHeight: 48,
    },
    ingresosGastosCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 128,
        left: 21,
        width: 300,
    },
    ingresosCard: {
        backgroundColor: 'rgba(66, 1, 161, 0.08)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        height: 52,
        width: 141,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gastosCard: {
        backgroundColor: 'rgba(66, 1, 161, 0.08)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        height: 52,
        width: 141,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingresoPlata: {
        alignItems: 'center',
    },
    gastoPlata: {
        alignItems: 'center',
    },
    textWrapper: {
        fontSize: 10,
        fontWeight: '400',
        letterSpacing: -0.5,
    },
    amount: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: -0.7,
        marginTop: -10,
    },
});

