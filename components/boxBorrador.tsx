import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet,Dimensions  } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { useFocusEffect } from '@react-navigation/native';
import { getOutcomesFromDateRangeAndCategory, fetchCategories, CategoryData, fetchCurrentProfile } from '../api/api';
import { useUser } from '@/app/UserContext';
import { useProfile } from '@/app/ProfileContext';
import { PieChart } from 'react-native-chart-kit';
    
interface Expense {
  label: string;
  amount: number | null; 
  color: string;
}

interface ColorObject {
  color: string;
  id: string;
}

function generateRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`; // Ensure the color is always 6 digits
}


// Box component

export const Box = ({ month, year }: { month: number; year: number }) => {

  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);

  // const [categoryData2, setCategoryData2] = useState<CategoryData[] | null>(null);
  //const colors = ["#48ece2", "#94a9ff", "#7d90f7"];
  //let index = 0; 
  //const colorsUsed[id:string, color: string];

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      setCurrentProfileId(profileData?.current_profile || null);
    }
  }, [userEmail, setCurrentProfileId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  useEffect(() => {
    const fetchExpenses = async () => {

    const categories = await fetchCategories(currentProfileId||'');  
    const idColor: ColorObject[] = [];
    const colorsRegistered: string[] = [];

    setCategoryData(categories);
    //console.log("Fetched categories:", categories);

    if (categoryData) {
      const calculatedExpenses = await Promise.all(
        categoryData.map(async (category) => {
          let colorRegistered: string | undefined; 
          const isRegistered = idColor.some(item => item.id === category.id);
    
          // If the ID is already registered, use the same color
          if (isRegistered) {
            colorRegistered = idColor.find(item => item.id === category.id)?.color;
            
          } else {

            // Parse the JSON string to get an array of colors
            const colors = JSON.parse(category.color);
            const Color = colors[1]; // Use the first color (adjust index if needed)
    
            // Check if the color is already registered
            if (colorsRegistered.includes(Color)) {
              // Generate a new random color if the color is already used
              colorRegistered = generateRandomColor();
              colorsRegistered.push(colorRegistered);
            } else {
              colorRegistered = Color; // Use the color if it's not already registered
              colorsRegistered.push(colorRegistered||'');
            }
    
            idColor.push({ id: category.id || "", color: colorRegistered || "" });
          }
    
          return {
            label: category.name,
            amount: category.spent,
            color: colorRegistered,
          } as Expense;
        })
      );
    
      setExpenses(calculatedExpenses);
      //console.log("Calculated expenses:", calculatedExpenses);
    }
    

      //       // const amountCategory = await getOutcomesFromDateRangeAndCategory(
      //       //    currentProfileId || '',
      //       //   new Date('2024-09-01'),
      //       //   //parseDate(month, year, 1),
      //       //   new Date('2024-09-30'),
      //       //   //parseDate(month, year, 30), 
      //       //     category.id || '82678c1b-c0f1-4002-a1cc-a9e1f2e9909c'
      //       // );

      //      // console.log(`Category paso 1: ${amountCategory.spent || null}`);
      //      // setCategoryData2(amountCategory);
      //      // console.log(`Category paso 2: ${categoryData2}`);

            
             

      //       // amountCategory?.forEach(category => {
      //       //   //const date = category.id;
      //       //   console.log('category.id,category.name,category.color,category.spent,category.profile');

      //       //   console.log(category.id,category.name,category.color,category.spent, category.profile,category.limit);
      //       //   console.log(category.id,category.name,category.color,category.spent);
              
      //       // }, [currentProfileId]);

            
      //   );

      //    setExpenses(calculatedExpenses);
        // console.log("Calculated expenses:", calculatedExpenses);

      // }
    };

    fetchExpenses();
  }, [categoryData, month, year]);

  const maxAmount = expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);

  return (
    <View style={styles.container}>
      <PieChart2 data={expenses} />
      {/* <PieChartExample data={expenses} /> */}
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

 // console.log("Total amount for PieChart2:", numericTotal);

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
            return null; // Skip rendering this segment
          }

          const percentage = item.amount !== null ? item.amount / total : 0;
          //console.log(percentage);
          const strokeDashoffset = circumference * percentage;
          //console.log(strokeDashoffset);
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
              //strokeDasharray="5, 3"
              strokeDashoffset={offset}
            />
          );

          offset = strokeDashoffset;
          //console.log(`Circumference: ${circumference}, StrokeDasharray: ${circumference} ${circumference}, StrokeDashoffset: ${offset}`);
          //console.log(`Segment ${item.label}: ${item.amount} (${percentage * 100}%)`);
          return segment;
        })}
      </Svg>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>${numericTotal.toFixed(2)}</Text>

      </View>
    </View>
  );
};

function parseDate(month: number, year: number, init: number): Date {
  return new Date(Date.UTC(year, month, init));
}

// ExpenseItem component
const ExpenseItem = ({ label, amount, color, maxAmount }: { label: string; amount: number | null; color: string; maxAmount: number }) => {
  const barWidth = maxAmount > 0 ? ((amount ?? 0) / maxAmount) * 100 : 0;

 // console.log(`Expense Item - Label: ${label}, Amount: ${amount}, Bar Width: ${barWidth}%`);

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

const screenWidth = Dimensions.get('window').width;

const PieChartExample = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.label,
    amount: item.amount,
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <View style={styles.pieContainer}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2, // optional, defaults to 2
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute // If you want absolute values
      />
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

export default Box;
