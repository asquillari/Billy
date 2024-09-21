import React from 'react';
import { useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ProfileData, removeProfile, changeCurrentProfile } from '@/api/api';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

const EMAIL = "juancito@gmail.com";

interface ProfileListProps {
    profileData: ProfileData[] | null;
    refreshData: () => void;
    onAddProfile: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({ profileData, refreshData, onAddProfile }) => {
  
  const handleProfilePress = useCallback((profile: ProfileData) => {
    changeCurrentProfile(EMAIL, profile.id ?? "null");
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
    if (item === 'add') {
     return (
      <TouchableOpacity style={[styles.profileItem, styles.addButton]} onPress={onAddProfile}>
        <Ionicons name="add-circle-outline" size={35} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Perfil</Text>
      </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.profileItem} onPress={() => handleProfilePress(item)} onLongPress={() => handleLongPress(item)}>
        <Ionicons name="person-circle-outline" size={35} color="#4B00B8"/>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.balanceText}>${item.balance?.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }, [onAddProfile, handleProfilePress, handleLongPress]);

  const data = profileData ? [...profileData, 'add' as const] : ['add' as const];

  const keyExtractor = useCallback((item: ProfileData | 'add') => typeof item === 'string' ? item : item.id?.toString() ?? '', []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  profileItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%', // Adjust this value to control the gap between columns
    aspectRatio: 1, // Make items square
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});