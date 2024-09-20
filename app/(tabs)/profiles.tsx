import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text} from 'react-native';
import { ProfileList } from '@/components/ProfileList';

export default function Profiles() {

    // Recupero información
    async function getProfileData() {
        const data = await fetchProfiles("f5267f06-d68b-4185-a911-19f44b4dc216");
        setProfileData(data);
    };

    return(
        <View>
            <Text style={styles.displayText}> Perfiles </Text>
            <ProfileList/>
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

