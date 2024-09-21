import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { removeIncome, IncomeData, removeOutcome, OutcomeData} from '../api/api';
import { FontAwesome } from '@expo/vector-icons';

interface TransactionListProps {
  incomeData: IncomeData[] | null;
  outcomeData: OutcomeData[] | null;
  refreshIncomeData: () => void;
  refreshOutcomeData: () => void;
  refreshCategoryData: () => void;
  scrollEnabled?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ incomeData, outcomeData, refreshIncomeData, refreshOutcomeData, refreshCategoryData, scrollEnabled = true }) => {
  
  // For deleting
  const [selectedTransaction, setSelectedTransaction] = useState<IncomeData | OutcomeData | null>(null);

  const sortTransactions = useCallback((transactions: (IncomeData | OutcomeData)[]) => {
    return transactions.sort((a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime());
  }, []);
  
  const combinedTransactions = useMemo(() => {
    if (!incomeData || !outcomeData) return [];
    const combined = [
      ...incomeData.map(income => ({ ...income, type: 'income' as const })),
      ...outcomeData.map(outcome => ({ ...outcome, type: 'outcome' as const }))
    ];
    return sortTransactions(combined);
  }, [incomeData, outcomeData, sortTransactions]);

  // Remove category
  const handleLongPress = useCallback((transaction: IncomeData | OutcomeData) => {
    setSelectedTransaction(transaction);
    Alert.alert("Eliminar transacción", "¿Está seguro de que quiere eliminar la transacción?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if ((transaction as any).type === "income") handleRemoveIncome("f5267f06-d68b-4185-a911-19f44b4dc216", transaction.id ?? 0);
        else handleRemoveOutcome("f5267f06-d68b-4185-a911-19f44b4dc216", transaction.id ?? 0);
      }
    }]);
  }, [refreshIncomeData, refreshOutcomeData, refreshCategoryData]);

  const handleRemoveIncome = async (profile: string, id: number) => {
    await removeIncome(profile, id);
    refreshIncomeData();  // Actualiza los datos después de eliminar
  };

  const handleRemoveOutcome = async (profile: string, id: number) => {
    await removeOutcome(profile, id);
    refreshOutcomeData();   // Actualiza los datos después de eliminar
    refreshCategoryData();  // Las categorías muestran lo gastado, por lo que hay que actualizarlas

  };

  const renderTransactionItem = useCallback(({ item }: { item: (IncomeData | OutcomeData) }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome name={(item as any).type === 'income' ? "dollar" : "shopping-cart"} size={24} color={(item as any).type === 'income' ? "green" : "red"}/>
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.date}>{new Date(item.created_at??"").toLocaleDateString()}</ThemedText>
        </View>
        <ThemedText style={[styles.amount, (item as any).type === 'income' ? styles.incomeAmount : styles.outcomeAmount]}>
          {(item as any).type === 'income' ? '+' : '-'} ${item.amount.toFixed(2)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  ), [handleLongPress]);

  const keyExtractor = useCallback((item: IncomeData | OutcomeData) => `${(item as any).type}-${item.id}`, []);

  return (
    <FlatList
      data={combinedTransactions}
      renderItem={renderTransactionItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
    />
  );
};

const styles = StyleSheet.create({
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
    color: 'red',
  },
  incomeAmount: {
    color: 'green',
  },
  outcomeAmount: {
    color: 'red',
  },
});