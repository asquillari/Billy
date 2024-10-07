import React, { useMemo } from 'react';
import { useCallback, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ProfileData, removeProfile, changeCurrentProfile, generateInvitationLink } from '@/api/api';
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
  const [localCurrentProfileId, setLocalCurrentProfileId] = useState<string | null>(currentProfileId);

  const handleProfilePress = useCallback((profile: ProfileData) => {
    const newProfileId = profile.id ?? "null";
    changeCurrentProfile(email, newProfileId).then(() => {
      setLocalCurrentProfileId(newProfileId);
      refreshData();
      navigation.navigate('index' as never);
    });
  }, [email, refreshData, navigation]);

  const handleRemoveProfile = useCallback(async (id: string) => {
    await removeProfile(id);
    refreshData();
  }, [refreshData]);
  
  const handleLongPress = useCallback((profile: ProfileData) => {
    if (profile.is_shared) { 
      generateInvitationLink(profile.id ?? "null").then(link => {
        console.log(link);
        Clipboard.arguments.setString(link);
        Alert.alert("Enlace copiado", "El enlace de invitación ha sido copiado al portapapeles.");
      });
    } else {
      Alert.alert("Eliminar perfil", "¿Está seguro de que quiere eliminar el perfil?", [{
        text: "Cancelar",
        style: "cancel"
      }, {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          if (profile) handleRemoveProfile(profile.id ?? "null");
          refreshData();
        }
      }]);
    }
  }, [refreshData, handleRemoveProfile]);
  
  const renderItem = useCallback(({ item }: { item: ProfileData | 'add' }) => {
    const isCurrentProfile = item !== 'add' && item.id === localCurrentProfileId;
    const isSharedProfile = item !== 'add' && item.is_shared == true;
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
        <Ionicons name={isSharedProfile ? "globe-outline" : "person-circle-outline"} size={40} color="#4B00B8"/>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.balanceText}>${item.balance?.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }, [onAddProfile, handleProfilePress, handleLongPress, localCurrentProfileId]);

  const sortedData = useMemo(() => {
    return profileData ? [...profileData].sort((a, b) => a.name.localeCompare(b.name)) : [];
  }, [profileData]);

  const data = useMemo(() => [...sortedData, 'add' as const], [sortedData]);

  const keyExtractor = useCallback((item: ProfileData | 'add') => typeof item === 'string' ? item : item.id?.toString() ?? '', []);

  return (
    <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} numColumns={2} columnWrapperStyle={styles.row}/>
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