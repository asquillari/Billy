import { supabase } from '../../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IncomeData {
    id? : number;
    amount: number;
    created_at?: Timestamp;
}

export const fetchData = async () => {
    // Recupero información
    const { data } = await supabase
      .from('Incomes')
      .select('*');
      
    return data;
};

export const insertData = async (incomeData: IncomeData): Promise<IncomeData[] | null> => {
    // Inserto información
    const { data } = await supabase
      .from('Incomes')
      .insert(incomeData);

    return data;
};

export const removeData = async (id: number | undefined) => {
    // Borro información
    const { data } = await supabase
    .from('Incomes')
    .delete()
    .match({id});
}