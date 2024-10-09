import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OutcomeList } from '@/components/OutcomeList';
import { BillyHeader } from '@/components/BillyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { RoutePropType } from '@/types/navigation';
import { useRoute } from '@react-navigation/native';

type Props = {
    route?: RoutePropType<'CategoryDetailsScreen'>;
};

const CategoryDetailsScreen: React.FC<Props> = () => {
    const route = useRoute<RoutePropType<'CategoryDetailsScreen'>>();
    const category = route.params?.category;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B00B8', '#20014E']} style={styles.gradientContainer}>
                <BillyHeader title={category.name} icon={category.icon}/>
                <View style={styles.contentContainer}>
                    <OutcomeList category={category.id} showDateSeparators={true}/>
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
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});

export default CategoryDetailsScreen;