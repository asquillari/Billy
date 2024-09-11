import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Dimensions, Text} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function Statistics(){

    return(
        <View>
            <Text style={styles.displayText}> Estadisticas </Text>
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

