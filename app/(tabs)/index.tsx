import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Dimensions, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BalanceCard } from '@/components/BalanceCard';
import { CategoryList } from '@/components/CategoryList';
import AddButton from '@/components/AddButton';
import useProfileData from '@/hooks/useProfileData';
import { IncomeData, OutcomeData, fetchCurrentProfile } from '../../api/api';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StatusBar } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RouteParams = {
  userEmail: string;
};

//obtengo el porcentaje de la pantalla
const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const userEmail = route.params?.userEmail as string | undefined;

  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const {incomeData, outcomeData, categoryData, balance, getIncomeData, getOutcomeData, getCategoryData, getBalanceData, refreshAllData} = useProfileData(currentProfileId || "");

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        if (userEmail) {
          const profile = await fetchCurrentProfile(userEmail);
          setCurrentProfileId(profile?.current_profile || null);
        }
      };
      fetchProfile();
    }, [userEmail])
  );

  const totalIncome = useMemo(() => incomeData?.reduce((sum: number, item: IncomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [incomeData]);

  const totalExpenses = useMemo(() => outcomeData?.reduce((sum: number, item: OutcomeData) => sum + parseFloat(item.amount.toString()), 0) ?? 0, [outcomeData]);

  return (
    <ParallaxScrollView
      headerBackgroundColor= {{light: '#4B00B8', dark: '#20014E'}}
      headerImage={
        <View style = {styles.logoContainer}>
        <Image
          source={require('@/assets/images/Billy/logo1.png')}  // Aquí va tu logo de Billy
          style={styles.reactLogo}
        />
        </View>
      }
    >
      
      {/* Sección de balance */}
      <BalanceCard balance={balance} refreshData={getBalanceData} />

      {/* Boton para agregar gastos/ingresos*/}
      <AddButton refreshIncomeData={getIncomeData} refreshOutcomeData={getOutcomeData}/>

      {/* Sección de Carpetas con scroll horizontal*/}
      <CategoryList/>

      {/* Sección de Ingresos */}
      <IncomeList incomeData={incomeData} refreshData={getIncomeData} />

      {/* Sección de Egresos */}
      <OutcomeList outcomeData={outcomeData} refreshData={getOutcomeData} />

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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
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
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
  }
});
