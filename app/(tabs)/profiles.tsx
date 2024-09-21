import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ProfileList } from '@/components/ProfileList';
import { fetchProfiles, ProfileData } from '@/api/api';
import AddProfileModal from '@/components/AddProfileModal';

const EMAIL = "juancito@gmail.com";

export default function Profiles() {

    const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const getProfileData = useCallback(async () => {
        const data = await fetchProfiles(EMAIL);
        setProfileData(data);
    }, []);

    useEffect(() => {
        getProfileData();
    }, [getProfileData]);

    const handleAddProfile = () => {
        setIsModalVisible(true);
    };

    return(
        <View style={styles.container}>
            <Text style={styles.displayText}>Perfiles</Text>
            <ProfileList profileData={profileData} refreshData={getProfileData}/>
            <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
                <Text style={styles.addButtonText}>+ Agregar Perfil</Text>
            </TouchableOpacity>
            <AddProfileModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} onProfileAdded={getProfileData}/>
        </View>
    );
}

const styles = StyleSheet.create ({
    displayText : {
        color:'#FFFFFF',
        textAlign:'left',
        fontSize: 36,
        fontWeight: 'bold',
        padding: 20,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    addButton: {
        backgroundColor: '#4B00B8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});