import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Alert } from 'react-native';
import { addCategory, CategoryData, removeCategory, fetchOutcomesByCategory } from '@/api/api';
import { ThemedText } from './ThemedText';
import { OutcomeData } from '@/api/api';
import { OutcomeList } from './OutcomeList';

interface CategoryListProps {
    categoryData: CategoryData[] | null;
    refreshCategoryData: () => void;
    refreshAllData: () => void;
}

// Function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const CategoryList: React.FC<CategoryListProps> = ({ categoryData, refreshCategoryData, refreshAllData }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    // For details
    const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
    
    // Get categories' outcomes
    async function getOutcomeData(profile: string, category: string) {
        const data = await fetchOutcomesByCategory(profile, category);
        setOutcomeData(data);
        refreshAllData();
    };

    // See category details
    const handleCategoryPress = (category: CategoryData) => {
        setSelectedCategory(category);
        // This is needed for everything to work
        getOutcomeData("f5267f06-d68b-4185-a911-19f44b4dc216", category.id ?? "null").then(() => {setDetailsModalVisible(true);});
    };

    // For deleting
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    // Remove category
    const handleLongPress = (category: CategoryData) => {
        setSelectedCategory(category);
        Alert.alert("Eliminar categoría", "¿Está seguro de que quiere eliminar la categoría?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
            onPress: async () => {
                if (category) {
                    await removeCategory("f5267f06-d68b-4185-a911-19f44b4dc216", category.id);
                    refreshCategoryData();
                }
            }
        }]);
    };

    // Adds category
    const handleAddCategory = async () => {
        const randomColor = getRandomColor(); // Generate a random color
        await addCategory("f5267f06-d68b-4185-a911-19f44b4dc216", name, randomColor, parseFloat(limit));
        setName('');
        setLimit('');
        setModalVisible(false);
        refreshCategoryData();
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categoryData?.map((category, index) => (
                <TouchableOpacity key={index} onPress={() => handleCategoryPress(category)} onLongPress={() => handleLongPress(category)} style={[styles.category, { backgroundColor: category.color }]}>
                    <ThemedText>{`${category.name}\n$${category.spent}`}</ThemedText>
                </TouchableOpacity>
            ))}

            {/* Add button */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addCategoryButton}>
                <Text style={styles.addCategoryText}>+</Text>
            </TouchableOpacity>

            {/* Modal for details */}
            <Modal animationType="slide" transparent={true} visible={detailsModalVisible} onRequestClose={() => { setDetailsModalVisible(false); }}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {selectedCategory && (
                            <>
                                <Text style={styles.modalTitle}>{selectedCategory.name} (${selectedCategory.spent})</Text>
                                <OutcomeList outcomeData={outcomeData} refreshData={() => getOutcomeData("f5267f06-d68b-4185-a911-19f44b4dc216", selectedCategory?.id ?? "null")} />
                                <View style={styles.buttonContainer}>
                                    <Button title="Close" onPress={() => setDetailsModalVisible(false)} color="#FF0000" />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal for adding */}
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
    outcomeItem: {
        marginBottom: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#000000',
      },
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
    modalDetail: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
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