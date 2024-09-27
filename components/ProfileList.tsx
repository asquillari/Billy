import React from 'react';
import { useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ProfileData, removeProfile, changeCurrentProfile } from '@/api/api';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ProfileListProps {
    profileData: ProfileData[] | null;
    refreshData: () => void;
    onAddProfile: () => void;
    email: string;
    currentProfileId: string | null;
}

export const ProfileList: React.FC<ProfileListProps> = ({ profileData, refreshData, onAddProfile, email, currentProfileId }) => {
  const navigation = useNavigation();

  const handleProfilePress = useCallback((profile: ProfileData) => {
    changeCurrentProfile(email, profile.id ?? "null");
    navigation.navigate('index' as never);
  }, []);

  const handleRemoveProfile = async (id: string) => {
    await removeProfile(id);
    refreshData();
  };
  
  const handleLongPress = useCallback((profile: ProfileData) => {
    Alert.alert("Eliminar perfil", "¿Está seguro de que quiere eliminar el perfil?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if (profile) handleRemoveProfile(profile.id ?? "null");
        refreshData();
      }
    }]);
  }, [refreshData]);
  
  const renderItem = useCallback(({ item }: { item: ProfileData | 'add' }) => {
    const isCurrentProfile = item !== 'add' && item.id === currentProfileId;
    if (item === 'add') {
     return (
      <TouchableOpacity style={[styles.profileItem, styles.addButton]} onPress={onAddProfile}>
        <Ionicons name="add-circle-outline" size={40} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Perfil</Text>
      </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.profileItem, isCurrentProfile && styles.currentProfile]} onPress={() => handleProfilePress(item)} onLongPress={() => handleLongPress(item)}>
        <Ionicons name="person-circle-outline" size={40} color="#4B00B8"/>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.balanceText}>${item.balance?.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }, [onAddProfile, handleProfilePress, handleLongPress, currentProfileId]);

  const data = profileData ? [...profileData, 'add' as const] : ['add' as const];

  const keyExtractor = useCallback((item: ProfileData | 'add') => typeof item === 'string' ? item : item.id?.toString() ?? '', []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  profileItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 5,
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileName: {
    fontSize: 26,
    marginTop: 8,
    color: '#333',
    textAlign: 'center',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B00B8',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4B00B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  currentProfile: {
    borderColor: '#4B00B8',
    borderWidth: 2,
  },
});