import React, { useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryData } from '@/api/api';
import { useCategoryData } from '@/hooks/useCategoryData'; 
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Ionicons } from '@expo/vector-icons';

const CategoriesScreen = () => {
    const { currentProfileId } = useProfile();
    const { categoryData } = useCategoryData(currentProfileId || "");

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
                <TouchableOpacity style={[styles.categoryItem, styles.addButton]} onPress={handleAddCategory}>
                    <Ionicons name="add-circle-outline" size={40} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Agregar Categoría</Text>
                </TouchableOpacity>
            );
        }
        const gradientColors = item.color ? JSON.parse(item.color) : ['#CECECE', '#CECECE'];        
        return (
            <TouchableOpacity style={styles.categoryItem} onPress={() => {/* Handle category press */}}>
                <LinearGradient colors={gradientColors} style={styles.categoryGradient}>
                    <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                    <ThemedText style={styles.categoryAmount}>${item.spent}</ThemedText>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const handleAddCategory = () => {
        // Logic to open the modal or navigate to the add category screen
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
                <BillyHeader/>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Categorías</Text>
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
        width: '100%', // Ensure it fills the width of the parent
        height: '100%', // Ensure it fills the height of the parent
        borderRadius: 12, // Optional: to match the border radius of the category item
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