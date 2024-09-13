import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Dimensions, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import { IncomeList } from '@/components/IncomeList';
import { OutcomeList } from '@/components/OutcomeList';
import AddButton from '@/components/addButton';

import { signUp, logIn, fetchIncomes, getIncome, addIncome, removeIncome, fetchOutcomes, getOutcome, addOutcome, removeOutcome, getBalance, IncomeData, OutcomeData } from '../../api/api';
import { Button } from 'react-native';

//obtengo el porcentaje de la pantalla
const { height } = Dimensions.get('window');

export default function HomeScreen() {

  // Importante! (nota para quien vea esto) los archivos index (este archivo) y explore son de el proyecto predeterminado
  // Habría que cambiarle el nombre
  // Ya que tengo tu atención, otra cosa: Es muy importante separar todas los los componentes del pseudo-xml de abajo, que
  // deberían ir en la carpeta de "components" (era adivinable, sí). Por ejemplo, si tenemos dos botones iguales deberíamos 
  // agregarlo en components para no reutilizar el código (y hacerlo más modular)
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [balance, setBalanceData] = useState<number | null>(null);

  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  // Recupero información
  async function getIncomeData() {
    const data = await fetchIncomes("f5267f06-d68b-4185-a911-19f44b4dc216");
    setIncomeData(data);
  };

  // Recupero información
  async function getOutcomeData() {
    const data = await fetchOutcomes("f5267f06-d68b-4185-a911-19f44b4dc216");
    setOutcomeData(data);
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
    getOutcomeData();
  }, [])

  // Hace que se vea desde el principio
  useEffect(() => {
    getBalanceData();
  }, [])

  async function handleAddUser(): Promise<void> {
    // Inserta en la tabla
    try {
      await signUp("agos@gmail.com", "1234", "agos", "squillari");
      setSignUpMessage("Sign up successful!");
    } catch (error) {
      setSignUpMessage("Sign up failed.");
    }
  }

  async function handleLogin(): Promise<void> {
    try {
      await logIn("agos@gmail.com", "1234");
      setLoginMessage("Login successful!");
    } catch (error) {
      setLoginMessage("Login failed.");
    }
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

  async function handleAddOutcome(): Promise<void> {
    // Inserta en la tabla
    await addOutcome("f5267f06-d68b-4185-a911-19f44b4dc216", 321, "f9ab4221-1b2e-45e8-b167-bb288c97995c", "Gastando");
    // Actualizo
    getOutcomeData();
  };

  async function handleRemoveOutcome(id: number | undefined): Promise<void> {
    // Remueve
    await removeOutcome(id, "f5267f06-d68b-4185-a911-19f44b4dc216");
    // Actualizo
    getOutcomeData();
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
      <BalanceCard balance={balance} refreshData={getBalanceData} />

      {/* Boton para agregar gastos/ingresos*/}
      <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData}/>

      {/* Sección de Carpetas con scroll horizontal*/}
      <CategoryList/>

      {/* Sección de Ingresos */}
      <IncomeList incomeData={incomeData} refreshData={getIncomeData} />

      {/* Sección de Egresos */}
      <OutcomeList outcomeData={outcomeData} refreshData={getOutcomeData} />

      {/* Botones para Sign Up y Login */}
     {/* <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleAddUser} />
        {signUpMessage && <Text>{signUpMessage}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
        {loginMessage && <Text>{loginMessage}</Text>}
      </View>*/}

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
    height: 100,
    width: 100,
    resizeMode: 'contain',

  },
  logoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 45,
  },
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
  }
});
