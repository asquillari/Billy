import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { logIn } from '@/api/api';
import { useUser } from '../contexts/UserContext';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserEmail } = useUser();

  const handleLogin = async () => {
    try {
      const result = await logIn(email, password);
      if (result.user) { 
        setUserEmail(email);
        navigation.navigate('(tabs)' as never);
      } 
      else Alert.alert('Login Failed', 'Invalid email or password');
    } 
    
    catch (error) {
      Alert.alert('Login Error', 'An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>{'<'}</ThemedText>
      </TouchableOpacity>
      <Image style={styles.logo} source={require('../../assets/images/Billy/billy-start.png')}/>
      <View style={styles.whiteContainer}>
        <ThemedText style={styles.title}>Inicio de sesión</ThemedText>
        <TextInput style={styles.input} placeholder="Mail" placeholderTextColor="#999" value={email} onChangeText={setEmail}/>
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword}/>
        <TouchableOpacity>
          <ThemedText style={styles.forgotPassword}>Olvidé mi contraseña</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Iniciar Sesión</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4B00B8',
    justifyContent: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: 'black',
    fontSize: 24,
  },
  logo: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    paddingTop: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  forgotPassword: {
    color: 'black',
    textDecorationLine: 'underline',
  },
  loginButton: {
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