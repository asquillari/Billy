import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const initialCategories = [
    {name: 'Expensas', amount: 0 },
    {name: 'Comida', amount: 0},
];

export const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState(initialCategories);

    const handleAddCategory = () => {
        const newCategory = {name: 'Nueva Categoría', amount: 0};
        setCategories([...categories, newCategory]);
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category, index) => (
                <View key={index} style={styles.category}>
                    <Text>{category.name}</Text>
                    {/*<Text>{'$${category.amount.toFixed(2)}'}</Text>*/}
                </View>
            ))}
            <TouchableOpacity onPress={handleAddCategory} style={styles.addCategoryButton}>
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