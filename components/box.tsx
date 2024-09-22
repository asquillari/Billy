import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";

// PieChart2 component
const PieChart2 = ({ data }) => {
  const radius = 110;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate total amount
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let offset = 0;

  return (
    <View style={styles.pieContainer}>
      <Svg height={250} width={250}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {data.map((item, index) => {
          const percentage = item.amount / total; // Calculate the percentage for the segment
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
        <Text style={styles.valueText}>${total}</Text>
      </View>
    </View>
  );
};

// Box component
export const Box = () => {
  const expenses = [
    { label: "Nafta", amount: 350, color: "#48ece2" },
    { label: "Comida", amount: 150, color: "#94a9ff" },
    { label: "Expensas", amount: 1000, color: "#7d90f7" },
  ];

  const maxAmount = Math.max(...expenses.map(expense => expense.amount));

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
const ExpenseItem = ({ label, amount, color, maxAmount }) => {
  const barWidth = (amount / maxAmount) * 100; // Calculate the width as a percentage

  return (
    <View style={styles.expenseItem}>
      <View style={styles.textContainer}>
        <Text style={styles.textWrapper}>{label}</Text>
        <Text style={styles.textWrapperAmount}>- ${amount.toFixed(2)}</Text>
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
    paddingTop: 260, // Add some top padding for the overall container
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
    left: "56.5%", // Center horizontally
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
