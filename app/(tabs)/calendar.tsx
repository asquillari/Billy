import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import CalendarAddModal from '../../components/modals/CalendarAddModal';
import { CategoryList } from '../../components/CategoryList';
import { getOutcomesFromDateRange } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../ProfileContext';
import useProfileData from '@/hooks/useProfileData';
import BillyHeader from "@/components/BillyHeader";

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

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'outcome'>('outcome');
  const { currentProfileId } = useProfile();
  const { incomeData, outcomeData, categoryData, getIncomeData, getOutcomeData, getCategoryData, refreshAllData } = useProfileData(currentProfileId || "");

  const currentYear = moment().year();
  const years = useMemo(() => Array.from({ length: 24 }, (_, i) => currentYear - 20 + i), [currentYear]);

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

  const openModal = (type: 'income' | 'outcome') => {
    setModalType(type);
    setModalVisible(true);
  };

  const processTransactions = useCallback(async () => {
    const startOfMonth = moment(currentDate).startOf('month').toDate();
    const endOfMonth = moment(currentDate).endOf('month').toDate();

    const outcomes = await getOutcomesFromDateRange(currentProfileId || "", startOfMonth, endOfMonth) || [];
    
    const marked: { [key: string]: { dots: { key: string; color: string }[] } } = {};

    incomeData?.forEach(income => {
      const date = moment(income.created_at).format('YYYY-MM-DD');
      if (marked[date]) marked[date].dots.push({ key: `income-${income.id}`, color: '#4CAF50' });
      else marked[date] = { dots: [{ key: `income-${income.id}`, color: '#4CAF50' }] };
    });

    outcomes?.forEach(outcome => {
      const date = moment(outcome.created_at).format('YYYY-MM-DD');
      if (marked[date]) marked[date].dots.push({ key: `outcome-${outcome.id}`, color: '#F44336' });
      else marked[date] = { dots: [{ key: `outcome-${outcome.id}`, color: '#F44336' }] };
    }, [currentProfileId]);

    setMarkedDates(marked);
  }, [currentDate]);

  useEffect(() => {
    getIncomeData();
    getOutcomeData();
    getCategoryData();
    processTransactions();
  }, [processTransactions]);

  useFocusEffect(
    useCallback(() => { 
      getCategoryData();
      processTransactions(); 
  }, [processTransactions]));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} start={{x: 1, y: 0}} end={{x: 0, y: 1}} style={styles.gradientContainer}>
        <SafeAreaView style={styles.safeArea}>
        <BillyHeader title="Calendario" subtitle="Organizá tus fechas de pago y cobro."/>
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
                  onMonthChange={(month: { dateString: string }) => { setCurrentDate(month.dateString); }}
                  renderHeader={renderCustomHeader}
                  theme={{ 'stylesheet.calendar.header': { monthText: { ...styles.monthText, color: '#735BF2' } } }}
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
              <TouchableOpacity style={styles.buttonCobro} onPress={() => openModal('income')}>
                <Ionicons name="add-circle" size={24} color="white"/>
                <Text style={styles.buttonTextCobro}>Ingreso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPago} onPress={() => openModal('outcome')}>
                <Ionicons name="add-circle" size={24} color="#370185"/>
                <Text style={styles.buttonTextPago}>Gasto</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryListContainer}>
              <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData} currentProfileId={currentProfileId || ""} showAddButton={false}/>
            </View>
        
          </View>
        </SafeAreaView>

        <CalendarAddModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          initialType={modalType}
          refreshIncomeData={getIncomeData}
          refreshOutcomeData={getOutcomeData}
          refreshCategoryData={getCategoryData}
          refreshTransactions={processTransactions}
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
  },
  safeArea: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
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