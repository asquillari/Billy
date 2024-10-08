import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CategoryData } from '@/api/api';
import { useCategoryData } from '@/hooks/useCategoryData'; 

const CategoriesScreen = () => {
    const { categoryData } = useCategoryData();

    const renderCategory = ({ item }: { item: CategoryData }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>${item.spent}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            <FlatList
                data={categoryData}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id || 'defaultKey'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    categoryName: {
        fontSize: 18,
    },
    categoryAmount: {
        fontSize: 16,
        color: '#888',
    },
});

export default CategoriesScreen;