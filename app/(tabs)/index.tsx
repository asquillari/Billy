import React, { useEffect, useState } from 'react';

import { Image, StyleSheet, Button } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { fetchIncomes, getIncome, addIncome, removeIncome, fetchExpenses, getExpense, addExpense, removeExpense, getBalance, IncomeData, ExpenseData } from '../../api/api';

export default function HomeScreen() {

  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseData[] | null>(null);
  const [balance, setBalance] = useState<number | null>(null); // State to store the balance

  // Recupero información
  async function getIncomeData() {
    const data = await fetchIncomes();
    setIncomeData(data);
  };

  // Recupero información
  async function getBalanceData() {
    const data = await getBalance();
    setBalance(data);
  };

  // Hace que se vea desde el principio
  useEffect(() => {
    getIncomeData();
  })

  async function handleAddIncome(): Promise<void> {
    // Nuevo objeto para agregar
    const newIncome = {
      amount: 1000,
      description: "Cobrando"
    };
    // Inserta en la tabla
    await addIncome(newIncome);
    // Actualizo
    getIncomeData();
  };

  async function handleRemoveIncome(id: number | undefined): Promise<void> {
    // Remueve
    await removeIncome(id);
    // Actualiza
    getIncomeData();
  };

  async function getExpenseData() {
    const data = await fetchExpenses();
    setExpenseData(data);
  };

  async function handleAddExpense(): Promise<void> {
    // Nuevo objeto para agregar
    const newExpense = {
      amount: 1000,  
      category: "Ocio",
      description: "Gastando"
    };
    // Inserta en la tabla
    await (newExpense);
    // Actualizo
    getExpenseData();
  };

  async function handleRemoveExpense(id: number | undefined): Promise<void> {
    // Remueve
    await removeExpense(id);
    // Actualiza
    getExpenseData();
  };

  // Doesn assign the balance to anything
  useEffect(() => {
    getBalance();
  });

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
          {balance}
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
