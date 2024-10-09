import React from 'react';
import { StyleSheet, Alert, View, Image, TouchableOpacity, Text } from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { logOut } from '@/api/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface BillyHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: string;
}

export const BillyHeader: React.FC<BillyHeaderProps> = React.memo(({ title, subtitle, icon }) => {
  const navigation = useNavigation();
  
  const handleLogout = async () => {
    const result = await logOut();
    if (result.error) Alert.alert('Logout Error', result.error);
    navigation.navigate('start' as never);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.barraSuperior}>
        <Image source={require('../assets/images/Billy/logo2.png')} style={styles.logoBilly}/>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('../assets/images/icons/UserIcon.png')} style={styles.usuario} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.textIconContainer}>
        <View style={styles.tituloContainer}>
          {title && <Text style={styles.tituloTexto}>{title}</Text>}
          {subtitle && <Text style={styles.subtituloTexto}>{subtitle}</Text>}
        </View>
        {icon && (
          <Icon name={icon} size={40} color="#FFFFFF" style={styles.icon} />
        )}
      </View>
    </View>
  );
});

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : (StatusBar.currentHeight ?? 0) + 10;

const styles = StyleSheet.create({
  barraSuperior: {
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logoBilly: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  usuario: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    alignSelf: 'center',
  },
  tituloContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tituloTexto: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1.6,
  },
  subtituloTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.12,
    marginTop: 5,
  },
  headerContainer: {
    paddingTop: STATUSBAR_HEIGHT,
  },
  icon: {
    marginRight: 15,
  },
  textIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default BillyHeader;