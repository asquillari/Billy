import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { CategoryList } from '../../components/CategoryList';
import CalendarAddModal from '../../components/modals/CalendarAddModal';
import { getOutcomesFromDateRange, fetchCurrentProfile } from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../contexts/ProfileContext';
import useProfileData from '@/hooks/useProfileData';
import BillyHeader from "@/components/BillyHeader";
import { useUser } from '@/app/contexts/UserContext';

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
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();

  const [markedDates, setMarkedDates] = useState({});
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'outcome'>('outcome');

  const { incomeData, categoryData, getIncomeData, getOutcomeData, getCategoryData, refreshAllData } = useProfileData(currentProfileId || "");

  const currentYear = moment().year();
  const years = useMemo(() => Array.from({ length: 24 }, (_, i) => currentYear - 20 + i), [currentYear]);

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      if (profileData && typeof profileData === 'string') {
        setCurrentProfileId(profileData);
      }
    }
  }, [userEmail, setCurrentProfileId]);

  const onYearPress = () => {
    setViewMode('year');
  };

  const selectYear = useCallback((year: number) => {
    const newDate = moment(currentDate).year(year).format('YYYY-MM-DD');
    setCurrentDate(newDate);
    setViewMode('month');
    setKey(prevKey => prevKey + 1);
  }, [currentDate]);

  const renderCustomHeader = useCallback((date: any) => {
    const month = date.toString('MMMM');
    const year = date.toString('yyyy');
    return (
      <TouchableOpacity onPress={onYearPress} style={styles.customHeaderContainer}>
        <Text style={styles.customHeaderText}>{`${month} ${year}`}</Text>
      </TouchableOpacity>
    );
  }, [onYearPress]);

  const renderYearPicker = useCallback(() => (
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
  ), [years, selectYear]);

  const openModal = useCallback((type: 'income' | 'outcome') => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const processTransactions = useCallback(async () => {
    if (!currentProfileId) return;
    
    const startOfMonth = moment(currentDate).startOf('month').toDate();
    const endOfMonth = moment(currentDate).endOf('month').toDate();
    
    const outcomes = await getOutcomesFromDateRange(currentProfileId, startOfMonth, endOfMonth);

    const marked: { [key: string]: { dots: { key: string; color: string }[] } } = {};

    const addDot = (date: string, id: string, color: string) => {
      if (marked[date]) marked[date].dots.push({ key: `${color === '#4CAF50' ? 'income' : 'outcome'}-${id}`, color }); 
      else marked[date] = { dots: [{ key: `${color === '#4CAF50' ? 'income' : 'outcome'}-${id}`, color }] };
    };

    incomeData?.forEach(income => {
      const date = moment(income.created_at).format('YYYY-MM-DD');
      addDot(date, income.id?.toString() || '', '#4CAF50');
    });

    if (Array.isArray(outcomes)) {
      outcomes?.forEach((outcome: any) => {
        const date = moment(outcome.created_at).format('YYYY-MM-DD');
        addDot(date, outcome.id?.toString() || '', '#F44336');
      });
    }

    setMarkedDates(marked);
  }, [currentDate, currentProfileId, incomeData, getOutcomesFromDateRange]);

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        await fetchProfile();
        if (currentProfileId) {
          await getCategoryData();
          processTransactions();
        }
      };
      refreshData();
    }, [fetchProfile, currentProfileId, getCategoryData, processTransactions])
  );
  
  const memoizedCalendar = useMemo(() => (
    <Calendar
      key={key}
      current={currentDate}
      markedDates={markedDates}
      markingType={'multi-dot'}
      renderArrow={(direction: 'left' | 'right') => direction === 'left' ? customArrowLeft() : customArrowRight()}
      onMonthChange={(month: { dateString: string }) => { setCurrentDate(month.dateString); }}
      renderHeader={renderCustomHeader}
      theme={{ 'stylesheet.calendar.header': { monthText: { ...styles.monthText, color: '#735BF2' } } }}
    />
  ), [key, currentDate, markedDates, renderCustomHeader]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4B00B8', '#20014E']} start={{x: 1, y: 0}} end={{x: 0, y: 1}} style={styles.gradientContainer}>
          <BillyHeader title="Calendario" subtitle="Organizá tus fechas de pago y cobro."/>
          <View style={styles.contentContainer}>
            <View style={styles.calendarContainer}>
              {viewMode === 'month' ? memoizedCalendar : renderYearPicker()}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonCobro} onPress={() => openModal('income')}>
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.buttonTextCobro}>Agregar cobro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPago} onPress={() => openModal('outcome')}>
                <Ionicons name="remove-circle-outline" size={24} color="#370185" />
                <Text style={styles.buttonTextPago}>Agregar pago</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryListContainer}>
              <CategoryList categoryData={categoryData} refreshCategoryData={getCategoryData} refreshAllData={refreshAllData} currentProfileId={currentProfileId || ""} showAddButton={false}/>
            </View>
          </View>
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    marginHorizontal: '2.5%',
  },
  calendarContainer: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: '100%',
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
  categoryListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
});