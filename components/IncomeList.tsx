import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, View, Alert, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeIncome, IncomeData, getBalance } from '../api/api';

import { FontAwesome } from '@expo/vector-icons';

interface IncomeListProps {
  incomeData: IncomeData[] | null;
  refreshData: () => void;
}

export const IncomeList: React.FC<IncomeListProps> = ({ incomeData, refreshData }) => {

  // For deleting
  const [selectedIncome, setSelectedIncome] = useState<IncomeData | null>(null);

  // Remove category
  const handleLongPress = (income: IncomeData) => {
    setSelectedIncome(income);
    Alert.alert("Eliminar ingreso", "¿Está seguro de que quiere eliminar el ingreso?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if (income) {
          handleRemoveIncome("f5267f06-d68b-4185-a911-19f44b4dc216", income.id ?? 0)
        }
      }
    }]);
  };

  const renderItem = ({ item }: { item: IncomeData }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <FontAwesome name="dollar" size={24} color="green" />
            </View>
            <View style={styles.textContainer}>
                <ThemedText style={styles.description}>{item.description}</ThemedText>
                <ThemedText style={styles.date}>{new Date(item.created_at??"null").toLocaleDateString()}</ThemedText>
            </View>
            <ThemedText style={styles.amount}>+ ${item.amount.toFixed(2)}</ThemedText>
        </View>
    </TouchableOpacity>
  );

  const handleRemoveIncome = async (profile: string, id: number) => {
    await removeIncome(profile, id);
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View style={styles.container}>
      <FlatList
          data={incomeData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || ''}
          showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: 18,
        color: '#555',
        fontWeight: '400',
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
});
