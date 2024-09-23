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
  currentProfileId: string;
  scrollEnabled?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ incomeData, outcomeData, refreshIncomeData, refreshOutcomeData, refreshCategoryData, currentProfileId, scrollEnabled = true }) => {
  
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

  const handleLongPress = useCallback((transaction: IncomeData | OutcomeData) => {
    setSelectedTransaction(transaction);
    Alert.alert("Eliminar transacción", "¿Está seguro de que quiere eliminar la transacción?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if ((transaction as any).type === "income") handleRemoveIncome(currentProfileId, transaction.id ?? 0);
        else handleRemoveOutcome(currentProfileId, transaction.id ?? 0);
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
    <FlatList data={combinedTransactions} renderItem={renderTransactionItem} keyExtractor={keyExtractor} showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}/>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  outcomeAmount: {
    color: '#F44336',
  },
});