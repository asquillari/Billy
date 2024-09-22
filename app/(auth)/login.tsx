import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>{'<'}</ThemedText>
      </TouchableOpacity>

      <Image
        source={require('../../assets/images/Billy/logo2.png')}
        style={styles.logo}
      />

      <Image
        //source={require('@/assets/images/billy-illustration.png')}
        style={styles.illustration}
      />

      <ThemedText style={styles.title}>Inicio de sesión</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Mail o Número de teléfono"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <ThemedText style={styles.forgotPassword}>Olvidé mi contraseña</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <ThemedText style={styles.buttonText}>Iniciar Sesión</ThemedText>
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
  forgotPassword: {
    color: 'white',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});