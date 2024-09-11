import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const initialFolders = [
    {name: 'Expensas', amount: 0 },
    {name: 'Comida', amount: 0},
];

export const FolderList: React.FC = () => {
    const [folders, setFolders] = useState(initialFolders);

    const handleAddFolder = () => {
        const newFolder = {name: 'Nueva Carpeta', amount: 0};
        setFolders([...folders, newFolder]);
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.foldersContainer}>
            {folders.map((folder, index) => (
                <View key={index} style={styles.folder}>
                    <Text>{folder.name}</Text>
                    {/*<Text>{'$${folder.amount.toFixed(2)}'}</Text>*/}
                </View>
            ))}
            <TouchableOpacity onPress={handleAddFolder} style={styles.addFolderButton}>
                <Text style={styles.addFolderText}>+</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    foldersContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: 16,
    },
    folder: {
        padding: 16,
        backgroundColor: '#A1CEDC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        width:120,
    },
    addFolderButton: {
        padding: 16,
        backgroundColor: '#FF6347',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    addFolderText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
});