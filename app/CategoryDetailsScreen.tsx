import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OutcomeList } from '@/components/OutcomeList';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RoutePropType, NavigationProp } from '@/types/navigation';
import { useRoute } from '@react-navigation/native';

type Props = {
    route?: RoutePropType<'CategoryDetailsScreen'>;
};

const CategoryDetailsScreen: React.FC<Props> = () => {
    const route = useRoute<RoutePropType<'CategoryDetailsScreen'>>();
    const navigation = useNavigation<NavigationProp<'CategoryDetailsScreen'>>();
    const category = route.params?.category;

    if (!category) {
        return (
            <View style={styles.container}>
                <Text>No category data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{category.name}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.categoryInfo}>
                        <Icon name={category.icon || 'cash-multiple'} size={60} color="#4B00B8" />
                        <Text style={styles.spentAmount}>${category.spent?.toFixed(2) || 0}</Text>
                    </View>
                    <OutcomeList category={category.id} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
    },
    categoryInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    spentAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4B00B8',
        marginTop: 10,
    },
});

export default CategoryDetailsScreen;