import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import StatsComponent from '@/components/StatsComponent';
import { BillyHeader } from "@/components/BillyHeader";
import { Dimensions } from "react-native";
import { fetchCurrentProfile, isProfileShared } from "@/api/api";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "@/hooks/useAppContext";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Stats = React.memo(({ selectedMonth, selectedYear, mode }: { selectedMonth: number; selectedYear: number, mode: boolean | null }) => {
  // Use useMemo to create a memoized key that changes when any prop changes
  const memoKey = useMemo(() => `${selectedMonth}-${selectedYear}-${mode}`, [selectedMonth, selectedYear, mode]);

  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.monthText}>{months[selectedMonth]} {selectedYear}</Text>
        <StatsComponent key={memoKey} month={selectedMonth} year={selectedYear} mode={mode}/>
      </View>
    </ScrollView>
  );
});

const App = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedButton, setSelectedButton] = useState<'month' | 'year'>('month');
  const [mode, setMode] = useState<'category' | 'person'>('category');

  {/* Aca tengo que checkear si el usuario tiene un perfil compartido, pero estaria repitiendo codigo
  con statsComponent, ver si lo puedo optimizar. */}
  const { user, currentProfileId, setCurrentProfileId } = useAppContext();
  const [shared, setShared] = useState<boolean | null>(null);

  const fetchProfile = useCallback(async () => {
    if (user?.email) {
      const profileData = await fetchCurrentProfile(user.email);
      if (profileData && typeof profileData === 'string') {
        setCurrentProfileId(profileData);
      }
      if (currentProfileId) {
        isProfileShared(currentProfileId).then(setShared);
      }
    }
  }, [user?.email, setCurrentProfileId, currentProfileId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const toggleSelector = (type: 'month' | 'year') => () => {
    setSelectedButton(type);
  };

  const changeDate = (type: 'month' | 'year', increment: number) => () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (type === 'month') {
      const newMonth = (selectedMonth + increment + 12) % 12;
      const newYear = selectedYear + Math.floor((selectedMonth + increment) / 12);
      
      if (newYear < currentYear || (newYear === currentYear && newMonth <= currentMonth)) {
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
      }
    } else {
      const newYear = selectedYear + increment;
      if (newYear <= currentYear) {
        setSelectedYear(newYear);
        // Adjust month if necessary
        if (newYear === currentYear && selectedMonth > currentMonth) {
          setSelectedMonth(currentMonth);
        }
      }
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'category' ? 'person' : 'category');
  };

  const renderSelector = (type: 'month' | 'year') => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const canGoForward = type === 'month' 
      ? selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)
      : selectedYear < currentYear;

    return (
      <View style={styles.selectorContainer}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={changeDate(type, -1)} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.selectorText}>
          {type === 'month' ? months[selectedMonth] : selectedYear}
        </Text>
        <View style={styles.arrowContainer}>
          {canGoForward && (
            <TouchableOpacity onPress={changeDate(type, 1)} style={styles.arrowButton}>
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
      <BillyHeader title="Estadísticas" subtitle="Mirá tu actividad mensual o anual." />
      <View style={styles.selectorContainer}>
        {['month', 'year'].map((type) => (
          <TouchableOpacity key={type} onPress={toggleSelector(type as 'month' | 'year')} style={[styles.selectorButton, { backgroundColor: selectedButton === type ? '#4B00B8' : '#fff' }]}>
            <Text style={[styles.selectorText, { color: selectedButton === type ? '#fff' : '#4A00E0' }]}>
              {type === 'month' ? 'Mes' : 'Año'}
            </Text>
          </TouchableOpacity>
        ))}

        {shared && (
        <TouchableOpacity onPress={toggleMode} style={styles.circularButton}>
          <Text style={styles.circularButtonText}>
            {mode === 'category' ? 'C' : 'P'}
          </Text>
        </TouchableOpacity>
        )}
      </View>
      {renderSelector(selectedButton)} 
      <Stats selectedMonth={selectedMonth} selectedYear={selectedYear} mode={mode === 'category' ? false : true} />
    </LinearGradient>
  );
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  card: {
    minHeight: SCREEN_HEIGHT * 0.62,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  monthText: {
    fontSize: 28,
    color: '#3e0196',
    textAlign: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowText: {
    fontSize: 24,
    color: '#fff',
  },
  selectorText: {
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 10,
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#4B00B8',
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradientContainer: {
    flex: 1,
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#87CEFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  circularButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  arrowContainer: {
    width: 50,
    alignItems: 'center',
  },
});

export default App;
