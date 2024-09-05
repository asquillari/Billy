import { Image, StyleSheet} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { fetchIncomes, addIncome, removeIncome, IncomeData, ExpenseData } from '../api/api';
import { Button } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function HomeScreen() {

  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);

  // Recupero información
  const getIncomeData = async () => {
    const data = await fetchIncomes();
    setIncomeData(data);
  };

  // Esto hace que se pueda usar la función 
  useEffect(() => {
    getIncomeData();
  }, []);

  const handleInsertData = async (): Promise<void> => {
    // Nuevo objeto para agregar
    const newIncome = {
      amount: 1000,  
    };
    // Inserta en la tabla
    const result = await addIncome(newIncome);
    // Actualizo
    getIncomeData();
  };

  const handleDeleteData = async (id: number | undefined): Promise<void> => {
    // Remueve
    await removeIncome(id);
    // Actualiza
    getIncomeData();
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Visualizador de información */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Fetched Income Data:</ThemedText>
          {incomeData?.map((income) => (
            <ThemedView key={income.id}>
              <ThemedText>
                {`Amount: $${income.amount}\nDate: ${income.created_at}`}
              </ThemedText>
              {/* Botón para borrar */}
              <Button color="#FF0000" title="Delete" onPress={() => handleDeleteData(income.id)} />
            </ThemedView>
          ))}
      </ThemedView>

      {/* Botón para agregar */}
      <ThemedView style={styles.stepContainer}>
        <Button title="Insert Income Data" onPress={handleInsertData}/>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
