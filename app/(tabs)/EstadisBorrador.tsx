import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Box from '@/components/boxBorrador';

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const years = [2022, 2023, 2024];

const Estadsticas = ({selectedMonth, selectedYear}:{selectedMonth:number,selectedYear:number}) => {

  return (
    <View>
    <View style={styles.card}>
      <Text> </Text>
       <Box Month={selectedMonth} Year={selectedYear}/>

    </View>
  </View>
  );
};

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [showMonthSelector, setShowMonthSelector] = useState(true);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedButton, setSelectedButton] = useState('month'); // Track selected button


  const toggleMonthSelector = () => {
    setSelectedButton('month');
    setShowMonthSelector(true);
    setShowYearSelector(false);
  };
  
  const toggleYearSelector = () => {
    setSelectedButton('year');
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
        {/* Barra Superior */}
        <View style={styles.barraSuperior}>
          <Image
            source={require('@/assets/images/Billy/logo1.png')}
            style={styles.logoBilly}
          />
          {/* cambiar la imagen de esta parte. Deberia decir billy */}
          <Image
            source={require('@/assets/images/Billy/logo1.png')}
            style={styles.usuario}
          />
        </View>

        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>Estadísticas</Text>
          <Text style={styles.subtituloTexto}>Mirá tu actividad mensual o anual.</Text>
        </View>

            {/* zona selector mes anio */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            onPress={toggleMonthSelector}
            style={[
              styles.selectorButton,
              { backgroundColor: selectedButton === 'month' ? '#4B00B8' : '#fff' }
            ]}
          >
            <Text style={[
              styles.selectorText,
              { color: selectedButton === 'month' ? '#fff' : '#4A00E0' }
            ]}>Mes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleYearSelector}
            style={[
              styles.selectorButton,
              { backgroundColor: selectedButton === 'year' ? '#4B00B8' : '#fff' }
            ]}
          >
            <Text style={[
              styles.selectorText,
              { color: selectedButton === 'year' ? '#fff' : '#4A00E0' }
            ]}>Año</Text>
          </TouchableOpacity>
        </View>

          {showMonthSelector && (
            <View style={styles.selectorContainer}>
              <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.selectorText2}>{months[selectedMonth]}</Text>
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
              <Text style={styles.selectorText2}>{years[selectedYear]}</Text>
              <TouchableOpacity onPress={nextYear} style={styles.arrowButton}>
                <Text style={styles.arrowText}>{">"}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Estadsticas selectedMonth={selectedMonth} selectedYear={years[selectedYear]} />
  
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 70,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
    width: '85%',
    marginLeft:40,
    position: 'relative', // Added relative positioning
    
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
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    marginTop:0,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  arrowButton: {
    paddingHorizontal: 100,
    paddingVertical: 10,
    
  },
  arrowText: {
    fontSize: 36,
    color: '#fff',
  },
  selectorText: {
    fontSize: 14,
    color: '#4A00E0',
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  selectorText2: {
    fontSize: 24,
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
    left: 43.5,
    //position:'absolute',
    width: '95%', 
    top:0
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
    left:43.5
  },
  subtituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta",
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.12,
    marginTop: 5,
    left:43.5,
    marginBottom: 10
  },
});

export default App;