import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


const INCOMES_TABLE = 'Incomes';
const OUTCOMES_TABLE = 'Outcomes';
const CATEGORIES_TABLE = 'Categories';
const PROFILES_TABLE = 'Profiles';
const USERS_TABLE = 'Users';

let BASE_URL: string;

if (__DEV__) {
  // En desarrollo, usa la URL de Expo
  BASE_URL = `exp://${Constants.expoConfig?.hostUri?.split(':')[0]}:19000`;
} else {
  // En producción, usa la URL de tu aplicación publicada
  BASE_URL = 'https://tu-app-publicada.com'; // Cambia esto por la URL real de tu app publicada
}

export { BASE_URL };

export interface UserData {
  email: string;
  password: string;
  name: string;
  surname: string;
  currentProfile?: string;
  my_profiles?: string[];
}

export interface IncomeData {
  id?: string;
  profile: string;
  amount: number;
  description: string;
  created_at?: Date;
}

export interface OutcomeData {
  id? : string;
  profile: string;
  category: string; 
  amount: number;
  description: string;
  created_at?: Date;
}

export interface CategoryData {
  id?: string
  name: string;
  profile: string;
  spent? : number;
  limit?: number;
  color: string;
  created_at?: Date;
}

export interface ProfileData {
  id?: string;
  name: string;
  balance?: number;
  created_at?: Date;
  owner: string;
  users?: string[];
  is_shared?: boolean;
}

export interface DebtData {
  id?: string;
  outcome: string;
  paid_by: string;
  debtor: string;
  has_paid: boolean;
  amount: number;
}

/* General data */

async function fetchData(table: string, columnToCheck: string, parentID: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(columnToCheck, parentID);

    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error(`Unexpected error from ${table}:`, error);
    return null;
  }
}

