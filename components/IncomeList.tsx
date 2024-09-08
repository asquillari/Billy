import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeIncome, IncomeData } from '../api/api';

interface IncomeListProps {
  incomeData: IncomeData[] | null;
  refreshData: () => void;
}

export const IncomeList: React.FC<IncomeListProps> = ({ incomeData, refreshData }) => {
  const handleRemoveIncome = async (id: number | undefined) => {
    await removeIncome(id, "Juancito");
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Fetched Income Data:</ThemedText>
      {incomeData?.map((income) => (
        <ThemedView key={income.id} style={styles.incomeItem}>
          <ThemedText>
            {`Amount: $${income.amount}\nDescription: ${income.description}`}
          </ThemedText>
          <Button color="#FF0000" title="Delete" onPress={() => handleRemoveIncome(income.id)} />
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
    backgroundColor: '#f0f4f8',
  },
});
