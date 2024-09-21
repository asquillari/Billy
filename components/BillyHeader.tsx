import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface BillyHeaderProps {
  title: string;
  subtitle: string;
}

export const BillyHeader: React.FC<BillyHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <View style={styles.barraSuperior}>
        <Image
          source={require('../assets/images/Billy/logo2.png')}
          style={styles.logoBilly}
        />
        <Image
          source={require('../assets/images/icons/UserIcon.png')}
          style={styles.usuario}
        />
      </View>
      
      <View style={styles.tituloContainer}>
        <Text style={styles.tituloTexto}>{title}</Text>
        <Text style={styles.subtituloTexto}>{subtitle}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  barraSuperior: {
    marginTop: 25,
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
    height: 55,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta",
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -1.6,
  },
  subtituloTexto: {
    color: '#ffffff',
    fontFamily: "Amethysta",
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.12,
    marginTop: 5,
  },
});

export default BillyHeader;