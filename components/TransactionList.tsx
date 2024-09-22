import React from 'react';
import { useState, useMemo } from 'react';
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

  const combinedTransactions = useMemo(() => {
    if (!incomeData || !outcomeData) return [];

    const combined: (IncomeData | OutcomeData)[] = [
      ...incomeData.map(income => ({ ...income, type: 'income' as const })),
      ...outcomeData.map(outcome => ({ ...outcome, type: 'outcome' as const }))
    ];

    return combined.sort((a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime());
  }, [incomeData, outcomeData]);

  // Remove category
  const handleLongPress = (item: IncomeData | OutcomeData) => {
    setSelectedTransaction(item);
    Alert.alert(
      "Eliminar transacción",
      "¿Está seguro de que quiere eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if ('category' in item) {
              // Es un gasto
              await handleRemoveOutcome('0f58d714-0ec2-40df-8dae-668caf357ac3', item.id ?? 0);
            } else {
              // Es un ingreso
              await handleRemoveIncome('0f58d714-0ec2-40df-8dae-668caf357ac3', item.id ?? 0);
            }
          }
        }
      ]
    );
  };

  const renderTransactionItem = ({ item }: { item: (IncomeData | OutcomeData) }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome 
            name={'category' in item ? "shopping-cart" : "dollar"} 
            size={24} 
            color={'category' in item ? "red" : "green"} 
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.date}>{new Date(item.created_at ?? "").toLocaleDateString()}</ThemedText>
        </View>
        <ThemedText style={[styles.amount, 'category' in item ? styles.outcomeAmount : styles.incomeAmount]}>
          {'category' in item ? '-' : '+'} ${item.amount.toFixed(2)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const handleRemoveIncome = async (profile: string, id: number) => {
    try {
      await removeIncome(profile, id);
      refreshIncomeData();
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
      Alert.alert("Error", "No se pudo eliminar el ingreso. Por favor, intente de nuevo.");
    }
  };

  const handleRemoveOutcome = async (profile: string, id: number) => {
    try {
      await removeOutcome(profile, id);
      refreshOutcomeData();
      refreshCategoryData();
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
      Alert.alert("Error", "No se pudo eliminar el gasto. Por favor, intente de nuevo.");
    }
  };

  return (
    <FlatList
      data={combinedTransactions}
      renderItem={renderTransactionItem}
      keyExtractor={(item) => `${(item as any).type}-${item.id}`}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      scrollEnabled={scrollEnabled}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
    color: 'red',
  },
  incomeAmount: {
    color: 'green',
  },
  outcomeAmount: {
    color: 'red',
  },
});