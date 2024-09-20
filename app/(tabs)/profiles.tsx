import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { ProfileList } from '@/components/ProfileList';
import { fetchProfiles, ProfileData } from '@/api/api';

export default function Profiles() {

    const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
    
    async function getProfileData() {
        const data = await fetchProfiles("juancito@gmail.com");
        setProfileData(data);
    };

    useEffect(() => {
        getProfileData();
    }, []);

    return(
        <View>
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
});

