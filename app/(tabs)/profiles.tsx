import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { ProfileList } from '@/components/ProfileList';
import { fetchProfiles, ProfileData } from '@/api/api';

const EMAIL = "juancito@gmail.com";

export default function Profiles() {

    const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
    
    const getProfileData = useCallback(async () => {
        const data = await fetchProfiles(EMAIL);
        setProfileData(data);
    }, []);

    useEffect(() => {
        getProfileData();
    }, [getProfileData]);

    return(
        <View style={styles.container}>
            <Text style={styles.displayText}> Perfiles </Text>
            <ProfileList profileData={profileData} refreshData={getProfileData}/>
        </View>
    );
    
}

const styles = StyleSheet.create ({
    displayText : {
        color:'#FFFFFF',
        textAlign:'left',
        fontSize: 36,
        fontWeight: 'bold',
        padding: 100,
    },
    container: {
        flex: 1,
        padding: 16,
    },
});

