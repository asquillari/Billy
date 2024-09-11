import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { removeOutcome, OutcomeData} from '../api/api';

interface OutcomeListProps {
  outcomeData: OutcomeData[] | null;
  refreshData: () => void;
}

export const OutcomeList: React.FC<OutcomeListProps> = ({ outcomeData, refreshData }) => {
  
  const handleRemoveOutcome = async (id: number | undefined) => {
    await removeOutcome(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    refreshData();  // Actualiza los datos después de eliminar
  };

  return (
    <View>
      <ThemedText type="subtitle">Gastos:</ThemedText>
      {outcomeData?.map((outcome) => (
        <ThemedView key={outcome.id} style={styles.outcomeItem}>
          <ThemedText>
            {`Monto: $${outcome.amount}\nDescripción: ${outcome.description}\nCategoría: ${outcome.category}`}
          </ThemedText>
          <Button color="#FF0000" title="Eliminar" onPress={() => handleRemoveOutcome(outcome.id)} />
        </ThemedView>
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
