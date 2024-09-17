import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText'

interface BalanceCardProps {
    balance: number | null;
    refreshData: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, refreshData }) => {
    
    refreshData();
    
    return (
        <View style = {style.balanceCard}>
            <ThemedText type="subtitle" style={{color: 'black'}}>Balance total: ${balance !== null ? balance.toFixed(2) : '0.00'}</ThemedText>
        </View>
    );

};

const style = StyleSheet.create({
    balanceCard: {
        padding:16,
        backgroundColor: '#B29CCA',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width:0, height:2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
});