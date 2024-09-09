
//Hay mucho codigo comentado pq todavia no funciona del todo bien.

import { getProfileID, addUser, fetchIncomes, getIncome, addIncome, removeIncome, fetchExpenses, getExpense, addExpense, removeExpense, getBalance, IncomeData, ExpenseData, signUp } from '../../api/api';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from 'react-native';
// import DatePicker from 'react-native-datepicker'; no funciona idk
//import RNPickerSelect from 'react-native-picker-select';

// const categories = [
//   { label: 'Food', value: 'food' },
//   { label: 'Transport', value: 'transport' },
//   { label: 'Utilities', value: 'utilities' },
//  
// ];

const TransactionForm = () => {
  // const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
 // const [date, setDate] = useState(new Date());
 // const [category, setCategory] = useState('');
  const [data,data1] = useState('');

 async function handleSubmit (): Promise<void>  {
     
  await addIncome("f5267f06-d68b-4185-a911-19f44b4dc216", parseInt(amount), description);
  const data1 = await fetchIncomes("f5267f06-d68b-4185-a911-19f44b4dc216");
  };

   function getData(){
    return data1;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*<Text style={styles.label} selectionColor={'#FFFFFF'}>Type</Text>
       <RNPickerSelect
        onValueChange={(value) => setType(value)}
        items={[
          { label: 'Income', value: 'income' },
          { label: 'Outcome', value: 'outcome' },
        ]}
        value={type}
      /> */}
      <Text style={styles.label}> </Text>
      <Text style={styles.label}> </Text>
      <Text style={styles.label}> </Text>
      <Text style={styles.label}> </Text>


      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount of income"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      {/* <Text style={styles.label}>Date</Text>
      <DatePicker
        style={styles.datePicker}
        date={date}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        minDate="2000-01-01"
        maxDate="2100-12-31"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => setDate(date)}
      /> */}

      {/* <Text style={styles.label}>Category</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categories}
        value={category}
      /> */}

      <Button title="Confirm" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color:'#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    color: '#FFFFFF',
  },
  // datePicker: {
  //   width: '100%',
  //   marginVertical: 16,
  // },
});

export default TransactionForm;
  
