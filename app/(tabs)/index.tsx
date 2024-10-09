import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/addButton';
import { fetchCurrentProfile, getSharedUsers, isProfileShared, changeCurrentProfile, fetchProfiles } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedBalanceCard } from '@/components/SharedBalanceCard';
import { useAppContext } from '@/hooks/useAppContext';

export default function HomeScreen() {
  const { user, currentProfileId, setCurrentProfileId, refreshAllData } = useAppContext();

  const [shared, setShared] = useState<boolean | null>(null);
  const [sharedUsers, setSharedUsers] = useState<string[] | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.email) return false;
  
    let profileChanged = false;
    let currentProfile = await fetchCurrentProfile(user.email);
  
    if (!currentProfile || typeof currentProfile !== 'string' || currentProfile.trim() === '') {
      const profiles = await fetchProfiles(user.email);
      if (!profiles || profiles.length === 0) {
        console.error('No profiles found for the user');
        setShared(false);
        setSharedUsers(null);
        return true;
      }
      currentProfile = profiles[0].id;
      await changeCurrentProfile(user.email, currentProfile);
      profileChanged = true;
    }
  
    if (currentProfile !== currentProfileId) {
      setCurrentProfileId(currentProfile);
      profileChanged = true;
    }
  
    const isShared = await isProfileShared(currentProfile);
    if (isShared !== shared) {
      setShared(isShared);
      profileChanged = true;
    }
  
    const users = isShared ? await getSharedUsers(currentProfile) : null;
    if (JSON.stringify(users) !== JSON.stringify(sharedUsers)) {
      setSharedUsers(users);
      profileChanged = true;
    }
  
    return profileChanged;
  }, [user?.email, setCurrentProfileId, currentProfileId, shared, sharedUsers]);
  
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchData = async () => {
        if (isMounted) {
          const profileChanged = await fetchProfile();
          if (isMounted && profileChanged) await refreshAllData();
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