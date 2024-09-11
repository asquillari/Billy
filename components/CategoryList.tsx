import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, Button, TextInput } from 'react-native';
import { addCategory, CategoryData } from '@/api/api';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface CategoryListProps {
    categoryData: CategoryData[] | null;
    refreshData: () => void;
  }

const initialCategories = [
    {name: 'Expensas', spent: 0 },
    {name: 'Comida', spent: 0},
];

// Function to generate random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const CategoryList: React.FC<CategoryListProps> = ({ categoryData, refreshData }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleAddCategory = async () => {
        const randomColor = getRandomColor(); // Generate a random color
        await addCategory("f5267f06-d68b-4185-a911-19f44b4dc216", name, randomColor, parseFloat(limit));
        setName('');
        setLimit('');
        setModalVisible(false);
        refreshData();
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categoryData?.map((category, index) => (
                <ThemedView key={index} style={[styles.category, { backgroundColor: category.color }]}>
                    <ThemedText>{`${category.name}\n$${category.spent}`}</ThemedText>
                </ThemedView>
            ))}

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addCategoryButton}>
                <Text style={styles.addCategoryText}>+</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false);}}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.label}>Nombre</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ingresar nombre"/>

                        <Text style={styles.label}>Límite</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={limit} onChangeText={setLimit} placeholder="Ingresar límite"/>

                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF0000" />
                            <Button title="Submit" onPress={handleAddCategory} />
                        </View>

                    </View>
                </View>
            </Modal>
        </ScrollView>       
    );
};

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: 16,
    },
    category: {
        padding: 16,
        backgroundColor: '#A1CEDC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        width:120,
    },
    addCategoryButton: {
        padding: 16,
        backgroundColor: '#FF6347',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    addCategoryText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
      },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Space out the buttons
        width: '100%',
    },
});