import React, { useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';
import useProfileData from '@/hooks/useProfileData';
import { IncomeData, OutcomeData, fetchCurrentProfile } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../UserContext';
import { useProfile } from '../ProfileContext';

export default function HomeScreen() {
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const {incomeData, outcomeData, categoryData, balance, getIncomeData, getOutcomeData, getCategoryData, getBalanceData, refreshAllData} = useProfileData(currentProfileId || "");
  
  console.log(userEmail);
  

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      if (profileData && typeof profileData === 'string') {
        setCurrentProfileId(profileData);
      }
    }
  }, [userEmail, setCurrentProfileId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      getCategoryData();
      getIncomeData();
      getOutcomeData();
    }, [fetchProfile])
  );
  
  const totalIncome = useMemo(() => incomeData?.reduce((sum: number, item: IncomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [incomeData]);

  const totalExpenses = useMemo(() => outcomeData?.reduce((sum: number, item: OutcomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [outcomeData]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
        <BillyHeader/>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            
            <BalanceCard balance={balance} incomes={totalIncome} outcomes={totalExpenses} refreshData={getBalanceData}/>
            
            <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData={getCategoryData} currentProfileId={currentProfileId??""}/>
          
            <View style={styles.sectionContainer}> 
              <ThemedText style={styles.title}>Categorías</ThemedText>
              <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData} currentProfileId={currentProfileId??""}/>
            </View>

            <View style={styles.sectionContainer}> 
              <ThemedText style={styles.title}>Actividad reciente</ThemedText>
              <TransactionList incomeData={incomeData} outcomeData={outcomeData} refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData} refreshCategoryData={getCategoryData} currentProfileId={currentProfileId??""} scrollEnabled={false}/>
            </View>

          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    marginHorizontal: '2.5%',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3B3B',
  },
});