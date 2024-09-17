import React, { useEffect, useState, useCallback } from 'react';
import { Image, StyleSheet, View, Dimensions} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';

import { ThemedText } from '@/components/ThemedText';

import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';

import { fetchIncomes, fetchOutcomes, getBalance, IncomeData, OutcomeData, CategoryData, fetchCategories } from '../../api/api';

//obtengo el porcentaje de la pantalla
const { height } = Dimensions.get('window');

export default function HomeScreen() {

  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [balance, setBalanceData] = useState<number | null>(null);

  async function getIncomeData() {
    const data = await fetchIncomes("f5267f06-d68b-4185-a911-19f44b4dc216");
    setIncomeData(data);
  };

  async function getOutcomeData() {
    const data = await fetchOutcomes("f5267f06-d68b-4185-a911-19f44b4dc216");
    setOutcomeData(data);
  };

  async function getCategoryData() {
    const data = await fetchCategories("f5267f06-d68b-4185-a911-19f44b4dc216");
    setCategoryData(data);
  };
  
  async function getBalanceData() {
    const data = await getBalance("f5267f06-d68b-4185-a911-19f44b4dc216");
    setBalanceData(data);
  };

  const refreshAllData = useCallback(() => {
    getIncomeData();
    getOutcomeData();
    getBalanceData();
    getCategoryData();
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#4B00B8', dark: '#20014E'}}
      headerImage={
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/Billy/logo1.png')} style={styles.billyLogo}/>
        </View>
      }>
    
      <BalanceCard balance={balance} refreshData={getBalanceData}/>
      <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData}/>
      <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData}/>
      <View>
        <ThemedText style={styles.title}>Actividad reciente</ThemedText>
        <TransactionList 
          incomeData={incomeData} 
          outcomeData={outcomeData} 
          refreshIncomeData={getIncomeData} 
          refreshOutcomeData={getOutcomeData}
          scrollEnabled={false}
        />
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
