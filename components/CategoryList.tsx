import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert, View } from 'react-native';
import { CategoryData, removeCategory, fetchOutcomesByCategory } from '@/api/api';
import { ThemedText } from './ThemedText';
import { OutcomeData } from '@/api/api';
import { LinearGradient } from 'expo-linear-gradient';
import AddCategoryModal from './modals/AddCategoryModal';
import CategoryDetailsModal from './modals/CategoryDetailsModal';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '@/hooks/useAppContext';

interface CategoryListProps {
    showAddButton?: boolean;
    showHeader?: boolean;
}

const parseGradient = (color: string): string[] => {
    try { return JSON.parse(color); } 
    catch { return ['#48ECE2', '#62D29C']; }
};

export const CategoryList: React.FC<CategoryListProps> = ({ showAddButton = true, showHeader }) => {    
    const navigation = useNavigation();

    const { outcomeData, refreshOutcomeData, categoryData, refreshCategoryData } = useAppContext();

    const [modalVisible, setModalVisible] = useState(false);

    // For details
    const [filteredOutcomeData, setFilteredOutcomeData] = useState<OutcomeData[]>([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    
    // Get categories' outcomes
    const getOutcomeData = useCallback((categoryId: string) => {
        const filtered = outcomeData?.filter(outcome => outcome.category === categoryId) || [];
        setFilteredOutcomeData(filtered);
      }, [outcomeData]);  

    // Aseguramos que "Otros" siempre esté presente y al final
    const sortedCategories = useMemo(() => {
        if (!categoryData) return [];
        const othersCategory = categoryData.find(cat => cat.name === "Otros");
        const otherCategories = categoryData.filter(cat => cat.name !== "Otros").sort((a, b) => parseFloat(String(b.spent ?? '0')) - parseFloat(String(a.spent ?? '0')));
        return [...otherCategories, othersCategory];
    }, [categoryData]);

    // See category details
    const handleCategoryPress = useCallback((category: CategoryData) => {
        setSelectedCategory(category);
        getOutcomeData(category.id ?? "null");
        setDetailsModalVisible(true);
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
                    await Promise.all([
                        refreshOutcomeData(),
                        refreshCategoryData()
                    ]);
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
        <View>
            {showHeader && (
                <View style={styles.rowContainer}>
                    <Text style={styles.categoriesTitle}>Categorías</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen' as never)}>
                        <Text style={styles.viewMoreText}>Ver más</Text>
                    </TouchableOpacity>
                </View>
            )}
    
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {sortedCategories.filter((category): category is CategoryData => category !== undefined).map(renderCategory)}
    
                {showAddButton && (
                    <TouchableOpacity style={styles.addCategoryButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.addCategoryButtonText}>+</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
    
            <CategoryDetailsModal
                isVisible={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                selectedCategory={selectedCategory}
            />
    
            <AddCategoryModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCategoryAdded={() => {
                    refreshCategoryData();
                    setModalVisible(false);
                }}
                sortedCategories={sortedCategories}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    viewMoreText: {
        color: '#4B00B8',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    categoriesContainer: {
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
        color: '#3B3B3B',
        fontWeight: 'bold',
    },
    categoryAmount: {
        color: '#3B3B3B',
    },
    addCategoryButton: {
        width: 40,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    addCategoryButtonText: {
        fontSize: 24,
        color: '#370185',
    },
});