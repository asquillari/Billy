import { supabase } from '../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IncomeData {
  id?: number;
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

export interface ProfileData {
  name: string;
  created_at?: Timestamp;
  balance: number; 
}

// Provisional, esto no se mantiene a través de sesiones (hay que linkearlo a los perfiles en la base de datos)
var balance = 0;



/* Incomes */

export async function fetchIncomes() {
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



/* Expenses */

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



/* Profiles */

export async function fetchProfiles() {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select('*');
  return data;
};

export async function getProfile(name: string | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select()
    .match({name});
  return data;
};

export async function addProfile(profileData: ProfileData) : Promise<IncomeData[] | null> {
  // Inserto información
  const { data } = await supabase
    .from('Profiles')
    .insert(profileData);
  return data;
};

export async function removeProfile(name: string | undefined) {
    // Borro información
    await supabase
      .from('Profiles')
      .delete()
      .match({name});
}



/* Balance */

export async function getBalance(): Promise<number> {
  return balance;
}

async function updateBalance(added: number) {  
  balance += added;
  console.log(balance);
}