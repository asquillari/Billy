import { supabase } from '../lib/supabase';
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

var balance: number;

export const fetchIncomes = async () => {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select('*');
  return data;
};

export async function getIncome(id: number | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select()
    .match({id});
    
  return data;
};

export async function addIncome(incomeData: IncomeData) : Promise<IncomeData[] | null> {
  // Inserto información
  const { data } = await supabase
    .from('Incomes')
    .insert(incomeData);
  updateBalance(incomeData.amount);
  return data;
};

export async function removeIncome(id: number | undefined) {
    // Borro información
    await supabase
      .from('Incomes')
      .delete()
      .match({id});
}

export async function fetchExpenses() {
  // Recupero información
  const { data } = await supabase
    .from('Expenses')
    .select('*');
    
  return data;
};

export async function getExpense(id: number | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Expenses')
    .select()
    .match({id});
    
  return data;
};

export async function addExpense(expenseData: ExpenseData): Promise<IncomeData[] | null> {
  // Inserto información
  const { data } = await supabase
    .from('Expenses')
    .insert(expenseData);
  updateBalance(-expenseData.amount);
  return data;
};

export async function removeExpense(id: number | undefined) {
  // Borro información
  await supabase
  .from('Expenses')
  .delete()
  .match({id});
}

export async function getBalance(): Promise<number> {
  return balance;
}

async function updateBalance(added: number) {
  balance += added;
}