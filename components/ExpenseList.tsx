import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeExpense, ExpenseData} from '../api/api';

interface ExpenseListProps {
  ExpenseData: ExpenseData[] | null;
  refreshData: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ ExpenseData, refreshData }) => {
  
  const handleRemoveExpense = async (id: number | undefined) => {
    await removeExpense(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Fetched Expense Data:</ThemedText>
      {ExpenseData?.map((outcome) => (
        <ThemedView key={outcome.id} style={styles.incomeItem}>
          <ThemedText>
            {`Amount: $${outcome.amount}\nDescription: ${outcome.description}`}
          </ThemedText>
          <Button color="#FF0000" title="Delete" onPress={() => handleRemoveExpense(outcome.id)} />
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
