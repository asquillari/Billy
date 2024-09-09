import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addIncome, addExpense } from '../api/api'; 

interface AddButtonProps {
  refreshIncomeData: () => void;
  refreshExpenseData: () => void;
}

const AddButton = ({ refreshIncomeData, refreshExpenseData }: AddButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'Income' | 'Outcome'>('Income'); // State for type selection
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(): Promise<void> {
    if (type === 'Income') {
      await addIncome("f5267f06-d68b-4185-a911-19f44b4dc216", parseInt(amount), description);
    } else {
      await addExpense("f5267f06-d68b-4185-a911-19f44b4dc216", parseInt(amount),"f9ab4221-1b2e-45e8-b167-bb288c97995c", description);
    }

    refreshIncomeData();
    refreshExpenseData();

    // Clear form
    setAmount('');
    setDescription('');
    setType('Income'); // Reset type to default

    // Close the modal
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Icon name="add" size={24} color="#000000" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Type</Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Income' && styles.typeButtonSelected]}
                onPress={() => setType('Income')}
              >
                <Text style={styles.typeButtonText}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Outcome' && styles.typeButtonSelected]}
                onPress={() => setType('Outcome')}
              >
                <Text style={styles.typeButtonText}>Outcome</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
            />

            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF0000" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: '100%',
  },
  button: {
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
  },
});

export default AddButton;
