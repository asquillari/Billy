import { supabase } from '../../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IncomeData {
  id? : number;
  amount: number;
  created_at?: Timestamp;
}

export interface ExpenseData {
  id? : number;
  amount: number;
  category: string;
  created_at?: Timestamp;
}

export const fetchIncome = async () => {
    // Recupero información
    const { data } = await supabase
      .from('Incomes')
      .select('*');
      
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

export const fetchExpense = async () => {
  // Recupero información
  const { data } = await supabase
    .from('Expenses')
    .select('*');
    
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