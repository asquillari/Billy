import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeIncome, IncomeData, getBalance } from '../api/api';

interface IncomeListProps {
  incomeData: IncomeData[] | null;
  refreshData: () => void;
}

export const IncomeList: React.FC<IncomeListProps> = ({ incomeData, refreshData }) => {
  
  const handleRemoveIncome = async (id: number | undefined) => {
    await removeIncome(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Ingresos:</ThemedText>
      {incomeData?.map((income) => (
        <ThemedView key={income.id} style={styles.incomeItem}>
          <ThemedText>
            {`Monto: $${income.amount}\nDescripción: ${income.description}`}
          </ThemedText>
          <Button color="#FF0000" title="Eliminar" onPress={() => handleRemoveIncome(income.id)} />
        </ThemedView>
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
