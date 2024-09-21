import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CategoryData, removeCategory, fetchOutcomesByCategory } from '@/api/api';
import { ThemedText } from './ThemedText';
import { OutcomeData } from '@/api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import AddCategoryModal from './modals/AddCategoryModal';
import CategoryDetailsModal from './modals/CategoryDetailsModal';

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

const parseGradient = (color: string): string[] => {
    try { return JSON.parse(color); } 
    catch { return ['#48ECE2', '#62D29C']; }
};

export const CategoryList: React.FC<CategoryListProps> = ({ categoryData, refreshCategoryData, refreshAllData, currentProfileId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme();

    // For details
    const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    
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
            }}]);
    }, [refreshCategoryData]);

    const getCategoryColor = useCallback((category: CategoryData) => {
        return category.name === "Otros" ? ['#CECECE', '#CECECE'] : parseGradient(category.color);
    }, []);

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

            <CategoryDetailsModal
                isVisible={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                selectedCategory={selectedCategory}
                outcomeData={outcomeData}
                refreshData={() => getOutcomeData(currentProfileId, selectedCategory?.id ?? "null")}
                currentProfileId={currentProfileId}
            />

            <AddCategoryModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCategoryAdded={() => {
                    refreshCategoryData();
                    setModalVisible(false);
                }}
                currentProfileId={currentProfileId}
                sortedCategories={sortedCategories}
            />
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
    addCategoryText: {
        fontSize: 24,
    },
    categoryName: {
        color: '#000000',
        fontWeight: 'bold',
    },
    categoryAmount: {
        color: '#000000',
    },
});