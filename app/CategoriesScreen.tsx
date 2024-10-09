import React, { useCallback, useMemo, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CategoryData, removeCategory, OutcomeData, fetchOutcomesByCategory } from '@/api/api';
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/hooks/useAppContext';

const CategoriesScreen = () => {
    const { categoryData } = useAppContext();

    const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    async function getOutcomeData(category: string) {
        const data = await fetchOutcomesByCategory(category);
        setOutcomeData(data as OutcomeData[]);
    };

    const sortedCategories = useMemo(() => {
        if (!categoryData) return [];
        const othersCategory = categoryData.find(cat => cat.name === "Otros");
        const otherCategories = categoryData.filter(cat => cat.name !== "Otros").sort((a, b) => parseFloat(String(b.spent ?? '0')) - parseFloat(String(a.spent ?? '0')));
        return [...otherCategories, othersCategory];
    }, [categoryData]);

    const categoriesWithAddButton = [...sortedCategories, { id: 'add-category', name: '+', spent: null, color: null }];

    const renderCategory = ({ item }: { item: CategoryData }) => {
        if (item.id === 'add-category') {
            return (
                <TouchableOpacity style={[styles.categoryItem, styles.addButton]} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={40} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Agregar Categoría</Text>
                </TouchableOpacity>
            );
        }
        const gradientColors = item.color ? JSON.parse(item.color) : ['#CECECE', '#CECECE'];        
        return (
            <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)} onLongPress={() => handleLongPress(item)}>
                <LinearGradient colors={gradientColors} style={styles.categoryGradient}>
                    <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                    <ThemedText style={styles.categoryAmount}>${item.spent}</ThemedText>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const handleCategoryPress = useCallback((category: CategoryData) => {
        setSelectedCategory(category);
        getOutcomeData(category.id ?? "null").then(() => {
            setDetailsModalVisible(true);
        });
    }, [getOutcomeData]);

    const handleLongPress = useCallback((category: CategoryData) => {
        if (category.name === "Otros") {
            Alert.alert("Acción no permitida", "La categoría 'Otros' no puede ser eliminada.");
            return;
        }
        setSelectedCategory(category);
        Alert.alert("Eliminar categoría", "¿Está seguro de que quiere eliminar la categoría?", [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive",
            onPress: async () => {
                if (category) {
                    await removeCategory(category.id||"null");
                }
            }}]);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
            <BillyHeader title="Categorías" subtitle="Tus gastos divididos según su tipo" />
                <View style={styles.contentContainer}>
                    <FlatList
                        data={categoriesWithAddButton.filter((category): category is CategoryData => category !== undefined)}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id || 'defaultKey'}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    categoryItem: {
        borderRadius: 12,
        marginBottom: 5,
        width: '48%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    category: {
        width: '48%',
        flex: 1,
        margin: 8,
        borderRadius: 15,
        overflow: 'hidden',
    },
    addButton: {
        backgroundColor: '#4B00B8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    categoryGradient: {
        width: 180,
        height: 180,
        padding: 15,
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
        marginHorizontal: '2.5%',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 10,
    },
    categoryName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B3B3B',
    },
    categoryAmount: {
        fontSize: 18,
        color: '#3B3B3B',
    },
});

export default CategoriesScreen;