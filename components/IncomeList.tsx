import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeIncome, IncomeData, getBalance } from '../api/api';

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

  const handleRemoveIncome = async (profile: string, id: number) => {
    await removeIncome(profile, id);
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Ingresos:</ThemedText>
      {incomeData?.map((income) => (
        <TouchableOpacity key={income.id} onLongPress={() => handleLongPress(income)} style={styles.incomeItem}>
          <ThemedText>{`Monto: $${income.amount}\nDescripción: ${income.description}`}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  incomeItem: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
});
