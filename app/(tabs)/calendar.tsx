import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, FlatList, Image, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado expo/vector-icons

// Configuración personalizada de las flechas
const customArrowLeft = () => {
  return (
    <View style={styles.arrowContainer}>
      <View style={[styles.arrow, styles.arrowLeft]} />
    </View>
  );
};

const customArrowRight = () => {
  return (
    <View style={styles.arrowContainer}>
      <View style={[styles.arrow, styles.arrowRight]} />
    </View>
  );
};

const App = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState('month'); // Nuevo estado para controlar la vista

  const currentYear = moment().year();
  const years = Array.from({length: 24}, (_, i) => currentYear - 20 + i);

  const onMonthChange = (month: { dateString: string }) => {
    console.log('Mes cambiado a:', month.dateString);
    setCurrentDate(month.dateString);
  };

  const onYearPress = () => {
    setViewMode('year');
  };

  const selectYear = (year: number) => {
    const newDate = moment(currentDate).year(year).format('YYYY-MM-DD');
    setCurrentDate(newDate);
    setViewMode('month');
    setKey(prevKey => prevKey + 1); // Forzar re-render del calendario
  };

  useEffect(() => {
    console.log('Fecha actual actualizada:', currentDate);
  }, [currentDate]);

  const renderCustomHeader = (date) => {
    const month = date.toString('MMMM');
    const year = date.toString('yyyy');
    return (
      <TouchableOpacity onPress={onYearPress} style={styles.customHeaderContainer}>
        <Text style={styles.customHeaderText}>{`${month} ${year}`}</Text>
      </TouchableOpacity>
    );
  };

  const renderYearPicker = () => {
    return (
      <FlatList
        data={years}
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => selectYear(item)} style={styles.yearItem}>
            <Text style={styles.yearText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.toString()}
        contentContainerStyle={styles.yearPickerContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4B00B8', '#20014E']}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradientContainer}
      >
        <View style={styles.barraSuperior}>
          <Image
            source={require('../../assets/images/Billy/logo2.png')}
            style={styles.logoBilly}
          />
          <Image
            source={require('../../assets/images/icons/UserIcon.png')}
            style={styles.usuario}
          />
        </View>
        
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>Calendario</Text>
          <Text style={styles.subtituloTexto}>Organizá tus fechas de pago y cobro.</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.rectangleFondo}>
            <View style={styles.calendarContainer}>
              {viewMode === 'month' ? (
                <Calendar
                  key={key}
                  current={currentDate}
                  markedDates={markedDates}
                  markingType={'period'}
                  style={styles.calendar}
                  renderArrow={(direction: 'left' | 'right') => direction === 'left' ? customArrowLeft() : customArrowRight()}
                  onMonthChange={(month) => {
                    console.log('Mes cambiado a:', month.dateString);
                    setCurrentDate(month.dateString);
                  }}
                  renderHeader={renderCustomHeader}
                  theme={{
                    'stylesheet.calendar.header': {
                      monthText: {
                        ...styles.monthText,
                        color: '#735BF2',
                      },
                    },
                  }}
                  onPressArrowLeft={(subtractMonth: () => void) => subtractMonth()}
                  onPressArrowRight={(addMonth: () => void) => addMonth()}
                />
              ) : (
                <View style={styles.yearPickerWrapper}>
                  {renderYearPicker()}
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonCobro}>
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.buttonTextCobro}>Fecha de cobro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPago}>
                <Ionicons name="add-circle" size={24} color="#370185" />
                <Text style={styles.buttonTextPago}>Fecha de pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10, // Añadimos un padding superior de 10 píxeles
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
    marginHorizontal: 10, // Añadimos margen horizontal
    marginBottom: 10, // Añadimos margen inferior
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
  gradientContainer: {
    flex: 1,
    paddingTop: 10, // Añadimos un padding superior de 10 píxeles
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rectangleFondo: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    height: '97%', // Ajusta este valor según necesites
    width: '95%',
    alignSelf: 'center',
  },
  calendarContainer: {
    height: 320, // Ajusta este valor si es necesario
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: '100%',
  },
  calendar: {
    height: '100%',
  },
  yearPickerWrapper: {
    height: '100%',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 10,
    borderRightWidth: 10,
  },
  arrowLeft: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#735BF2',
    borderLeftColor: 'transparent',
  },
  arrowRight: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#735BF2',
    borderRightColor: 'transparent',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  customHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#735BF2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#735BF2',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  yearItem: {
    flex: 1,
    aspectRatio: 1.5, // Esto hará que los rectángulos sean más anchos que altos
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#735BF2', // Cambiamos el color de fondo a #735BF2
  },
  yearText: {
    fontSize: 20, // Reducimos un poco el tamaño de la fuente
    fontWeight: 'bold',
    color: '#FFFFFF', // Cambiamos el color del texto a blanco
  },
  yearPickerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 5,
  },
  tituloContainer: {
    height: 55,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta", // Asegúrate de que este nombre coincida con el de la fuente instalada
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1.6,
  },
  subtituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta", // También cambiamos la fuente del subtítulo
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20, // Añade un margen inferior si es necesario
  },
  buttonCobro: {
    backgroundColor: '#370185',
    borderRadius: 12.66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 15,
    width: '48%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPago: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12.66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: '48%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextCobro: {
    color: '#FFFFFF',
    fontFamily: "Amethysta",
    fontSize: 14,
    marginLeft: 10,
  },
  buttonTextPago: {
    color: '#370185',
    fontFamily: "Amethysta",
    fontSize: 14,
    marginLeft: 10,
  },
});

export default App;