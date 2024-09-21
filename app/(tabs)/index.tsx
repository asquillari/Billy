import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/AddButton';
import { fetchIncomes, fetchOutcomes, getBalance, IncomeData, OutcomeData, CategoryData, fetchCategories } from '../../api/api';

const PROFILE_ID = "f5267f06-d68b-4185-a911-19f44b4dc216";

export default function HomeScreen() {
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [balance, setBalanceData] = useState<number | null>(null);

  const getIncomeData = useCallback(async () => {
    const data = await fetchIncomes(PROFILE_ID);
    setIncomeData(data);
  }, []);

  const getOutcomeData = useCallback(async () => {
    const data = await fetchOutcomes(PROFILE_ID);
    setOutcomeData(data);
  }, []);

  const getCategoryData = useCallback(async () => {
    const data = await fetchCategories(PROFILE_ID);
    setCategoryData(data);
  }, []);
  
  const getBalanceData = useCallback(async () => {
    const data = await getBalance(PROFILE_ID);
    setBalanceData(data);
  }, []);

  const refreshAllData = useCallback(() => {
    getIncomeData();
    getOutcomeData();
    getBalanceData();
    getCategoryData();
  }, [getIncomeData, getOutcomeData, getBalanceData, getCategoryData]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const totalIncome = useMemo(() => 
    incomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) ?? 0,
    [incomeData]
  );

  const totalExpenses = useMemo(() => 
    outcomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) ?? 0,
    [outcomeData]
  );

  const headerImage = useMemo(() => (
    <View style={styles.logoContainer}>
      <Image source={require('@/assets/images/Billy/logo1.png')} style={styles.billyLogo}/>
    </View>
  ), []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#4B00B8', dark: '#20014E'}}
      headerImage={headerImage}>
        <>
          <BalanceCard balance={balance} incomes={totalIncome} outcomes={totalExpenses} refreshData={getBalanceData}/>
          
          <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData={getCategoryData}/>
          
          <View>
            <ThemedText style={styles.title}>Categorías</ThemedText>
            <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData}/>
          </View>

          <View>
            <ThemedText style={styles.title}>Actividad reciente</ThemedText>
            <TransactionList incomeData={incomeData} outcomeData={outcomeData} refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData = {getCategoryData} scrollEnabled={false}/>
          </View>
        </>
      


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
  billyLogo: {
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
  title: {
    marginBottom:10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
  }
});