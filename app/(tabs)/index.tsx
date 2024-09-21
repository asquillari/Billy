import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/AddButton';
import useProfileData from '@/hooks/useProfileData';
import { IncomeData, OutcomeData, fetchCurrentProfile } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';

const EMAIL = "juancito@gmail.com";

export default function HomeScreen() {

  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const {incomeData, outcomeData, categoryData, balance, getIncomeData, getOutcomeData, getCategoryData, getBalanceData, refreshAllData} = useProfileData(currentProfileId || "");

  const fetchProfile = useCallback(async () => {
    const profileData = await fetchCurrentProfile(EMAIL);
    setCurrentProfileId(profileData?.current_profile || null);
  }, [setCurrentProfileId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const totalIncome = useMemo(() => incomeData?.reduce((sum: number, item: IncomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [incomeData]);

  const totalExpenses = useMemo(() => outcomeData?.reduce((sum: number, item: OutcomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [outcomeData]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} start={{x: 1, y: 0}} end={{x: 0, y: 1}} style={styles.gradientContainer}>
        <BillyHeader/>
        <ScrollView style={styles.scrollView}>
          <View style={styles.rectangle}>

            <BalanceCard balance={balance} incomes={totalIncome} outcomes={totalExpenses} refreshData={getBalanceData}/>
              
            <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData={getCategoryData} currentProfileId={currentProfileId??""}/>
            
            <View style={{paddingHorizontal: 10}}> 
              <ThemedText style={styles.title}>Categorías</ThemedText>
              <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData} currentProfileId={currentProfileId??""}/>
            </View>

            <View style={{paddingHorizontal: 10}}> 
              <ThemedText style={styles.title}>Actividad reciente</ThemedText>
              <TransactionList incomeData={incomeData} outcomeData={outcomeData} refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData = {getCategoryData} currentProfileId={currentProfileId??""} scrollEnabled={false}/>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
 
      
 {/* Botones para Sign Up y Login */}
     {/* <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleAddUser} />
        {signUpMessage && <Text>{signUpMessage}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
        {loginMessage && <Text>{loginMessage}</Text>}
      </View>*/}

    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom:10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3B3B',
  },
  gradientContainer: {
    flex: 1,
    paddingTop: 10,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  rectangle: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    minHeight: '100%',
    width: '95%',
    alignSelf: 'center',
    padding: 15,
  },
});