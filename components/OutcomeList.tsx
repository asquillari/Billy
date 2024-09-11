import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeOutcome, OutcomeData} from '../api/api';

interface OutcomeListProps {
  outcomeData: OutcomeData[] | null;
  refreshData: () => void;
}

export const OutcomeList: React.FC<OutcomeListProps> = ({ outcomeData, refreshData }) => {
  
  // For deleting
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeData | null>(null);

  // Remove category
  const handleLongPress = (outcome: OutcomeData) => {
    setSelectedOutcome(outcome);
    Alert.alert("Eliminar gasto", "¿Está seguro de que quiere eliminar el gasto?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if (outcome) {
          handleRemoveOutcome("f5267f06-d68b-4185-a911-19f44b4dc216", outcome.id ?? 0);
        }
      }
    }]);
  };

  const handleRemoveOutcome = async (profile: string, id: number) => {
    await removeOutcome(profile, id);
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Gastos:</ThemedText>
      {outcomeData?.map((outcome) => (
        <TouchableOpacity key={outcome.id} onLongPress={() => handleLongPress(outcome)} style={styles.outcomeItem}>
          <ThemedText>{`Monto: $${outcome.amount}\nDescripción: ${outcome.description}`}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  outcomeItem: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
});
