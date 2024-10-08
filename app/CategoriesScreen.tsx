import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CategoryData } from '@/api/api';
import { useCategoryData } from '@/hooks/useCategoryData'; 
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';

const CategoriesScreen = () => {
    const { categoryData } = useCategoryData();

    const sortedCategories = useMemo(() => {
        if (!categoryData) return [];
        const othersCategory = categoryData.find(cat => cat.name === "Otros");
        const otherCategories = categoryData.filter(cat => cat.name !== "Otros").sort((a, b) => parseFloat(String(b.spent ?? '0')) - parseFloat(String(a.spent ?? '0')));
        return [...otherCategories, othersCategory];
    }, [categoryData]);

    const renderCategory = ({ item }: { item: CategoryData }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>${item.spent}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
                <BillyHeader/>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Categorías</Text>
                    <FlatList
                        data={categoryData}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id || 'defaultKey'}
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
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
        marginHorizontal: '2.5%',
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
        fontSize: 18,
    },
    categoryAmount: {
        fontSize: 16,
        color: '#888',
    },
});

export default CategoriesScreen;