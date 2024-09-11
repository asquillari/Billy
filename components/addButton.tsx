import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addIncome, addOutcome } from '../api/api';

interface AddButtonProps {
  refreshIncomeData: () => void;
  refreshOutcomeData: () => void;
}

const AddButton = ({ refreshIncomeData, refreshOutcomeData }: AddButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'Income' | 'Outcome'>('Outcome');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  async function handleSubmit(): Promise<void> {
    if (type === 'Income') {
      await addIncome("f5267f06-d68b-4185-a911-19f44b4dc216", parseInt(amount), description);
      refreshIncomeData();
    } else {
      await addOutcome("f5267f06-d68b-4185-a911-19f44b4dc216", parseInt(amount), "f9ab4221-1b2e-45e8-b167-bb288c97995c", description);
      refreshOutcomeData();
    }

    setAmount('');
    setDescription('');
    setDate(new Date()); 
    setType('Outcome');
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Icon name="add" size={24} color="#000000"/>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false);}}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>

            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeButton, type === 'Income' && styles.typeButtonSelected]} onPress={() => setType('Income')}>
                <Text style={styles.typeButtonText}>Ingreso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, type === 'Outcome' && styles.typeButtonSelected]} onPress={() => setType('Outcome')}>
                <Text style={styles.typeButtonText}>Gasto</Text>
              </TouchableOpacity>
            </View>
    
            <Text style={styles.label}>Monto</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="Ingresar monto"/>

            <Text style={styles.label}>Descripción</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Ingresar descripción"/>

            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{date.toDateString()}</Text>
              <Icon name="calendar-today" size={24} color="#007BFF" style={styles.datePickerIcon}/>
            </TouchableOpacity>
            
            {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange}/>)}
            
            <Button title="Submit" onPress={handleSubmit}/>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF0000"/>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  datePickerIcon: {
    marginLeft: 10,
  },
  button: {
    position: 'absolute', // Position the button absolutely
    top: -93, // Adjust the vertical positioning
    right: 10, // Align it to the right of the balance card
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  }
});

export default AddButton;
