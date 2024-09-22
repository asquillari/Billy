import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { getOutcomesFromDateRangeAndCategory, fetchCategories,CategoryData } from '../api/api';

interface Expense {
  label: string;
  amount: number | null; 
  color: string;
}

// PieChart2 component
const PieChart2 = ({ data }: { data: Expense[] }) => {
  const radius = 110;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, item) => sum + (item.amount ?? 0), 0); // Adjust total calculation
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
          const percentage = item.amount !== null ? item.amount / total : 0; // Calculate the percentage for the segment
          const strokeDashoffset = circumference - (percentage * circumference);

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

          offset = strokeDashoffset; // Update offset for the next segment
          return segment;
        })}
      </Svg>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

function parseDate(month: number, year: number, init: number): Date {
  return new Date(Date.UTC(year, month, init));
}

// Box component
const userId = "f5267f06-d68b-4185-a911-19f44b4dc216";

export const Box = ({ Month, Year }: { Month: number; Year: number }) => {
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchData = async () => {
    try {
      const categories = await fetchCategories(userId);
      setCategoryData(categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (categoryData) {
        const calculatedExpenses = await Promise.all(
          categoryData.map(async (category) => {
            const amount = await getOutcomesFromDateRangeAndCategory(
              userId,
              parseDate(Month, Year, 1),
              parseDate(Month, Year, 29), // Provisional, subject to change
              category.id || 'otros-default' // Use default id if not available
            );

            return {
              label: category.name,
              amount,
              color: category.color,
            } as Expense;
          })
        );

        setExpenses(calculatedExpenses);
      }
    };

    fetchExpenses();
  }, [categoryData, Month, Year]);

  const maxAmount = Math.max(
    ...expenses.map(expense => expense.amount ?? 0),
    0
  );

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
      maxWidth: 400, // Optional: Set a max width for the expense items
      marginTop: 20, // Space between pie chart and expense items
    },
    expenseItem: {
      width: "48%", // Adjust width to fit two boxes
      height: 80,
      backgroundColor: "#ffffff",
      borderRadius: 12,
      elevation: 4, // Adds shadow on Android
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
      marginBottom: 10, // Space between text and colored bar
    },
    textWrapper: {
      color: "#3c3c3c",
      fontSize: 16,
      fontWeight: "400",
    },
    textWrapperAmount: {
      color: "#3c3c3c",
      fontSize: 12,
      fontWeight: "400",
    },
    rectangle: {
      borderRadius: 25,
      height: 13,
    },
    pieContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20, // Space between pie chart and boxes
      position: "absolute", // Position it absolutely
      top: "0%", // Move it above the center
      //left: "56.5%", // Center horizontally
      marginLeft: -125, // Half of the pie chart width (125)
    },
    valueContainer: {
      position: "absolute",
      top: "40%",
      left: "20%",
      alignItems: "center",
      justifyContent: "center",
    },
    valueText: {
      fontSize: 48,
      color: '#3c3c3c',
      textAlign: 'center',
      marginVertical: -5,
    },
  });
  
  export default Box;