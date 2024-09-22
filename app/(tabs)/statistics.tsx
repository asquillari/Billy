import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function Statistics() {
  const [type, setType] = useState<'Month' | 'Year'>('Month');
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Mock data for pie chart
  const data: { [key: string]: { name: string; amount: number }[] } = {
    'January': [
      { name: 'Food', amount: 300 },
      { name: 'Transport', amount: 150 },
      { name: 'Entertainment', amount: 100 },
    ],
    'February': [
      { name: 'Food', amount: 250 },
      { name: 'Transport', amount: 200 },
      { name: 'Entertainment', amount: 120 },
    ],
    '2023': [
      { name: 'Food', amount: 3000 },
      { name: 'Transport', amount: 1800 },
      { name: 'Entertainment', amount: 1200 },
    ],
    '2022': [
      { name: 'Food', amount: 3200 },
      { name: 'Transport', amount: 2000 },
      { name: 'Entertainment', amount: 1400 },
    ],
  };

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString()); // Recent 10 years

  // Determine current data based on type
  const currentData = type === 'Month' ? data[selectedMonth] : data[selectedYear];

  // Ensure currentData is defined and fallback to empty array if not
  const totalAmount = (currentData || []).reduce((sum, item) => sum + item.amount, 0);

  const pieChartData = (currentData || []).map(item => ({
    name: item.name,
    amount: item.amount,
    color: getRandomColor(),
    legendFontColor: '#ffffff',
    legendFontSize: 15
  }));

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {pieChartData.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendBullet, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.name}: ${item.amount}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.displayText}>Estadísticas</Text>
        <Text style={styles.displaySubText}>Mirá tu actividad mensual o anual</Text>
      </View>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'Month' && styles.typeButtonSelected,
          ]}
          onPress={() => setType('Month')}
        >
          <Text style={[styles.typeButtonText, type === 'Month' && styles.typeButtonTextSelected]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'Year' && styles.typeButtonSelected,
          ]}
          onPress={() => setType('Year')}
        >
          <Text style={[styles.typeButtonText, type === 'Year' && styles.typeButtonTextSelected]}>
            Year
          </Text>
        </TouchableOpacity>
      </View>

      {type === 'Month' && (
        <RNPickerSelect
          placeholder={{ label: "Select a month", value: null }}
          value={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value)}
          items={[
            { label: 'January', value: 'January' },
            { label: 'February', value: 'February' },
            { label: 'March', value: 'March' },
            { label: 'April', value: 'April' },
            { label: 'May', value: 'May' },
            { label: 'June', value: 'June' },
            { label: 'July', value: 'July' },
            { label: 'August', value: 'August' },
            { label: 'September', value: 'September' },
            { label: 'October', value: 'October' },
            { label: 'November', value: 'November' },
            { label: 'December', value: 'December' },
          ]}
          style={pickerSelectStyles}
        />
      )}

      {type === 'Year' && (
        <RNPickerSelect
          placeholder={{ label: "Select a year", value: null }}
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
          items={years.map(year => ({ label: year, value: year }))}
          style={pickerSelectStyles}
        />
      )}

      <View style={styles.chartContainer}>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#000',
              backgroundGradientFrom: '#000',
              backgroundGradientTo: '#000',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <View style={styles.totalAmountContainer}>
            <View style={styles.whiteCircle}>
              <Text style={styles.totalAmountText}>${totalAmount}</Text>
            </View>
          </View>
        </View>
      </View>

      {renderLegend()}
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '100%',
    backgroundColor: '#333', // Dark background for Picker
    color: '#FFFFFF', // White text color for Picker
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    width: '100%',
    backgroundColor: '#333', // Dark background for Picker
    color: '#FFFFFF', // White text color for Picker
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  placeholder: {
    color: '#FFFFFF', // White placeholder text
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Black background for the container
    paddingTop: 70, // Add space to move everything down
  },
  header: {
    marginBottom: 20,
  },
  displayText: {
    color: '#FFFFFF', // White text color
    fontSize: 36,
    fontWeight: 'bold',
  },
  displaySubText: {
    color: '#FFFFFF', // White text color
    fontSize: 18,
    marginBottom: 20, // Space below the sub-text
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center', // Center buttons horizontally
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    marginHorizontal: 5, // Space between buttons
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff', // White background for buttons
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#007BFF', // Blue background for selected button
    borderColor: '#007BFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#000', // Black text color for default button
  },
  typeButtonTextSelected: {
    color: '#FFFFFF', // White text color for selected button
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pieChartContainer: {
    position: 'relative',
    width: screenWidth - 40,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmountContainer: {
    position: 'absolute',
  },
  totalAmountText: {
    color: '#000000', // Black text color for total amount
    fontSize: 24,
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    color: '#FFFFFF', // White text color for legend
    fontSize: 16,
  },
});
