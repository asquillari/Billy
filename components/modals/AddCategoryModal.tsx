import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isVisible, onClose, onCategoryAdded, currentProfileId,sortedCategories }) => {
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
        <Text style={styles.title}>Crear una carpeta</Text>

          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={handleNameChange} 
            placeholder="Ingresar nombre"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={limit} 
            onChangeText={setLimit} 
            placeholder="Ingresar límite"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
              <Text style={styles.buttonText}>Crear</Text>
            </TouchableOpacity>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#4B00B8',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AddCategoryModal;