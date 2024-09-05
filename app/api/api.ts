import { supabase } from '../../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IncomeData {
  id? : number;
  amount: number;
  description: string;
  created_at?: Timestamp;
}

export interface ExpenseData {
  id? : number;
  amount: number;
  description: string;
  category: string;
  created_at?: Timestamp;
}

export const fetchIncomes = async () => {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select('*');
  
  return data;
};

export const getIncome = async (id: number | undefined) => {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select()
    .match({id});
    
  return data;
};

export const addIncome = async (incomeData: IncomeData): Promise<IncomeData[] | null> => {
  // Inserto información
  const { data } = await supabase
    .from('Incomes')
    .insert(incomeData);

  return data;
};

export const removeIncome = async (id: number | undefined) => {
    // Borro información
    const { data } = await supabase
      .from('Incomes')
      .delete()
      .match({id});
}

export const fetchExpenses = async () => {
  // Recupero información
  const { data } = await supabase
    .from('Expenses')
    .select('*');
    
  return data;
};

export const getExpense = async (id: number | undefined) => {
  // Recupero información
  const { data } = await supabase
    .from('Expenses')
    .select()
    .match({id});
    
  return data;
};

export const addExpense = async (expenseData: ExpenseData): Promise<IncomeData[] | null> => {
  // Inserto información
  const { data } = await supabase
    .from('Expenses')
    .insert(expenseData);

  return data;
};

export const removeExpense = async (id: number | undefined) => {
  // Borro información
  const { data } = await supabase
  .from('Expenses')
  .delete()
  .match({id});
}