import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@/hooks/useAppContext';

export default function Start() {
  const navigation = useNavigation();
  const { setUser } = useAppContext();

  // Do this in splash screen, eventually
  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('userSession');
      if (session) { 
        setUser(JSON.parse(session).user.email);
        navigation.navigate('(tabs)' as never);
      }
    };
    checkSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/images/Billy/billy-start.png')}/>
        <View style={styles.whiteContainer}>
          <ThemedText style={styles.title}>Manejar tu plata nunca fue tan fácil</ThemedText>
          <ThemedText style={styles.subtitle}>Llevá el control de tus ingresos y gastos de manera simple y rápida.</ThemedText>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('login' as never)}>
              <ThemedText style={styles.buttonText}>Iniciar Sesión</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('signup' as never)}>
              <ThemedText style={styles.secondaryButtonText}>Registrarme</ThemedText>
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
  logo: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    paddingTop: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  secondaryButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});