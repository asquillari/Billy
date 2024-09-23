import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileList } from '@/components/ProfileList';
import { fetchProfiles, ProfileData } from '@/api/api';
import AddProfileModal from '@/components/modals/AddProfileModal';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../UserContext';

export default function Profiles() {
    const { userEmail } = useUser();
    const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const getProfileData = useCallback(async () => {
        const data = await fetchProfiles(userEmail);
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
            email={userEmail}
        />
    ), [profileData, getProfileData, handleAddProfile]);

    return(
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} start={{x: 1, y: 0}} end={{x: 0, y: 1}} style={styles.gradientContainer}>
                <BillyHeader title="Perfiles" subtitle="Gestioná tus perfiles individuales y grupales."/>
                <View style={styles.contentContainer}>
                    {memoizedProfileList}
                </View>
            </LinearGradient>
            <AddProfileModal isVisible={isModalVisible} onClose={handleCloseModal} onProfileAdded={handleProfileAdded} email={userEmail}/>
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
    },
    gradientContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
        marginHorizontal: '2.5%',
    },
});