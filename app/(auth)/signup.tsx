import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '@/api/api';

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const user = await signUp(email, password, name, lastName);
      if (user) navigation.navigate('(tabs)' as never);
      else Alert.alert('Error de registro', 'No se pudo crear la cuenta');
    } catch (error) {
      Alert.alert('Error de registro', 'Ocurrió un error durante el registro');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>{'<'}</ThemedText>
      </TouchableOpacity>
      <Image source={require('../../assets/images/Billy/logo1.png')} style={styles.logo}/>
      <ThemedText style={styles.title}>Comenza en Billy</ThemedText>
      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#999" value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#999" value={lastName} onChangeText={setLastName}/>
      <TextInput style={styles.input} placeholder="Mail" placeholderTextColor="#999" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword}/>
      <TextInput style={styles.input} placeholder="Repetir Contraseña" placeholderTextColor="#999" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <ThemedText style={styles.buttonText}>Registrarme</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B00B8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});