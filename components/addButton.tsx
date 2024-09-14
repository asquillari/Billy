import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
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
  const [bubbleAnimation] = useState(new Animated.Value(0));

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  async function handleSubmit(): Promise<void> {
    if (type === 'Income') {
      await addIncome("f5267f06-d68b-4185-a911-19f44b4dc216", parseFloat(amount), description);
      refreshIncomeData();
    } else {
      await addOutcome("f5267f06-d68b-4185-a911-19f44b4dc216", "9a042378-9f40-4bff-83d8-d8e78eea2343", parseFloat(amount), description);
      refreshOutcomeData();
    }

    setAmount('');
    setDescription('');
    setDate(new Date());
    setType('Outcome');
    setModalVisible(false);
  }

  const switchType = (newType: 'Income' | 'Outcome') => {
    setType(newType);
    Animated.timing(bubbleAnimation, {
      toValue: newType === 'Income' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const bubbleInterpolation = bubbleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '48%'],
  });

  const getTextColor = (buttonType: 'Income' | 'Outcome') => {
    return type === buttonType ? '#000000' : '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Icon name="add" size={24} color="#B29CCA"/>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false);}}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={30} color="#000000"/>
            </TouchableOpacity>
            
            <View style={styles.contentContainer}>
              <View style={styles.typeSelector}>
                <View style={[styles.bubbleBackground, { backgroundColor: '#B39CD4' }]}>
                  <Animated.View style={[styles.bubble, { left: bubbleInterpolation }]}/>
                </View>
                
                <TouchableOpacity style={styles.typeButton} onPress={() => switchType('Outcome')}>
                  <Text style={[styles.typeButtonText, { color: getTextColor('Outcome') }]}>Gasto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.typeButton} onPress={() => switchType('Income')}>
                  <Text style={[styles.typeButtonText, { color: getTextColor('Income') }]}>Ingreso</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción"
                placeholderTextColor="#AAAAAA"
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Monto"
                placeholderTextColor="#AAAAAA"
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={[styles.datePickerText, !date && styles.placeholderText]}>
                  {date ? date.toDateString() : 'Fecha'}
                </Text>
                <Icon name="calendar-today" size={24} color="#007BFF" style={styles.datePickerIcon}/>
              </TouchableOpacity>
              
              {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange}/>)}

              {type === 'Outcome' && (
                <TouchableOpacity style={styles.scanButton}>
                  <Text style={styles.scanButtonText}>Escanear ticket</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.acceptButton} onPress={handleSubmit}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    paddingTop: 40, // Aumentamos el padding superior para dar espacio a la cruz
  },
  contentContainer: {
    width: '100%',
    padding: 20,
  },
  typeSelector: {
    marginTop: 10, // Añadimos un margen superior para separar de la cruz
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    height: 44,
  },
  typeButton: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bubbleBackground: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    left: -6,
    right: -6,
    backgroundColor: '#B39CD4',
    borderRadius: 24,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '50%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
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
  placeholderText: {
    color: '#AAAAAA',
  },
  datePickerIcon: {
    marginLeft: 10,
  },
  button: {
    position: 'absolute',
    top: -93,
    right: 10,
    backgroundColor: '#3D0097',
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
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  acceptButton: {
    backgroundColor: '#370185',
    borderRadius: 24,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    marginBottom: 10, // Añadimos un margen inferior para separarlo de los botones Cancel y Submit
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6A1B9A',
    backgroundColor: 'transparent',
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#6A1B9A',
    fontSize: 16,
  },
});

export default AddButton;
