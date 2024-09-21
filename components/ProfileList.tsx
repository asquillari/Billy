import React from 'react';
import { useMemo, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, FlatList, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { addProfile, ProfileData, removeProfile, changeCurrentProfile } from '../api/api';
import { FontAwesome } from '@expo/vector-icons';

const EMAIL = "juancito@gmail.com";

interface ProfileListProps {
  profileData: ProfileData[] | null;
  refreshData: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = React.memo(({ profileData, refreshData }) => {

  const handleProfilePress = useCallback((profile: ProfileData) => {
    changeCurrentProfile(EMAIL, profile.id ?? "null");
  }, []);

  const handleLongPress = useCallback((profile: ProfileData) => {
    Alert.alert("Eliminar perfil", "¿Está seguro de que quiere eliminar el perfil?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
      onPress: async () => {
        if (profile) handleRemoveProfile(profile.id ?? "null");
        refreshData();
      }
    }]);
  }, [refreshData]);

  const handleRemoveProfile = async (id: string) => {
    await removeProfile(id);
    refreshData();  // Actualiza los datos después de eliminar
  };

  const renderItem = useCallback(({ item }: { item: ProfileData }) => (
    <TouchableOpacity onPress={() => handleProfilePress(item)} onLongPress={() => handleLongPress(item)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome name="dollar" size={24} color="green" />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.description}>{item.name}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleProfilePress, handleLongPress]);

  const keyExtractor = useCallback((item: ProfileData) => item.id?.toString() || '', []);

  const memoizedProfileData = useMemo(() => profileData || [], [profileData]);

  return (
    <View style={styles.container}>
        <FlatList data={memoizedProfileData} renderItem={renderItem} keyExtractor={keyExtractor}/>  
    </View>
  );
  });

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: 18,
        color: '#555',
        fontWeight: '400',
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    addButton: {
        backgroundColor: '#4a0e4e',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
      addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
