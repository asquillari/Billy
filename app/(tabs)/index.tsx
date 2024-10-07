import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';
import useProfileData from '@/hooks/useProfileData';
import { IncomeData, OutcomeData, fetchCurrentProfile, getSharedUsers, isProfileShared } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../contexts/UserContext';
import { useProfile } from '../contexts/ProfileContext';
import { SharedBalanceCard } from '@/components/SharedBalanceCard';

export default function HomeScreen() {
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const { incomeData, outcomeData, categoryData, balance, getIncomeData, getOutcomeData, getCategoryData, getBalanceData, refreshAllData } = useProfileData(currentProfileId || "");
  const [shared, setShared] = useState<boolean | null>(null);
  const [sharedUsers, setSharedUsers] = useState<string[] | null>(null);

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      if (profileData && typeof profileData === 'string' && profileData.trim() !== '') {
        setCurrentProfileId(profileData);
        const isShared = await isProfileShared(profileData);
        setShared(isShared);
        if (isShared) {
          const users = await getSharedUsers(profileData);
          setSharedUsers(users);
        }
      } else {
        console.error('Invalid or empty profile ID received');
        setShared(false);
        setSharedUsers(null);
      }
    }
  }, [userEmail, setCurrentProfileId]);
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchProfile();
        await Promise.all([ getCategoryData(), getIncomeData(), getOutcomeData() ]);
      };
      fetchData();
    }, [fetchProfile, getCategoryData, getIncomeData, getOutcomeData])
  );
  
  const { totalIncome, totalExpenses } = useMemo(() => {
    const income = incomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;
    const expenses = outcomeData?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;
    return { totalIncome: income, totalExpenses: expenses };
  }, [incomeData, outcomeData]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
        <BillyHeader/>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            
            { !shared && (
            <BalanceCard balance={balance} incomes={totalIncome} outcomes={totalExpenses} refreshData={getBalanceData}/>
              )}  

             { shared && (
              <SharedBalanceCard refreshData={getBalanceData} sharedUsers={sharedUsers || []}/> 
             )}  

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