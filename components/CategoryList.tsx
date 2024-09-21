import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Alert } from 'react-native';
import { addCategory, CategoryData, removeCategory, fetchOutcomesByCategory } from '@/api/api';
import { ThemedText } from './ThemedText';
import { OutcomeData } from '@/api/api';
import { OutcomeList } from './OutcomeList';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

const DEFAULT_OTROS_CATEGORY: CategoryData = {
  id: 'otros-default',
  profile: 'f5267f06-d68b-4185-a911-19f44b4dc216',
  name: 'Otros',
  color: JSON.stringify(['#AAAAAA', '#AAAAAA']), 
  spent: 0,
  limit: 0,
};

interface CategoryListProps {
    categoryData: CategoryData[] | null;
    refreshCategoryData: () => void;
    refreshAllData: () => void;
    currentProfileId: string;
}

const gradients = [
    ['#F1B267', '#EEF160'],
    ['#7E91F7', '#41D9FA'],
    ['#F77EE4', '#B06ECF'],
    ['#CBEC48', '#50B654'],
    ['#48ECE2', '#62D29C']
];

let currentGradientIndex = 0;

const getNextGradient = () => {
    const gradient = gradients[currentGradientIndex];
    currentGradientIndex = (currentGradientIndex + 1) % gradients.length;
    return gradient;
};

const parseGradient = (color: string): string[] => {
    try {
        return JSON.parse(color);
    } catch {
        return ['#48ECE2', '#62D29C']; // Colores por defecto
    }
};

export const CategoryList: React.FC<CategoryListProps> = ({ categoryData, refreshCategoryData, refreshAllData, currentProfileId }) => {

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const colorScheme = useColorScheme();

    // For details
    const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
    
    // Get categories' outcomes
    async function getOutcomeData(profile: string, category: string) {
        const data = await fetchOutcomesByCategory(profile, category);
        setOutcomeData(data);
        refreshAllData();
    };

    // Aseguramos que "Otros" siempre esté presente y al final
    const sortedCategories = useMemo(() => {
        if (!categoryData) return [DEFAULT_OTROS_CATEGORY];
        const otrosCategory = categoryData.find(cat => cat.name === "Otros") || DEFAULT_OTROS_CATEGORY;
        const otherCategories = categoryData.filter(cat => cat.name !== "Otros").reverse();
        return [...otherCategories, otrosCategory];
    }, [categoryData]);

    // See category details
    const handleCategoryPress = useCallback((category: CategoryData) => {
        setSelectedCategory(category);
        getOutcomeData(currentProfileId, category.id ?? "null").then(() => {
            setDetailsModalVisible(true);
        });
    }, [getOutcomeData]);

    // For deleting
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const handleLongPress = useCallback((category: CategoryData) => {
        if (category.name === "Otros") {
            Alert.alert("Acción no permitida", "La categoría 'Otros' no puede ser eliminada.");
            return;
        }
        setSelectedCategory(category);
        Alert.alert("Eliminar categoría", "¿Está seguro de que quiere eliminar la categoría?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
            onPress: async () => {
                if (category) {
                    await removeCategory(currentProfileId, category.id);
                    refreshCategoryData();
                }
            }
        }]);
    }, [refreshCategoryData]);

    const getCategoryColor = useCallback((category: CategoryData) => {
        return category.name === "Otros" ? ['#CECECE', '#CECECE'] : parseGradient(category.color);
    }, []);

    const handleNameChange = (text: string) => {
        setName(text);
        setErrorMessage('');
    };

    const validateCategoryName = () => {
        const categoryExists = sortedCategories.some(
            category => category.name.toLowerCase() === name.toLowerCase()
        );
        if (categoryExists) {
            setErrorMessage('Ya existe una categoría con ese nombre');
            return false;
        }
        return true;
    };

    const handleAddCategory = async () => {
        if (!validateCategoryName()) return;
        const gradient = getNextGradient();
        await addCategory(currentProfileId, name, JSON.stringify(gradient), parseFloat(limit));
        setName('');
        setLimit('');
        setModalVisible(false);
        refreshCategoryData();
    };

    // Separe function to update it only when necessary
    const renderCategory = useCallback((category: CategoryData, index: number) => {
        const gradientColors = getCategoryColor(category);
        return (
            <TouchableOpacity key={category.id || index} onPress={() => handleCategoryPress(category)} onLongPress={() => handleLongPress(category)}>
                <LinearGradient colors={gradientColors} style={styles.category} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                    <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                    <ThemedText style={styles.categoryAmount}>${category.spent}</ThemedText>
                </LinearGradient>
            </TouchableOpacity>
        );
    }, [getCategoryColor, handleCategoryPress, handleLongPress]);

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {sortedCategories.map(renderCategory)}

            {/* Add button */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.category}>
                <Text style={[
                    styles.addCategoryText,
                    { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
                ]}>+</Text>
            </TouchableOpacity>

            {/* Modal for details */}
            <Modal animationType="slide" transparent={true} visible={detailsModalVisible} onRequestClose={() => { setDetailsModalVisible(false); }}>
                <View style={styles.detailsModalBackground}>
                    <View style={styles.detailsModalContainer}>
                        {selectedCategory && (
                            <>
                                <Text style={styles.detailsModalTitle}>{selectedCategory.name} (${selectedCategory.spent})</Text>
                                <OutcomeList outcomeData={outcomeData} refreshData={() => getOutcomeData(currentProfileId, selectedCategory?.id ?? "null")} currentProfileId={currentProfileId} />
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
                        <TextInput 
                            style={styles.input} 
                            value={name} 
                            onChangeText={handleNameChange} 
                            placeholder="Ingresar nombre"
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <Text style={styles.label}>Límite</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="numeric" 
                            value={limit} 
                            onChangeText={setLimit} 
                            placeholder="Ingresar límite"
                        />

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
        width: 150,
        height: 80,
        padding: 15,
        borderRadius: 15,
        marginRight: 16,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    folderTab: {
        position: 'absolute',
        top: 0,
        left: 15,
        right: 15,
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    addCategoryButton: {
        padding: 16,
        backgroundColor: '#FF6347',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 80,
    },
    addCategoryText: {
        fontSize: 24,
    },
    outcomeItem: {
        marginBottom: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#000000',
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
    detailsModalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    detailsModalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 40,
        maxHeight: '80%',
    },
    detailsModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailsModalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    detailsModalAmount: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4CAF50',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#FF6347',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center', // Space out the buttons
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    categoryName: {
        color: '#000000', // Negro
        fontWeight: 'bold',
    },
    categoryAmount: {
        color: '#000000', // Negro
    },
});