import React from 'react';
import { StyleSheet, View , useColorScheme} from 'react-native';
import { ThemedText } from '@/components/ThemedText'

interface BalanceCardProps {
    balance: number | null;
    refreshData: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, refreshData }) => {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#3C3C3C';

    refreshData();
    
    return (
        <View style={styles.balanceCard}>
            <ThemedText type="subtitle" style={[styles.balanceTotalText, { color: textColor }]}>Balance total:</ThemedText>
            <ThemedText type="title" style={[styles.balanceAmount, { color: textColor }]}>${balance !== null ? balance.toFixed(2) : '0.00'}</ThemedText>
        </View>
    );

};

const styles = StyleSheet.create({
    balanceCard: {
        height: 200,
        width: 345,
        backgroundColor: 'rgba(0, 0, 0, 0.08)', // Cambiado a #00000014
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.05)', // #ffffff0d
        shadowColor: 'rgba(0, 0, 0, 0.25)', // #00000040
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
        padding: 16,
        marginBottom: 16,
        justifyContent: 'flex-start', // Alinea el contenido al principio del contenedor
    },
    balanceTotalText: {
        fontFamily: 'Amethysta-Regular',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 45, // Añadido para bajar el texto
        marginLeft: 63, // Añadido para mover el texto a la derecha
        letterSpacing: -0.28,
    },
    balanceAmount: {
        fontFamily: 'Amethysta-Regular',
        fontSize: 40,
        fontWeight: '400',
        letterSpacing: -2,
        marginTop: 12, // Aumentado para bajar más el número
        marginLeft: 63, // Añadido para alinear con el texto superior
        lineHeight: 48, // Añadido para asegurar que el texto no se corte
    },
});