import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Box from '@/components/box';

const data = [
  {
    month: "Enero",
    amount: 900,
    categories: [
      { name: "Nafta", amount: -350 },
      { name: "Comida", amount: -150 },
      { name: "Expensas", amount: -1000 },
    ],
  },
  {
    month: "Febrero",
    amount: 1200,
    categories: [
      { name: "Transporte", amount: -200 },
      { name: "Comida", amount: -400 },
      { name: "Entretenimiento", amount: -300 },
    ],
  },
  {
    month: "Marzo",
    amount: 1500,
    categories: [
      { name: "Renta", amount: -800 },
      { name: "Comida", amount: -600 },
      { name: "Servicios", amount: -200 },
    ],
  },
  {
    month: "Abril",
    amount: 1100,
    categories: [
      { name: "Comida", amount: -500 },
      { name: "Nafta", amount: -300 },
      { name: "Salud", amount: -200 },
    ],
  },
  {
    month: "Mayo",
    amount: 1300,
    categories: [
      { name: "Renta", amount: -800 },
      { name: "Comida", amount: -400 },
      { name: "Transporte", amount: -100 },
    ],
  },
  {
  month: "Junio",
    amount: 850,
    categories: [
      { name: "Nafta", amount: -200 },
      { name: "Comida", amount: -150 },
      { name: "Expensas", amount: -500 },
    ],
  },
  {
    month: "Julio",
    amount: 1000,
    categories: [
      { name: "Nafta", amount: -300 },
      { name: "Comida", amount: -200 },
      { name: "Expensas", amount: -600 },
    ],
  },
  {
    month: "Agosto",
    amount: 1150,
    categories: [
      { name: "Nafta", amount: -350 },
      { name: "Comida", amount: -250 },
      { name: "Expensas", amount: -700 },
    ],
  },
  {
    month: "Septiembre",
    amount: 1250,
    categories: [
      { name: "Nafta", amount: -400 },
      { name: "Comida", amount: -200 },
      { name: "Expensas", amount: -800 },
    ],
  },
  {
    month: "Octubre",
    amount: 1350,
    categories: [
      { name: "Nafta", amount: -450 },
      { name: "Comida", amount: -250 },
      { name: "Expensas", amount: -900 },
    ],
  },
  {
    month: "Noviembre",
    amount: 900,
    categories: [
      { name: "Nafta", amount: -350 },
      { name: "Comida", amount: -150 },
      { name: "Expensas", amount: -600 },
    ],
  },
  {
    month: "Diciembre",
    amount: 2000,
    categories: [
      { name: "Nafta", amount: -500 },
      { name: "Comida", amount: -600 },
      { name: "Expensas", amount: -1000 },
    ],
  },
];

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const years = [2022, 2023, 2024, 2025];

const Estadsticas = ({ selectedMonth, selectedYear }) => {
  const currentData = data[selectedMonth]; // Update to match selected month

  // Prepare pie chart data
  const chartData = currentData.categories.map((category) => ({
    name: category.name,
    amount: Math.abs(category.amount), // Use absolute value for positive representation
    color: "#7F7F7F",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));


  return (
    <View>
    <View style={styles.card}>
      <Text style={styles.monthText}>{currentData.month} {selectedYear}</Text>
      <Text> </Text>

       {/* <PieChart2 data={data} /> */}
       <Box/>

    </View>
  </View>
  );
};

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const data = [
    { amount: 200, color: "rgba(249, 91, 81, 1)" }, // 20%
    { amount: 400, color: "rgba(102, 204, 255, 1)" }, // 40%
    { amount: 300, color: "rgba(255, 215, 0, 1)" }, // 30%
    { amount: 100, color: "rgba(0, 255, 0, 1)" }, // 10%
  ];


  const toggleMonthSelector = () => {
    setShowMonthSelector(true);
    setShowYearSelector(false);
  };

  const toggleYearSelector = () => {
    setShowYearSelector(true);
    setShowMonthSelector(false);
  };

  const nextMonth = () => {
    setSelectedMonth((prev) => (prev + 1) % months.length);
  };

  const prevMonth = () => {
    setSelectedMonth((prev) => (prev - 1 + months.length) % months.length);
  };

  const nextYear = () => {
    setSelectedYear((prev) => (prev + 1) % years.length);
  };

  const prevYear = () => {
    setSelectedYear((prev) => (prev - 1 + years.length) % years.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4B00B8', '#20014E']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.barraSuperior}>
          <Image
            source={require('@/assets/images/Billy/logo2.png')}
            style={styles.logoBilly}
          />
          <Image
            source={require('@/assets/images/icons/UserIcon.png')}
            style={styles.usuario}
          />
        </View>

        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>Estadísticas</Text>
          <Text style={styles.subtituloTexto}>Mirá tu actividad mensual o anual.</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.selectorContainer}>
            <TouchableOpacity onPress={toggleMonthSelector} style={styles.selectorButton}>
              <Text style={styles.selectorText}>Mes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleYearSelector} style={styles.selectorButton}>
              <Text style={styles.selectorText}>Año</Text>
            </TouchableOpacity>
          </View>

          {showMonthSelector && (
            <View style={styles.selectorContainer}>
              <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.selectorText}>{months[selectedMonth]}</Text>
              <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{">"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {showYearSelector && (
            <View style={styles.selectorContainer}>
              <TouchableOpacity onPress={prevYear} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.selectorText}>{years[selectedYear]}</Text>
              <TouchableOpacity onPress={nextYear} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{">"}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Estadsticas selectedMonth={selectedMonth} selectedYear={years[selectedYear]} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: 393,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    flex:1
  },
  monthText: {
    fontSize: 28,
    color: '#3e0196',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 48,
    color: '#3c3c3c',
    textAlign: 'center',
    marginVertical: 20,
  },
  categoryList: {
    marginVertical: 10,
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryName: {
    fontSize: 18,
    color: '#3c3c3c',
  },
  categoryAmount: {
    fontSize: 18,
    color: '#3c3c3c',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
    width: '100%',
    marginTop:0,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  arrowButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowText: {
    fontSize: 24,
    color: '#4A00E0',
  },
  selectorText: {
    fontSize: 18,
    color: '#4A00E0',
    marginHorizontal: 10,
  },
  selectorButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  gradientContainer: {
    flex: 1,
    paddingTop: 10,
  },
  barraSuperior: {
    height: 61,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logoBilly: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  usuario: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    alignSelf: 'center',
  },
  tituloContainer: {
    height: 55,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta",
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1.6,
  },
  subtituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta",
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.12,
    marginTop: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default App;
