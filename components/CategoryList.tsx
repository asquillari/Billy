import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export const CategoryList: React.FC<CategoryListProps> = ({ categoryData, refreshData }) => {

    const handleAddCategory = async () => {
        await addCategory("f5267f06-d68b-4185-a911-19f44b4dc216", "Nueva Categoría");
        refreshData();
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categoryData?.map((category, index) => (
                <ThemedView key={index} style={styles.category}>
                    <ThemedText>{`${category.name}\n$${category.spent}`}</ThemedText>
                </ThemedView>
            ))}
            <TouchableOpacity onPress={() => handleAddCategory()} style={styles.addCategoryButton}>
                <Text style={styles.addCategoryText}>+</Text>
            </TouchableOpacity>
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
});