import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import CobroPagoPopUp from '../../components/CobroPagoPopUp';
import { CategoryList } from '../../components/CategoryList';
import { fetchCategories, CategoryData, fetchIncomes, fetchOutcomes, getOutcomesFromDateRange } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../ProfileContext';

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
  const [viewMode, setViewMode] = useState('month');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<'cobro' | 'pago'>('cobro');
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const { currentProfileId } = useProfile();

  const currentYear = moment().year();
  const years = Array.from({length: 24}, (_, i) => currentYear - 20 + i);

  const onMonthChange = (month: { dateString: string }) => {
    setCurrentDate(month.dateString);
  };

  const onYearPress = () => {
    setViewMode('year');
  };

  const selectYear = (year: number) => {
    const newDate = moment(currentDate).year(year).format('YYYY-MM-DD');
    setCurrentDate(newDate);
    setViewMode('month');
    setKey(prevKey => prevKey + 1);
  };

  const renderCustomHeader = (date: any) => {
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

  const openPopup = (type: 'cobro' | 'pago') => {
    setPopupType(type);
    setPopupVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchCategoryData(),
      fetchIncomeData(),
      fetchOutcomeData()
    ]);
  };

  const fetchCategoryData = async () => {
    const data = await fetchCategories(currentProfileId || "");
    setCategoryData(data);
  };

  const fetchIncomeData = async () => {
    const data = await fetchIncomes(currentProfileId || "");
    setIncomes(data || []);
  };

  const fetchOutcomeData = async () => {
    const data = await fetchOutcomes(currentProfileId || "");
    setOutcomes(data || []);
  };

  const processTransactions = useCallback(async () => {
    const startOfMonth = moment(currentDate).startOf('month').toDate();
    const endOfMonth = moment(currentDate).endOf('month').toDate();

    const incomes = await fetchIncomes(currentProfileId || "") || [];
    const outcomes = await getOutcomesFromDateRange(currentProfileId || "", startOfMonth, endOfMonth) || [];
    
    const marked: { [key: string]: { dots: { key: string; color: string }[] } } = {};

    incomes.forEach(income => {
      const date = moment(income.created_at).format('YYYY-MM-DD');
      if (marked[date]) {
        marked[date].dots.push({ key: `income-${income.id}`, color: '#4CAF50' });
      } else {
        marked[date] = { dots: [{ key: `income-${income.id}`, color: '#4CAF50' }] };
      }
    });

    outcomes.forEach(outcome => {
      const date = moment(outcome.created_at).format('YYYY-MM-DD');
      if (marked[date]) {
        marked[date].dots.push({ key: `outcome-${outcome.id}`, color: '#F44336' });
      } else {
        marked[date] = { dots: [{ key: `outcome-${outcome.id}`, color: '#F44336' }] };
      }
    }, [currentProfileId]);

    setMarkedDates(marked);
  }, [currentDate]);

  useEffect(() => {
    processTransactions();
  }, [processTransactions]);

  useFocusEffect(
    React.useCallback(() => {
      processTransactions();
    }, [processTransactions])
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4B00B8', '#20014E']}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.calendarContainer}>
              {viewMode === 'month' ? (
                <Calendar
                  key={key}
                  current={currentDate}
                  markedDates={markedDates}
                  markingType={'multi-dot'}
                  style={styles.calendar}
                  renderArrow={(direction: 'left' | 'right') => direction === 'left' ? customArrowLeft() : customArrowRight()}
                  onMonthChange={(month: { dateString: string }) => {
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
              <TouchableOpacity style={styles.buttonCobro} onPress={() => openPopup('cobro')}>
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.buttonTextCobro}>Fecha de cobro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPago} onPress={() => openPopup('pago')}>
                <Ionicons name="add-circle" size={24} color="#370185" />
                <Text style={styles.buttonTextPago}>Fecha de pago</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryListContainer}>
              <CategoryList 
                categoryData={categoryData} 
                refreshCategoryData={fetchCategoryData}
                refreshAllData={fetchData}
                currentProfileId={currentProfileId || ""}
                showAddButton={false}
              />
            </View>
        
          </View>
        </SafeAreaView>

        <CobroPagoPopUp
          isVisible={popupVisible}
          onClose={() => setPopupVisible(false)}
          initialType={popupType}
          refreshIncomeData={fetchIncomeData}
          refreshOutcomeData={fetchOutcomeData}
          refreshCategoryData={fetchCategoryData}
          currentProfileId={currentProfileId || ""}
        />

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
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
  calendarContainer: {
    height: 320,
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
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#735BF2',
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1.6,
  },
  subtituloTexto: {
    color: '#ffffff',
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
    marginBottom: 20,
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
    fontSize: 14,
    marginLeft: 10,
  },
  buttonTextPago: {
    color: '#370185',
    fontSize: 14,
    marginLeft: 10,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#ffffff',
    borderRadius: 17,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#B29BD3',
    borderRadius: 12,
    position: 'relative',
    width: '80%',
    height: 40,
  },
  toggleButton: {
    padding: 10,
    width: '50%',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    width: '48%',
    height: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    top: '5%',
  },
  toggleText: {
    fontSize: 12,
    color: '#370185',
  },
  activeToggleText: {
    color: '#370185',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#370185',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  categoryListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default App;