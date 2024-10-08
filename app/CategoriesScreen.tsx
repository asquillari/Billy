import React, { useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryData } from '@/api/api';
import { useCategoryData } from '@/hooks/useCategoryData'; 
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '@/app/contexts/ProfileContext';

const CategoriesScreen = () => {
    const { currentProfileId } = useProfile();
    const { categoryData } = useCategoryData(currentProfileId || "");

    const sortedCategories = useMemo(() => {
        if (!categoryData) return [];
        const othersCategory = categoryData.find(cat => cat.name === "Otros");
        const otherCategories = categoryData.filter(cat => cat.name !== "Otros").sort((a, b) => parseFloat(String(b.spent ?? '0')) - parseFloat(String(a.spent ?? '0')));
        return [...otherCategories, othersCategory];
    }, [categoryData]);

    const categoriesWithAddButton = [...sortedCategories, { id: 'add-category', name: '+ Agregar Categoría', spent: null, color: null }];

    const renderCategory = ({ item }: { item: CategoryData }) => {
        if (item.id === 'add-category') {
            return (
                <TouchableOpacity style={styles.addCategory} onPress={() => {/* Handle add category action */}}>
                    <LinearGradient colors={['#CECECE', '#CECECE']} style={styles.categoryGradient}>
                        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                    </LinearGradient>
                </TouchableOpacity>
            );
        }
        const gradientColors = item.color ? JSON.parse(item.color) : ['#CECECE', '#CECECE'];        
        return (
            <TouchableOpacity style={styles.category} onPress={() => {/* Handle category press */}}>
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
        flex: 1,
    },
    category: {
        width: '48%',
        flex: 1,
        margin: 8,
        borderRadius: 15,
        overflow: 'hidden',
    },
    addCategory: {
        width: '48%',
        margin: 8,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#4B00B8', // Background color for the add button
        justifyContent: 'center',
        alignItems: 'center',
        height: 80, // Set a height for the add button
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,    
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
        marginHorizontal: '2.5%',
    },
    addButton: {
        backgroundColor: '#4B00B8',
        borderRadius: 5,
        padding: 10,
        margin: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
        marginTop: 10,
    },
    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    categoryName: {
        fontWeight: 'bold',
        color: '#3B3B3B',
    },
    categoryAmount: {
        color: '#3B3B3B',
    },
});

export default CategoriesScreen;