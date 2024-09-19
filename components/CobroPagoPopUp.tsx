import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CobroPagoPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  initialType: 'cobro' | 'pago';
}

const CobroPagoPopUp: React.FC<CobroPagoPopUpProps> = ({ isVisible, onClose, initialType }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState('Nunca');
  const [type, setType] = useState(initialType);
  const [bubblePosition] = useState(new Animated.Value(initialType === 'cobro' ? 0 : 1));

  useEffect(() => {
    setType(initialType);
    Animated.spring(bubblePosition, {
      toValue: initialType === 'cobro' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  }, [initialType]);

  const toggleType = (newType: 'cobro' | 'pago') => {
    setType(newType);
    Animated.spring(bubblePosition, {
      toValue: newType === 'cobro' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const bubbleLeft = bubblePosition.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '52%'],
  });

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.toggleContainer}>
              <Animated.View style={[styles.bubble, { left: bubbleLeft }]} />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleType('cobro')}
              >
                <Text style={[styles.toggleText, type === 'cobro' ? styles.activeToggleText : null]}>Cobro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleType('pago')}
              >
                <Text style={[styles.toggleText, type === 'pago' ? styles.activeToggleText : null]}>Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.title}>Agregar fecha de {type}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Monto"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.input}>
            <Text>{date || 'Seleccionar fecha'}</Text>
            <Ionicons name="calendar" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.input}>
            <Text>{repeat}</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#ffffff',
    borderRadius: 17,
    padding: 20,
    width: width * 0.9, // 90% del ancho de la pantalla
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#B29BD3',
    borderRadius: 12,
    width: '80%',
    height: 40,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
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
    fontFamily: 'Amethysta',
    fontSize: 12,
    color: '#370185',
  },
  activeToggleText: {
    color: '#370185',
  },
  title: {
    fontFamily: 'Amethysta',
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
    fontFamily: 'Amethysta',
    fontSize: 16,
  },
});

export default CobroPagoPopUp;
