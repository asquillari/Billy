import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addCategory } from '@/api/api';

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
  currentProfileId: string;
  sortedCategories: any[];
}

const gradients = [
  ['#F1B267', '#EEF160'],
  ['#7E91F7', '#41D9FA'],
  ['#F77EE4', '#B06ECF'],
  ['#CBEC48', '#50B654'],
  ['#48ECE2', '#62D29C']
];

let currentGradientIndex = 0;

const getNextGradient = () => {
  const gradient = gradients[currentGradientIndex];
  currentGradientIndex = (currentGradientIndex + 1) % gradients.length;
  return gradient;
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ 
  isVisible, 
  onClose, 
  onCategoryAdded, 
  currentProfileId,
  sortedCategories
}) => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    setErrorMessage('');
  }, []);

  const validateCategoryName = useCallback(() => {
    const categoryExists = sortedCategories.some(
      category => category.name.toLowerCase() === name.toLowerCase()
    );
    if (categoryExists) {
      setErrorMessage('Ya existe una categoría con ese nombre');
      return false;
    }
    return true;
  }, [name, sortedCategories]);

  const handleAddCategory = useCallback(async () => {
    if (!validateCategoryName()) return;
    const gradient = getNextGradient();
    await addCategory(currentProfileId, name, JSON.stringify(gradient), parseFloat(limit));
    setName('');
    setLimit('');
    onCategoryAdded();
    onClose();
  }, [validateCategoryName, currentProfileId, name, limit, onCategoryAdded, onClose]);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={handleNameChange} 
            placeholder="Ingresar nombre"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Text style={styles.label}>Límite</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={limit} 
            onChangeText={setLimit} 
            placeholder="Ingresar límite"
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#FF0000" />
            <Button title="Submit" onPress={handleAddCategory} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AddCategoryModal;