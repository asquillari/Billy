import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeExpense, ExpenseData} from '../api/api';

interface ExpenseListProps {
  expenseData: ExpenseData[] | null;
  refreshData: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenseData, refreshData }) => {
  
  const handleRemoveExpense = async (id: number | undefined) => {
    await removeExpense(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Fetched Expense Data:</ThemedText>
      {expenseData?.map((expense) => (
        <ThemedView key={expense.id} style={styles.expenseItem}>
          <ThemedText>
            {`Amount: $${expense.amount}\nDescription: ${expense.description}`}
          </ThemedText>
          <Button color="#FF0000" title="Delete" onPress={() => handleRemoveExpense(expense.id)} />
        </ThemedView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  expenseItem: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
});
