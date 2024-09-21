import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/AddButton';
import useProfileData from '@/hooks/useProfileData';
import { IncomeData, OutcomeData, fetchCurrentProfile } from '../../api/api';

export default function HomeScreen() {

  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

console.log(currentProfileId);
    
  useEffect(() => {

    const fetchProfile = async () => {
      const profileData = await fetchCurrentProfile("juancito@gmail.com");
      setCurrentProfileId(profileData?.current_profile || null);
    };
    fetchProfile();
  }, []);

  const {
    incomeData,
    outcomeData,
    categoryData,
    balance,
    getIncomeData,
    getOutcomeData,
    getCategoryData,
    getBalanceData,
    refreshAllData
  } = useProfileData(currentProfileId || "");

  const totalIncome = useMemo(() => 
    incomeData?.reduce((sum: number, item: IncomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0,
    [incomeData]
  );

  const totalExpenses = useMemo(() => 
    outcomeData?.reduce((sum: number, item: OutcomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0,
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