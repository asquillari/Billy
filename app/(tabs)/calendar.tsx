import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, Text } from "react-native";
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
  const calendarRef = useRef(null);

  const years = Array.from({length: 21}, (_, i) => moment().year() - 10 + i);

  const onMonthChange = (month: { dateString: string }) => {
    console.log('Mes cambiado a:', month.dateString);
    setCurrentDate(month.dateString);
  };

  const onYearPress = () => {
    console.log('Abriendo selector de año');
    setShowYearPicker(true);
  };

  const selectYear = (year: number) => {
    console.log('Año seleccionado:', year);
    const newDate = moment(currentDate).year(year).format('YYYY-MM-DD');
    console.log('Nueva fecha:', newDate);
    setCurrentDate(newDate);
    setShowYearPicker(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
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
      </View>
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={years}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => selectYear(item)} style={styles.yearItem}>
                <Text style={styles.yearText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.toString()}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  calendarContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: '100%',
  },
  calendar: {
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  yearText: {
    fontSize: 18,
    color: '#735BF2',
  },
});

export default App;