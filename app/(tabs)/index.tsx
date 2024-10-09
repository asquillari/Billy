import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';
import { fetchCurrentProfile, getSharedUsers, isProfileShared } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedBalanceCard } from '@/components/SharedBalanceCard';
import { useAppContext } from '@/hooks/useAppContext';

export default function HomeScreen() {
  const { 
    user, 
    currentProfileId, 
    setCurrentProfileId, 
    incomeData, 
    outcomeData, 
    balance, 
    refreshBalanceData, 
    refreshAllData 
  } = useAppContext();

  const [shared, setShared] = useState<boolean | null>(null);
  const [sharedUsers, setSharedUsers] = useState<string[] | null>(null);

  const fetchProfile = useCallback(async () => {
    if (user?.email) {
      const profileData = await fetchCurrentProfile(user.email);
      if (profileData && typeof profileData === 'string' && profileData.trim() !== '') {
        setCurrentProfileId(profileData);
        const isShared = await isProfileShared(profileData);
        setShared(isShared);
        if (isShared) {
          const users = await getSharedUsers(profileData);
          setSharedUsers(users);
        }
      } 
      else {
        console.error('Invalid or empty profile ID received');
        setShared(false);
        setSharedUsers(null);
      }
    }
  }, [user?.email, setCurrentProfileId]);
  
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchData = async () => {
        if (isMounted) {
          await fetchProfile();
          if (isMounted) await refreshAllData();
        }
      };
      fetchData();
      return () => { isMounted = false; };
    }, [fetchProfile, refreshAllData])
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
        <BillyHeader/>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            
          {!shared && (
            <BalanceCard/>
          )}

          {shared && (
            <View style={styles.sharedBalanceContainer}>
              <SharedBalanceCard/> 
              <View style={styles.addButtonContainer}>
                <AddButton/>
              </View>
            </View>
          )}  

          {!shared && (
            <AddButton/>
          )}
          
          <View style={styles.sectionContainer}> 
            <CategoryList showHeader={true}/>
          </View>

          <View style={styles.sectionContainer}> 
            <TransactionList scrollEnabled={false} showHeader={true} timeRange='month'/>
          </View>

          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  sharedBalanceContainer: {
    position: 'relative',
  },
  addButtonContainer: {
    position: 'absolute',
    top: 235,
    right: -5,
  },
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