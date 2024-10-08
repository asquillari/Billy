import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { removeOutcome, OutcomeData} from '../api/api';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

interface OutcomeListProps {
  outcomeData: OutcomeData[] | null;
  refreshData: () => void;
  currentProfileId: string;
}

export const OutcomeList: React.FC<OutcomeListProps> = ({ outcomeData, refreshData, currentProfileId }) => {
  
  // For deleting
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeData | null>(null);

  const sortedOutcomeData = useMemo(() => {
    return outcomeData?.slice().sort((a, b) => 
      new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime()
    ) ?? [];
  }, [outcomeData]);

  // Remove category
  const handleLongPress = useCallback((outcome: OutcomeData) => {
    setSelectedOutcome(outcome);
    Alert.alert("Eliminar gasto", "¿Está seguro de que quiere eliminar el gasto?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if (outcome) handleRemoveOutcome(currentProfileId, outcome.id ?? "0");
      }
    }]);
  }, [outcomeData]);

  const handleRemoveOutcome = async (profile: string, id: string) => {
    await removeOutcome(profile, id);
    refreshData();
  };

  const renderItem = useCallback(({ item }: { item: OutcomeData }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome name="dollar" size={24} color="red"/>
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.date}>{moment(item.created_at ?? "").format('DD/MM/YYYY')}</ThemedText>
        </View>
        <ThemedText style={styles.amount}>- ${item.amount.toFixed(2)}</ThemedText>
      </View>
    </TouchableOpacity>
  ), [handleLongPress]);

  const keyExtractor = useCallback((item: OutcomeData) => item.id?.toString() || '', []);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedOutcomeData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
});
