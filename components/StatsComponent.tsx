import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet  } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { useFocusEffect } from '@react-navigation/native';
import { getOutcomesFromDateRangeAndCategory, fetchCategories, CategoryData, fetchCurrentProfile } from '../api/api';
import { useUser } from '@/app/contexts/UserContext';
import { useProfile } from '@/app/contexts/ProfileContext';
    
interface Expense {
  label: string;
  amount: number | null; 
  color: string;
}

interface ColorObject {
  color: string;
  id: string;
}

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

//month starts in 0 to 11.
export const StatsComponent = ({ month, year }: { month: number; year: number }) => {
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      setCurrentProfileId(profileData?.current_profile || null);
    }
  }, [userEmail, setCurrentProfileId]);

  useFocusEffect(useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  useEffect(() => {
    const fetchExpenses = async () => {

    const categories = await fetchCategories(currentProfileId||'');  
    const idColor: ColorObject[] = [];
    const colorsRegistered: string[] = [];

    setCategoryData(categories);

    if (categoryData) {
      const calculatedExpenses = await Promise.all(
        categoryData.map(async (category) => {
          let colorRegistered: string | undefined; 
        
          const isRegistered = idColor.some(item => item.id === category.id);
    
          if (isRegistered) {
            colorRegistered = idColor.find(item => item.id === category.id)?.color;
          } else {
            const colors = JSON.parse(category.color);
            const Color = colors[1]; 
    
            if (colorsRegistered.includes(Color)) {
              colorRegistered = generateRandomColor();
              colorsRegistered.push(colorRegistered);
            } else {
              colorRegistered = Color; 
              colorsRegistered.push(colorRegistered||'');
            }
    
            idColor.push({ id: category.id || "", color: colorRegistered || "" });
          }

          const OutcomeFromCategory = await getOutcomesFromDateRangeAndCategory(
              currentProfileId || '',
              parseDate(month, year, 1),
              parseDate(month, year, 30), 
                category.id || ''
            ); 

            let total = 0;

            OutcomeFromCategory?.forEach(outcome => {

              total += outcome.amount;
              
            }, [currentProfileId]);

          return { label: category.name, amount: total, color: colorRegistered } as Expense;
        })
      );
    
      setExpenses(calculatedExpenses);
    }
    };
    fetchExpenses();
  }, [categoryData, month, year]);

  const maxAmount = expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);

  return (
    <View style={styles.container}>
      <PieChart2 data={expenses} />
      <View style={styles.box}>
        {expenses.map((expense) => (
          <ExpenseItem key={expense.label} {...expense} maxAmount={maxAmount} />
        ))}
      </View>
    </View>
  );
};

// PieChart2 component
const PieChart2 = ({ data }: { data: Expense[] }) => {

  const radius = 110;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const numericTotal = typeof total === 'number' ? total : parseFloat(total as any) || 0;

  let offset = 0;

  return (
    <View style={styles.pieContainer}>
      <Svg height={250} width={250}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {data.map((item, index) => {

          if (!item.color || typeof item.color !== 'string') {
            console.warn(`Invalid color for item at index ${index}:`, item.color);
            return null; 
          }

          const percentage = item.amount !== null ? item.amount / total : 0;
          const segment = (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
            />
          );

          offset -= circumference * percentage;
          return segment;
        })}
      </Svg>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>${numericTotal.toFixed(0)}</Text>

      </View>
    </View>
  );
};

function parseDate(month: number, year: number, init: number): Date {
  return new Date(year, month, init);
}

// ExpenseItem component
const ExpenseItem = ({ label, amount, color, maxAmount }: { label: string; amount: number | null; color: string; maxAmount: number }) => {
  const barWidth = maxAmount > 0 ? ((amount ?? 0) / maxAmount) * 100 : 0;

  return (
    <View style={styles.expenseItem}>
      <View style={styles.textContainer}>
        <Text style={styles.textWrapper}>{label}</Text>
        <Text style={styles.textWrapperAmount}>- ${ (amount ?? 0).toFixed(2) }</Text>
      </View>
      <View style={[styles.rectangle, { backgroundColor: color, width: `${barWidth}%` }]} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 10,
      paddingTop: 260, 
    },
    box: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 400, 
      marginTop: 20, 
    },
    expenseItem: {
      width: "48%", 
      height: 80,
      backgroundColor: "#fff",
      borderRadius: 12,
      elevation: 4, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: 10,
      padding: 10,
      justifyContent: "flex-start",
    },
    textContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10, 
    },
    textWrapper: {
      color: "#3c3c3c",
      fontSize: 16,
      fontWeight: "400",
    },
    textWrapperAmount: {
      color: "#3c3c3c",
      fontSize: 12,
    },
    rectangle: {
      borderRadius: 25,
      height: 13,
    },
    pieContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
      marginBottom: 15, 
      position: "absolute", 
      marginLeft: -125,
    },
    valueContainer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    valueText: {
      fontSize: 36,
      color: '#3c3c3c',
      textAlign: 'center',
      marginVertical: -5,
    },
});

export default StatsComponent;
