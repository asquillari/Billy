import React, { useEffect, useState } from 'react';

import { Image, StyleSheet, Button } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { fetchIncomes, getIncome, addIncome, removeIncome, fetchExpenses, getExpense, addExpense, removeExpense, getBalance, IncomeData, ExpenseData } from '../../api/api';

export default function HomeScreen() {

  // Importante! (nota para quien vea esto) los archivos index (este archivo) y explore son de el proyecto predeterminado
  // Habría que cambiarle el nombre
  // Ya que tengo tu atención, otra cosa: Es muy importante separar todas los los componentes del pseudo-xml de abajo, que
  // deberían ir en la carpeta de "components" (era adivinable, sí). Por ejemplo, si tenemos dos botones iguales deberíamos 
  // agregarlo en components para no reutilizar el código (y hacerlo más modular)

  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseData[] | null>(null);
  const [balance, setBalanceData] = useState<number | null>(null);

  // Recupero información
  async function getIncomeData() {
    const data = await fetchIncomes("Juancito");
    setIncomeData(data);
  };

  async function getExpenseData() {
    const data = await fetchExpenses("Juancito");
    setExpenseData(data);
  };

  // Recupero información
  async function getBalanceData() {
    const data = await getBalance("Juancito");
    setBalanceData(data);
  };

  // Hace que se vea desde el principio
  useEffect(() => {
    getIncomeData();
  }, [])

  // Hace que se vea desde el principio
  useEffect(() => {
    getExpenseData();
  }, [])

  // Hace que se vea desde el principio
  useEffect(() => {
    getBalanceData();
  }, [])

  async function handleAddIncome(): Promise<void> {
    // Inserta en la tabla
    await addIncome("Juancito", 123, "Ganando");
    // Actualizo los ingresos
    getIncomeData();
    // Actualizo el balance
    getBalanceData();
  };

  async function handleRemoveIncome(id: number | undefined): Promise<void> {
    // Remueve
    await removeIncome(id, "Juancito");
    // Actualizo
    getIncomeData();
  };

  async function handleAddExpense(): Promise<void> {
    // Inserta en la tabla
    await addExpense("Juancito", 321, "Comida", "Gastando");
    // Actualizo
    getExpenseData();
  };

  async function handleRemoveExpense(id: number | undefined): Promise<void> {
    // Remueve
    await removeExpense(id, "Juancito");
    // Actualizo
    getExpenseData();
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
                {`Amount: $${income.amount}\nDescription: ${income.description}`}
              </ThemedText>
              {/* Botón para borrar */}
              <Button color="#FF0000" title="Delete" onPress={() => handleRemoveIncome(income.id)} />
            </ThemedView>
          ))}
      </ThemedView>

      {/* Botón para agregar */}
      <ThemedView style={styles.stepContainer}>
        <Button title="Insert Income Data" onPress={handleAddIncome}/>
      </ThemedView>

      {/* Display del balance (no funciona) */}
      <ThemedView>
        <ThemedText>
          {`Your balance is $${balance}`}
        </ThemedText>
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
