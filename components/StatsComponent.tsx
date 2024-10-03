import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet  } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { useFocusEffect } from '@react-navigation/native';
import { getOutcomesFromDateRangeAndCategory, fetchCategories, CategoryData, fetchCurrentProfile, getSharedUsers } from '../api/api';
import { useUser } from '@/app/contexts/UserContext';
import { useProfile } from '@/app/contexts/ProfileContext';

interface Expense {
  label: string;
  amount: number; 
  color: string;
}

const generateRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

const parseDate = (month: number, year: number, init: number): Date => { return new Date(year, month, init); }

//if mode is false, then it's category. TODO: optimize this. Should be a better way.
export const StatsComponent = React.memo(({ month, year, mode }: { month: number; year: number, mode: boolean | null }) => {
  const { userEmail } = useUser();
  const { currentProfileId, setCurrentProfileId } = useProfile();
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const getCategories = useCallback(async () => {
    if (!currentProfileId) return;
    const categories = await fetchCategories(currentProfileId);
    setCategoryData(categories);
  }, [currentProfileId]);

  const calculateExpenses = useCallback(async () => {
    if (!categoryData || !currentProfileId) return;

    let calculatedExpenses: Expense[] = [];

    if (mode === false) { 
    const idColorMap = new Map<string, string>();
    const colorsRegistered = new Set<string>();

    calculatedExpenses = await Promise.all(
      categoryData.map(async (category) => {
        let color = idColorMap.get(category.id || "") || getColorForCategory(category, colorsRegistered);
        idColorMap.set(category.id || "", color);
        const total = await getCategoryTotal(currentProfileId, category.id || '', month, year);
        return { label: category.name, amount: total, color } as Expense;
      })
    );
    }
    
    else {
      const sharedUsers = await getSharedUsers(currentProfileId);
      if (sharedUsers) {
        calculatedExpenses = await Promise.all(
        sharedUsers.map(async (user) => {

          return { label: "test"+ Math.random().toPrecision(3), amount: 10, color: generateRandomColor() } as Expense;
        //TODO: falta que el back me pase las funciones para que funcione esto. 
        //const total = await getUserTotal(currentProfileId, user.id || '', month, year);
        //  return { label: user.name, amount: total, color: generateRandomColor() } as Expense;
        })
      );
      }
    }
  
    setExpenses(calculatedExpenses);
  }, [categoryData, currentProfileId, month, year]);

  const fetchProfile = useCallback(async () => {
    if (userEmail) {
      const profileData = await fetchCurrentProfile(userEmail);
      if (profileData && typeof profileData === 'string') {
        setCurrentProfileId(profileData);
      }
    }
  }, [userEmail, setCurrentProfileId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      getCategories();
    }, [fetchProfile, fetchCategories])
  );

  useEffect(() => {
    calculateExpenses();
  }, [calculateExpenses]);

  const getColorForCategory = (category: CategoryData, colorsRegistered: Set<string>): string => {
    const colors = JSON.parse(category.color);
    let color = colors[1];
    if (colorsRegistered.has(color)) color = generateRandomColor();
    colorsRegistered.add(color);
    return color;
  };
  
  const getCategoryTotal = async (profileId: string, categoryId: string, month: number, year: number): Promise<number> => {
    const OutcomeFromCategory = await getOutcomesFromDateRangeAndCategory(profileId, parseDate(month, year, 1), parseDate(month, year, 30), categoryId);
    return Array.isArray(OutcomeFromCategory) ? OutcomeFromCategory.reduce((sum, outcome) => sum + outcome.amount, 0) : 0;
  };

  const maxAmount = useMemo(() => expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0), [expenses]);

  return (
    <View style={styles.container}>
      <PieChart data={expenses}/>
      <View style={styles.box}>
        {expenses.map((expense) => (
          <ExpenseItem key={expense.label} expense={expense} maxAmount={maxAmount} />
        ))}
      </View>
    </View>
  );
});

const PieChart = React.memo(({ data }: { data: Expense[] }) => {
  const radius = 110;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const total = useMemo(() => data.reduce((sum, item) => sum + (item.amount ?? 0), 0), [data]);

  let accumulatedPercentage = 0;

  return (
    <View style={styles.pieContainer}>
      <Svg height={250} width={250}>
        <Circle cx={center} cy={center} r={radius} stroke="#f0f0f0" strokeWidth={strokeWidth} fill="transparent"/>
        {data.map((item, index) => {
          if (!item.color || typeof item.color !== 'string') return null;
          const percentage = item.amount !== null ? item.amount / total : 0;
          const strokeDashoffset = circumference * (1 - percentage);
          const rotation = accumulatedPercentage * 360;
          accumulatedPercentage += percentage;

          const validStrokeDashoffset = isNaN(strokeDashoffset) ? 0 : strokeDashoffset;
          const validRotation = isNaN(rotation) ? 0 : rotation;

          return (
            <Circle key={index} cx={center} cy={center} r={radius} stroke={item.color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={validStrokeDashoffset} transform={`rotate(${validRotation} ${center} ${center})`} strokeLinecap='round'/>
          );
        })}
      </Svg>

      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>${total.toFixed(0)}</Text>
      </View>
    </View>
  );
});

const ExpenseItem = React.memo(({ expense, maxAmount }: { expense: Expense; maxAmount: number }) => {
  const { label, amount, color } = expense;
  const barWidth = maxAmount > 0 ? ((amount ?? 0) / maxAmount) * 100 : 0;
  return (
    <View style={styles.expenseItem}>
      <View style={styles.textContainer}>
        <Text style={styles.textWrapper}>{label}</Text>
        <Text style={styles.textWrapperAmount}>- ${ (amount ?? 0).toFixed(2) }</Text>
      </View>
      <View style={[styles.rectangle, { backgroundColor: color, width: `${barWidth}%` }]}/>
    </View>
  );
});

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
