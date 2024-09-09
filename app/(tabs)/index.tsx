import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Dimensions} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BalanceCard } from '@/components/BalanceCard';
import { FolderList } from '@/components/FolderList';
import { IncomeList } from '@/components/IncomeList';
import AddButton from '@/components/addButton';


import { signUp, fetchIncomes, getIncome, addIncome, removeIncome, fetchExpenses, getExpense, addExpense, removeExpense, getBalance, IncomeData, ExpenseData } from '../../api/api';

//obtengo el porcentaje de la pantalla
const { height } = Dimensions.get('window');



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
    const data = await fetchIncomes("f5267f06-d68b-4185-a911-19f44b4dc216");
    setIncomeData(data);
  };

  // Recupero información
  async function getExpenseData() {
    const data = await fetchExpenses("f5267f06-d68b-4185-a911-19f44b4dc216");
    setExpenseData(data);
  };

  // Recupero información
  async function getBalanceData() {
    const data = await getBalance("f5267f06-d68b-4185-a911-19f44b4dc216");
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

  async function handleAddUser(): Promise<void> {
    // Inserta en la tabla
    await signUp("robertito@gmail.com", "1234", "Roberto", "Tomás");
  }

  async function handleAddIncome(): Promise<void> {
    // Inserta en la tabla
    await addIncome("f5267f06-d68b-4185-a911-19f44b4dc216", 123, "Ganando");
    // Actualizo los ingresos
    getIncomeData();
    // Actualizo el balance
    getBalanceData();
  };

  async function handleRemoveIncome(id: number | undefined): Promise<void> {
    // Remueve
    await removeIncome(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    // Actualizo
    getIncomeData();
  };

  async function handleAddExpense(): Promise<void> {
    // Inserta en la tabla
    await addExpense("f5267f06-d68b-4185-a911-19f44b4dc216", 321, "f9ab4221-1b2e-45e8-b167-bb288c97995c", "Gastando");
    // Actualizo
    getExpenseData();
  };

  async function handleRemoveExpense(id: number | undefined): Promise<void> {
    // Remueve
    await removeExpense(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    // Actualizo
    getExpenseData();
  };



  return (
    <ParallaxScrollView
      headerBackgroundColor= {{light: '#4B00B8', dark: '#20014E'}}
      headerImage={
        <View style = {styles.logoContainer}>
        <Image
          source={require('@/assets/images/Billy/logo1.png')}  // Aquí va tu logo de Billy
          style={styles.reactLogo}
        />
        </View>
      }
    >
      {/* Sección de balance */}
      <BalanceCard balance={balance} />

      {/* Boton para agregar gastos/ingresos*/}
      <AddButton refreshData={getIncomeData}/>

      {/* Sección de Carpetas con scroll horizontal*/}
      <FolderList />

      {/* Sección de Ingresos */}
      <IncomeList incomeData={incomeData} refreshData={getIncomeData} />


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
foldersContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
},
folder: {
  padding: 16,
  backgroundColor: '#E5E5E5',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
addFolderButton: {
  padding: 16,
  backgroundColor: '#A1CEDC',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
addFolderText: {
  fontSize: 24,
  color: '#FFFFFF',
},
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
    height: 100,
    width: 100,
    resizeMode: 'contain',

  },
  logoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 45,
  }
});
