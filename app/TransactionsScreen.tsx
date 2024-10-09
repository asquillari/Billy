import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TransactionList } from '@/components/TransactionList';
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from './contexts/ProfileContext';
import useProfileData from '@/hooks/useProfileData';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCurrentProfile } from '@/api/api';
import { useUser } from './contexts/UserContext';

export default function TransactionsScreen() {
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const { incomeData, outcomeData, getIncomeData, getOutcomeData, getCategoryData } = useProfileData(currentProfileId || "");

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      if (profileData && typeof profileData === 'string' && profileData.trim() !== '') setCurrentProfileId(profileData);
      else console.error('Invalid or empty profile ID received');
    }
  }, [userEmail, setCurrentProfileId]);

  const fetchData = useCallback(async () => {
    await fetchProfile();
    await Promise.all([getCategoryData(), getIncomeData(), getOutcomeData()]);
  }, [fetchProfile, getCategoryData, getIncomeData, getOutcomeData]);

  useFocusEffect(useCallback(() => {
    fetchData();
  }, [fetchData]));

  const memoizedTransactionList = useMemo(() => (
    <TransactionList
      incomeData={incomeData}
      outcomeData={outcomeData}
      refreshIncomeData={getIncomeData}
      refreshOutcomeData={getOutcomeData}
      refreshCategoryData={getCategoryData}
      currentProfileId={currentProfileId || ""}
      scrollEnabled={true}
      showHeader={false}
      timeRange='all'
    />
  ), [incomeData, outcomeData, getIncomeData, getOutcomeData, getCategoryData, currentProfileId]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
        <BillyHeader title="Transacciones" subtitle="Historial de ingresos y gastos" />
        <View style={styles.contentContainer}>
          {memoizedTransactionList}
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
    padding: 15,
  },
});