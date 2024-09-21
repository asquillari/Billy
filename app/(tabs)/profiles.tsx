import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ProfileList } from '@/components/ProfileList';
import { fetchProfiles, ProfileData } from '@/api/api';
import AddProfileModal from '@/components/modals/AddProfileModal';
import BillyHeader from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';

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
            <LinearGradient colors={['#4B00B8', '#20014E']} start={{x: 1, y: 0}} end={{x: 0, y: 1}} style={styles.gradientContainer}>
                <BillyHeader title="Perfiles" subtitle="Gestioná tus perfiles individuales y grupales."/>
                <View style={styles.contentContainer}>
                    <View style={styles.rectangle}>
                        {memoizedProfileList}
                    </View>
                </View>
            </LinearGradient>
            <AddProfileModal isVisible={isModalVisible} onClose={handleCloseModal} onProfileAdded={handleProfileAdded}/>
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
        paddingTop: 10,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    rectangle: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        height: '97%',
        width: '95%',
        alignSelf: 'center',
    },
});