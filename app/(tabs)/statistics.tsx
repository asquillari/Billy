import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import StatsComponent from '@/components/StatsComponent';
import { BillyHeader } from "@/components/BillyHeader";
import { Dimensions } from "react-native";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Stats = React.memo(({ selectedMonth, selectedYear }: { selectedMonth: number; selectedYear: number }) => (
  <ScrollView>
    <View style={styles.card}>
      <Text style={styles.monthText}>{months[selectedMonth]} {selectedYear}</Text>
      <StatsComponent month={selectedMonth} year={selectedYear}/>
    </View>
  </ScrollView>
));

const App = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedButton, setSelectedButton] = useState<'month' | 'year'>('month');

  const toggleSelector = (type: 'month' | 'year') => () => {
    setSelectedButton(type);
  };

  const changeDate = (type: 'month' | 'year', increment: number) => () => {
    if (type === 'month') setSelectedMonth((prev) => (prev + increment + 12) % 12);
    else setSelectedYear((prev) => prev + increment);
  };

  const renderSelector = (type: 'month' | 'year') => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity onPress={changeDate(type, -1)} style={styles.arrowButton}>
        <Text style={styles.arrowText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.selectorText}>
        {type === 'month' ? months[selectedMonth] : selectedYear}
      </Text>
      <TouchableOpacity onPress={changeDate(type, 1)} style={styles.arrowButton}>
        <Text style={styles.arrowText}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );

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
      </View>
      {renderSelector(selectedButton)}
      <Stats selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </LinearGradient>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH,
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
});

export default App;