async function getData(table: string, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error getting ${table.slice(0, -1)}:`, error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error(`Unexpected error getting ${table.slice(0, -1)}:`, error);
    return null;
  }
}

async function addData(table: string, newData: any): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(newData)
      .select()
      .single();
    
    if (error) {
      console.error(`Error adding data to ${table}:`, error);
      return null;
    }
  
    return data;
  } 

  catch (error) {
    console.error(`Unexpected error adding data to ${table}:`, error);
    return null;
  }
}

async function removeData(table: string, id: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error removing item:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error removing item:", error);
    return null;
  }
}

async function updateData(table: string, columnToUpdate: string, update: any, columnToCheck: string, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .update({ [columnToUpdate]: update })
      .eq(columnToCheck, id)
      .single();
    
    if (error) {
      console.error(`Error updating ${columnToUpdate} in ${table} for ${columnToCheck} = ${id}:`, error);
      return null;
    }
      
    return data;
  } 

  catch (error) {
    console.error(`Unexpected error updating ${columnToUpdate} in ${table} for ${columnToCheck} = ${id}:`, error);
    return null;
  }
}

async function getValueFromData(table: string, columnToReturn: string, columnToCheck: string, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columnToReturn)
      .eq(columnToCheck, id)
      .single();
    
    if (error) {
      console.error(`Error fetching ${columnToReturn} from ${table}:`, error);
      return null;
    }
    
    return data ? (data as { [key: string]: any })[columnToReturn] ?? null : null;
  } 
  
  catch (error) {
    console.error(`Unexpected error fetching ${columnToReturn} from ${table}:`, error);
    return null;
  }
}



/* Incomes */

export async function fetchIncomes(profile: string): Promise<IncomeData[] | null> {
  return await fetchData(INCOMES_TABLE, 'profile', profile);
}

export async function getIncome(id: string): Promise<IncomeData | null> {
  return await getData(INCOMES_TABLE, id);
}

export async function addIncome(profile: string, amount: number, description: string, created_at?: Date): Promise<IncomeData[] | null> {
  try {
    const newIncome: IncomeData = { 
      profile: profile, 
      amount: amount, 
      description: description, 
      created_at: created_at, 
    };
    
    const [{ data: insertData, error: insertError }] = await Promise.all([
      supabase.from(INCOMES_TABLE).insert(newIncome).select(),
      updateBalance(profile, amount)
    ]);

    if (insertError) {
      console.error("Error adding income:", insertError);
      return null;
    }

    return insertData;
  } 
  
  catch (error) {
    console.error("Unexpected error adding income:", error);
    return null;
  }
};

export async function removeIncome(profile: string, id: string) {
  try {
    const income = await getIncome(id);
    
    if (!income) {
      console.error("Income not found:", id);
      return { error: "Income not found." };
    }

    const [deleteResult] = await Promise.all([
      supabase.from(INCOMES_TABLE).delete().eq('id', id),
      updateBalance(profile, -income.amount)
    ]);

    if (deleteResult.error) {
      console.error("Error removing income:", deleteResult.error);
      return null
    }

    return deleteResult;
  } 
  
  catch (error) {
    console.error("Unexpected error removing income:", error);
    return null;
  }
}



/* Outcomes */

export async function fetchOutcomes(profile: string): Promise<OutcomeData[] | null> {
  return await fetchData(OUTCOMES_TABLE, 'profile', profile);
}

export async function getOutcome(id: string): Promise<OutcomeData | null> {
  return await getData(OUTCOMES_TABLE, id);
}

export async function addOutcome(
  profile: string, 
  category: string, 
  amount: number, 
  description: string, 
  created_at?: Date,
  paid_by?: string,
  debtors?: string[]
): Promise<OutcomeData[] | null> {
  try {
    if (category === "" || !(await checkCategoryLimit(category, amount))) {
      console.log("No se pudo añadir debido al límite de categoría o categoría faltante");
      return null;
    }

    const newOutcome: OutcomeData = { 
      profile, 
      amount, 
      category, 
      description, 
      created_at: created_at || new Date()
    };
    
    const { data: outcomeData, error: outcomeError } = await supabase
      .from(OUTCOMES_TABLE)
      .insert(newOutcome)
      .select()
      .single();

    if (outcomeError) {
      console.error("Error añadiendo gasto:", outcomeError);
      return null;
    }

    // Si es un gasto grupal, añadir las deudas correspondientes
    if (paid_by && debtors && debtors.length > 0) {
      const amountPerPerson = amount / (debtors.length + 1);
      
      for (const debtor of debtors) {
        const success = await addDebt(outcomeData.id, paid_by, debtor, amountPerPerson);
        if (!success) {
          console.error("Error añadiendo deuda para", debtor);
          await supabase.from(OUTCOMES_TABLE).delete().eq('id', outcomeData.id);
          return null;
        }
      }
    }

    await Promise.all([
      updateBalance(profile, -amount),
      updateCategorySpent(category, amount)
    ]);

    return [outcomeData];
  } 

  catch (error) {
    console.error("Error inesperado añadiendo gasto:", error);
    return null;
  }
};

export async function removeOutcome(profile: string, id: string) {
  try {
    const outcome = await getOutcome(id);
    
    if (!outcome) {
      console.error("Outcome not found:", id);
      return { error: "Outcome not found." };
    }

    const [deleteResult] = await Promise.all([
      supabase.from(OUTCOMES_TABLE).delete().eq('id', id),
      updateBalance(profile, outcome.amount),
      updateCategorySpent(outcome.category, -outcome.amount)
    ]);

    if (deleteResult.error) {
      console.error("Error removing outcome:", deleteResult.error);
      return null;
    }

    return deleteResult;
  } 
  
  catch (error) {
    console.error("Unexpected error removing outcome:", error);
    return null;
  }
}

export async function fetchOutcomesByCategory(category: string): Promise<IncomeData[] | null> {
  try {
    const { data, error } = await supabase
      .from(OUTCOMES_TABLE)
      .select('*')
      .eq('category', category);

    if (error) {
      console.error("Error fetching outcomes by category:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching outcomes by category:", error);
    return null;
  }
};



/* Categories */

export async function fetchCategories(profile: string): Promise<CategoryData[] | null> {
  return await fetchData(CATEGORIES_TABLE, 'profile', profile);
}

export async function getCategory(category: string): Promise<CategoryData | null> {
  return await getData(CATEGORIES_TABLE, category);
};

export async function getCategoryIdByName(profile: string, categoryName: string): Promise<string | null> {
  const categories = await fetchData(CATEGORIES_TABLE, 'profile', profile);
  if (!categories) return null;
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.id : null;
}

export async function addCategory(profile: string, name: string, color: string, limit?: number): Promise<CategoryData | null> {
  const newCategory: CategoryData = { profile: profile, name: name, limit: limit, color: color };
  return await addData(CATEGORIES_TABLE, newCategory);
}

export async function removeCategory(category: string) {
  return await removeData(CATEGORIES_TABLE, category);
}

export async function getCategoryFromOutcome(outcome: string): Promise<CategoryData | null> {
  return await getValueFromData(OUTCOMES_TABLE, 'category', 'id', outcome);
}

async function getCategoryLimit(category: string): Promise<number | null> {
  return await getValueFromData(CATEGORIES_TABLE, 'limit', 'id', category);
}

async function getCategorySpent(category: string): Promise<number | null> {
  return await getValueFromData(CATEGORIES_TABLE, 'spent', 'id', category);
}

async function updateCategorySpent(category: string, added: number) {
  const currentSpent = await getCategorySpent(category);
  if (currentSpent !== null) return await updateData(CATEGORIES_TABLE, 'spent', currentSpent + added, 'id', category);
}

async function checkCategoryLimit(category: string, amount: number): Promise<boolean | null> {
  try {
    const limit = await getCategoryLimit(category);
    if (limit == null || limit <= 0) return true;
    const spent = await getCategorySpent(category);
    return ((spent??0) + amount <= limit);
  } 
  
  catch (error) {
    console.error("Error checking category limit:", error);
    return null;
  }
}



/* Profiles */

export async function fetchProfiles(user: string): Promise<ProfileData[] | null> {
  try {
    const profileIds = await getValueFromData(USERS_TABLE, 'my_profiles', 'email', user);
    
    if (!profileIds || !Array.isArray(profileIds)) {
      console.error("No profiles found or invalid data returned for user:", user);
      return null;
    }

    const profiles: ProfileData[] = [];

    for (const profileId of profileIds) {
      const profile = await fetchData(PROFILES_TABLE, 'id', profileId);
      if (profile && profile.length > 0) {
        profiles.push(profile[0]);
      }
    }

    return profiles;
  }

  catch (error) {
    console.error("Unexpected error in fetchProfiles:", error);
    return null;
  }
}

export async function getProfile(profileId: string): Promise<ProfileData | null> {
  return await getData(PROFILES_TABLE, profileId);
}

export async function addProfile(name: string, user: string): Promise<ProfileData | null> {
  try {
    const newProfile: ProfileData = { name, owner: user };
    const profile = await addData(PROFILES_TABLE, newProfile);

    const { error: userError } = await supabase.rpc('append_to_my_profiles', { user_email: user, new_profile_id: profile.id });
    const { error: profileError } = await supabase.rpc('append_user_to_profile', { profile_id: profile.id, new_user: user });

    if (userError || profileError) {
      console.error("Failed to append new profile to user's my_profiles:", userError && profileError);
      await removeData(PROFILES_TABLE, profile.id);
      return null;
    }

    return profile;
  } 
  
  catch (error) {
    console.error("Unexpected error in addProfile:", error);
    return null;
  }
}

export async function removeProfile(profileId: string) {
  try {
    const removedProfile = await removeData(PROFILES_TABLE, profileId);

    if (removedProfile) {
      const { error } = await supabase.rpc('remove_from_my_profiles', { profile_id_param: profileId });
      if (error) console.error("Error removing profile from user's my_profiles:", error);
    }

    return removedProfile;
  } 
  
  catch (error) {
    console.error("Unexpected error in removeProfile:", error);
    return null;
  }
}

export async function addSharedUsers(profileId: string, emails: string[]) {
  try {
    // Verificar que todos los emails existan en la tabla users
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .in('email', emails);

    if (checkError) {
      console.error("Error al verificar usuarios existentes:", checkError);
      return;
    }

    const existingEmails = existingUsers.map(user => user.email);
    const invalidEmails = emails.filter(email => !existingEmails.includes(email));

    if (invalidEmails.length > 0) {
      console.error("Los siguientes emails no existen en la tabla users:", invalidEmails);
      return;
    }

    // Actualizar el perfil como compartido
    if (await isProfileShared(profileId) === false) {
      await updateData(PROFILES_TABLE, 'is_shared', true, 'id', profileId);
    }

    // Compartir el perfil con los usuarios verificados
    for (const email of existingEmails) {
      const { error: userError } = await supabase.rpc('append_to_my_profiles', { user_email: email, new_profile_id: profileId });
      if (userError) console.error(`Error al compartir el perfil con ${email}:`, userError);

      const { error: profileError } = await supabase.rpc('append_user_to_profile', { profile_id: profileId, new_user: email });
      if (profileError) console.error(`Error al añadir ${email} al perfil ${profileId}:`, profileError);
    }
  } catch (error) {
    console.error("Error inesperado en addSharedUsers:", error);
  }
}

export async function removeSharedUsers(profileId: string, emails: string[]) {
  for (const email of emails) {
    const { error: userError } = await supabase.rpc('remove_from_my_profiles', { profile_id_param: profileId, user_email: email });
    if (userError) console.error(`Failed to remove ${email} from profile ${profileId}:`, userError);
    const { error: profileError } = await supabase.rpc('remove_user_from_profile', { profile_id: profileId, user_email: email });
    if (profileError) console.error(`Failed to remove ${email} from profile ${profileId}:`, profileError);
  }
}

export async function getSharedUsers(profileId: string): Promise<string[] | null> {
  return await getValueFromData(PROFILES_TABLE, 'users', 'id', profileId);
}

export async function isProfileShared(profileId: string): Promise<boolean | null> {
  return await getValueFromData(PROFILES_TABLE, 'is_shared', 'id', profileId);
}



/* Balance */

export async function fetchBalance(profile: string): Promise<number | null> {
  return await getValueFromData(PROFILES_TABLE, 'balance', 'id', profile);
}

async function updateBalance(profile: string, added: number): Promise<void | null> {
  try {
    // Calls atomic function to avoid the infamous race condition
    const { data, error } = await supabase.rpc('update_balance', { 
      profile_id: profile, 
      amount: added 
    });
    
    if (error) {
      console.error("Error updating balance:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error updating balance:", error);
    return null;
  }
}



/* User */

export async function addUser(email: string, password: string, name: string, surname: string): Promise<UserData | null> {
  const newUser: UserData = { email: email, password: password, name: name, surname: surname };
  return await addData(USERS_TABLE, newUser);
}

export async function signUp(email: string, password: string, name: string, surname: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      console.error("Error during sign up:", error);
      return { error };
    }

    const { user, session } = data;

    if (!user) {
      console.error("User is null during sign up");
      return { error: "User is null" };
    }

    const { error: insertError } = await supabase
      .from(USERS_TABLE)
      .insert([{ email: email, name: name, surname: surname }]);

    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return { error: insertError };
    }

    return { user, session };
  } 
  
  catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function logIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Error during login:", error);
      return { error: "Invalid login credentials" };
    }

    const { user, session } = data;

    const { data: profile, error: profileError } = await supabase
      .from(USERS_TABLE)
      .select('email, name, surname')
      .eq('email', user.email)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { error: profileError };
    }

    await AsyncStorage.setItem('userSession', JSON.stringify(session));

    return { user, profile, session };
  } 
  
  catch (error) {
    console.error("Unexpected error during login:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function logOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error during logout:", error);
      return { error: "Failed to log out." };
    }

    await AsyncStorage.removeItem('userSession');

    return { success: true };
  } 

  catch (error) {
    console.error("Unexpected error during logout:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function changeCurrentProfile(user: string, newProfileID: string) {
  return await updateData(USERS_TABLE, 'current_profile', newProfileID, 'email', user);
}

export async function fetchCurrentProfile(user: string) {
  return await getValueFromData(USERS_TABLE, 'current_profile', 'email', user);
}



/* Stats */

export async function getOutcomesFromDateRange(profile: string, start: Date, end: Date) {
  const startISO = start.toISOString();
  const endISO = end.toISOString();
  
  try {
    const { data, error } = await supabase
      .from(OUTCOMES_TABLE)
      .select()
      .eq('profile', profile)
      .gte('created_at', startISO)
      .lte('created_at', endISO);
    
    if (error) {
      console.error("Error fetching outcomes from date range:", error);
      return { error: "Failed to fetch outcomes." };
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching outcomes from date range:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getOutcomesFromDateRangeAndCategory(profile: string, start: Date, end: Date, category: string) {
  const startISO = start.toISOString();
  const endISO = end.toISOString();
  
  try {
    const { data, error } = await supabase
      .from(OUTCOMES_TABLE)
      .select()
      .eq('profile', profile)
      .gte('created_at', startISO)
      .lte('created_at', endISO)
      .eq('category', category);
    
    if (error) {
      console.error("Error fetching outcomes from date range and category:", error);
      return { error: "Failed to fetch outcomes by category." };
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching outcomes from date range and category:", error);
    return { error: "An unexpected error occurred." };
  }
}

/* Shared Profiles */

async function redistributeDebt(paidBy: string, debtor: string, amount: number): Promise<boolean> {
  try {
    const { data: debtorOwes, error: debtorError } = await supabase
      .from('Debts')
      .select('*')
      .eq('paid_by', debtor)
      .eq('has_paid', false);

    if (debtorError) {
      console.error("Error checking debtor's debts:", debtorError);
      return false;
    }

    if (debtorOwes && debtorOwes.length > 0) {
      for (const debt of debtorOwes) {
        const amountToRedistribute = Math.min(amount, debt.amount);
      
        const { error: updateError } = await supabase
          .from('Debts')
          .update({ amount: debt.amount - amountToRedistribute })
          .eq('id', debt.id);

        if (updateError) {
          console.error("Error updating existing debt:", updateError);
          return false;
        }

        const { error: newDebtError } = await supabase
          .from('Debts')
          .insert({
            outcome: debt.outcome,
            paid_by: paidBy,
            debtor: debt.debtor,
            has_paid: false,
            amount: amountToRedistribute
          });

        if (newDebtError) {
          console.error("Error creating new redistributed debt:", newDebtError);
          return false;
        }

        amount -= amountToRedistribute;
        if (amount <= 0) break;
      }
    }

    if (amount > 0) {
      const { error } = await supabase
        .from('Debts')
        .insert({
          outcome: null, 
          paid_by: paidBy,
          debtor: debtor,
          has_paid: false,
          amount: amount
        });

      if (error) {
        console.error("Error adding remaining debt:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Unexpected error redistributing debt:", error);
    return false;
  }
}

export async function addDebt(outcomeId: string, paidBy: string, debtor: string, amount: number): Promise<boolean> {
  try {
    const { data: existingDebt, error: existingDebtError } = await supabase
      .from('Debts')
      .select('*')
      .eq('paid_by', debtor)
      .eq('debtor', paidBy)
      .eq('has_paid', false)
      .single();

    if (existingDebtError && existingDebtError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error("Error checking existing debt:", existingDebtError);
      return false;
    }

    if (existingDebt) {
      if (existingDebt.amount >= amount) {
        const { error: updateError } = await supabase
          .from('Debts')
          .update({ amount: existingDebt.amount - amount })
          .eq('id', existingDebt.id);

        if (updateError) {
          console.error("Error updating existing debt:", updateError);
          return false;
        }
        return true;
      } else {
        const { error: deleteError } = await supabase
          .from('Debts')
          .delete()
          .eq('id', existingDebt.id);

        if (deleteError) {
          console.error("Error deleting existing debt:", deleteError);
          return false;
        }

        amount -= existingDebt.amount;
      }
    }

    return await redistributeDebt(paidBy, debtor, amount);
  } catch (error) {
    console.error("Unexpected error adding debt:", error);
    return false;
  }
}

export async function generateInvitationLink(profile: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('invitationLink')
      .insert({ profile: profile })
      .select()
      .single();

    if (error) {
      console.error("Error generating invitation link:", error);
      return null;
    }

    // Uses the configured base URL
    return `${BASE_URL}/invite/${data.id}`;
  } catch (error) {
    console.error("Unexpected error generating invitation link:", error);
    return null;
  }
}

export async function processInvitation(invitationId: string, email: string): Promise<boolean> {
  try {
    // Get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitationLink')
      .select('profile')
      .eq('id', invitationId)
      .single();

    if (invitationError || !invitation) {
      console.error("Error obtaining the invitation:", invitationError);
      return false;
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from('Users')
      .select('my_profiles')
      .eq('email', email);

    if (profileError) {
      console.error("Error getting existing profiles:", profileError);
      return false;
    }

    if (existingProfile && existingProfile.length > 0) {
      const profileExists = existingProfile.includes(invitation.profile);
      if (profileExists) {
        console.error("The profile already exists for this user");
        return false;
      }
    }

    await addSharedUsers(invitation.profile, [email]);

    // Delete the invitation after using it
    // Delete the invitation from the database after using it
    // await supabase
    //   .from('invitationLink')
    //   .delete()
    //   .eq('id', invitationId);

    return true;
  } catch (error) {
    console.error("Unexpected error processing the invitation:", error);
    return false;
  }
}