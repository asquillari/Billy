import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, FlatList, Image, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

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
  const calendarRef = useRef(null);

  const years = Array.from({length: 21}, (_, i) => moment().year() - 10 + i);

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
    if (calendarRef.current) {
      calendarRef.current.setMonth(newDate);
    }
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

  const renderYearPicker = () => (
    <FlatList
      data={years}
      numColumns={3} // Muestra 3 años por fila
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => selectYear(item)} style={styles.yearItem}>
          <Text style={styles.yearText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.toString()}
      contentContainerStyle={styles.yearPickerContainer}
    />
  );

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
        <View style={styles.contentContainer}>
          <View style={styles.rectangleFondo}>
            <View style={styles.calendarContainer}>
              {viewMode === 'month' ? (
                <Calendar
                  key={key}
                  ref={calendarRef}
                  current={currentDate}
                  markedDates={markedDates}
                  markingType={'period'}
                  style={styles.calendar}
                  renderArrow={(direction: 'left' | 'right') => direction === 'left' ? customArrowLeft() : customArrowRight()}
                  onMonthChange={onMonthChange}
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
                renderYearPicker()
              )}
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
    height: '85%', // Ajusta este valor según necesites
    width: '100%',
  },
  calendarContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: '100%',
  },
  calendarWrapper: {
    height: Dimensions.get('window').height * 0.42, // Ajusta este valor según necesites
    marginTop: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  yearText: {
    fontSize: 18,
    color: '#735BF2',
  },
  yearPickerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

export default App;