import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, FlatList, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { removeIncome, IncomeData, removeOutcome, OutcomeData} from '../api/api';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/es';
import { useNavigation } from '@react-navigation/native';

moment.locale('es');

interface TransactionListProps {
  incomeData: IncomeData[] | null;
  outcomeData: OutcomeData[] | null;
  refreshIncomeData: () => void;
  refreshOutcomeData: () => void;
  refreshCategoryData?: () => void;
  currentProfileId: string;
  scrollEnabled?: boolean;
  showHeader?: boolean;
  timeRange: 'all' | 'day' | 'week' | 'month' | 'year';
}

export const TransactionList: React.FC<TransactionListProps> = ({ incomeData, outcomeData, refreshIncomeData, refreshOutcomeData, refreshCategoryData, currentProfileId, scrollEnabled = true, showHeader, timeRange}) => {
  const navigation = useNavigation();
  const [selectedTransaction, setSelectedTransaction] = useState<IncomeData | OutcomeData | null>(null);

  // Ordeno por fecha de creación
  const sortTransactions = useCallback((transactions: (IncomeData | OutcomeData)[]) => {
    return transactions.sort((a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime());
  }, []);
  
  // Agrupo los ingresos y egresos
  const groupedTransactions = useMemo(() => {
    if (!incomeData || !outcomeData) return [];
    const combined = [
      ...incomeData.map(income => ({ ...income, type: 'income' as const })),
      ...outcomeData.map(outcome => ({ ...outcome, type: 'outcome' as const }))
    ];
    const sorted = sortTransactions(combined);
    
    // Y los filtro por el rango pedido
    const filteredTransactions = sorted.filter(transaction => {
      const transactionDate = moment(transaction.created_at);
      const now = moment();
      
      switch (timeRange) {
        case 'day':
          return transactionDate.isSameOrAfter(now.clone().startOf('day'));
        case 'week':
          return transactionDate.isSameOrAfter(now.clone().startOf('week'));
        case 'month':
          return transactionDate.isSameOrAfter(now.clone().startOf('month'));
        case 'year':
          return transactionDate.isSameOrAfter(now.clone().startOf('year'));
        default:
          return true;
      }
    });

    // Extrae las fechas de cada transacción y las agrupa
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const date = moment(transaction.created_at).format('YYYY-MM-DD');
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, (IncomeData | OutcomeData)[]>);

    return Object.entries(grouped).map(([date, transactions]) => ({ date, data: transactions }));
  }, [incomeData, outcomeData, sortTransactions, timeRange]);

  const handleLongPress = useCallback((transaction: IncomeData | OutcomeData) => {
    setSelectedTransaction(transaction);
    Alert.alert("Eliminar transacción", "¿Está seguro de que quiere eliminar la transacción?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if ((transaction as any).type === "income") handleRemoveIncome(currentProfileId, transaction.id ?? "");
        else handleRemoveOutcome(currentProfileId, transaction.id ?? "");
      }
    }]);
  }, [refreshIncomeData, refreshOutcomeData, refreshCategoryData]);

  const handleRemoveIncome = async (profile: string, id: string) => {
    await removeIncome(profile, id);
    refreshIncomeData();
  };

  const handleRemoveOutcome = async (profile: string, id: string) => {
    await removeOutcome(profile, id);
    refreshOutcomeData();
    refreshCategoryData?.();  // Las categorías muestran lo gastado, por lo que hay que actualizarlas 
  };

  const renderTransactionItem = useCallback(({ item }: { item: IncomeData | OutcomeData }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome name={(item as any).type === 'income' ? "dollar" : "shopping-cart"} size={24} color={(item as any).type === 'income' ? "green" : "red"}/>
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
        </View>
        <ThemedText style={[styles.amount, (item as any).type === 'income' ? styles.incomeAmount : styles.outcomeAmount]}>
          {(item as any).type === 'income' ? '+' : '-'} ${item.amount.toFixed(2)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  ), [handleLongPress]);

  const renderDateHeader = useCallback(({ date }: { date: string }) => (
    <View style={styles.dateHeader}>
      <ThemedText style={styles.dateText}>{moment(date).format('DD [de] MMMM[,] YYYY')}</ThemedText>
    </View>
  ), []);

  return (
    <View>
      {showHeader && (
        <View style={styles.rowContainer}>
          <Text style={styles.transactionsTitle}>Actividad reciente</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionsScreen' as never)}>
            <Text style={styles.viewMoreText}>Ver más</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={groupedTransactions}
        renderItem={({ item }) => (
          <>
            {renderDateHeader({ date: item.date })}
            {item.data.map((transaction) => renderTransactionItem({ item: transaction }))}
          </>
        )}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      />
    </View>
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
  dateHeader: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewMoreText: {
    color: '#4B00B8',
    textDecorationLine: 'underline',
  },
});