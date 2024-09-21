import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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

    const handleAddProfile = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleProfileAdded = useCallback(() => {
        getProfileData();
        handleCloseModal();
    }, [getProfileData, handleCloseModal]);

    const memoizedProfileList = useMemo(() => (
        <ProfileList 
            profileData={profileData} 
            refreshData={getProfileData}
            onAddProfile={handleAddProfile}
        />
    ), [profileData, getProfileData, handleAddProfile]);

    return(
        <View style={styles.container}>
            <Text style={styles.displayText}>Perfiles</Text>
            {memoizedProfileList}
            <AddProfileModal 
                isVisible={isModalVisible} 
                onClose={handleCloseModal}
                onProfileAdded={handleProfileAdded}
            />
        </View>
    );
}

const styles = StyleSheet.create ({
    displayText : {
        color:'#FFFFFF',
        textAlign:'left',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
    },
    container: {
        flex: 1,
        padding: 16,
    },
});