import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText'

interface BalanceCardProps {
    balance: number | null;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
    return (
        <View style = {style.balanceCard}>
            <ThemedText type="subtitle">Balance total: ${balance !== null ? balance.toFixed(2) : '0.00'}</ThemedText>
        </View>
    );

};

const style = StyleSheet.create({
    balanceCard: {
        padding:16,
        backgroundColor: 'rgba(255,255,255, 0.8)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width:0, height:2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
});