import React, { useEffect, useState, useCallback } from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';
import { fetchIncomes, fetchOutcomes, getBalance, IncomeData, OutcomeData, CategoryData, fetchCategories } from '../../api/api';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [balance, setBalanceData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = "f5267f06-d68b-4185-a911-19f44b4dc216";
      const [incomes, outcomes, categories, balanceData] = await Promise.all([
        fetchIncomes(userId),
        fetchOutcomes(userId),
        fetchCategories(userId),
        getBalance(userId)
      ]);
      
      setIncomeData(incomes);
      setOutcomeData(outcomes);
      setCategoryData(categories);
      setBalanceData(balanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalIncome = incomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) ?? 0;
  const totalExpenses = outcomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) ?? 0;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#4B00B8', dark: '#20014E'}}
      headerImage={
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/Billy/logo1.png')} style={styles.billyLogo}/>
        </View>
      }>
    
      {isLoading ? (
        <ThemedText>Cargando...</ThemedText>
      ) : (
        <>
          <BalanceCard 
            balance={balance} 
            income={totalIncome}
            expenses={totalExpenses}
            refreshData={fetchData}
          />
          <AddButton refreshIncomeData={fetchData} refreshOutcomeData={fetchData}/>
          <CategoryList categoryData={categoryData} refreshCategoryData={fetchData} refreshAllData={fetchData}/>
          <View>
            <ThemedText style={styles.title}>Actividad reciente</ThemedText>
            <TransactionList 
              incomeData={incomeData} 
              outcomeData={outcomeData} 
              refreshIncomeData={fetchData} 
              refreshOutcomeData={fetchData}
              scrollEnabled={false}
            />
          </View>
        </>
      )}


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
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
  }
});