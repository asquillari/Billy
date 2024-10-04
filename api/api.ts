import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INCOMES_TABLE = 'Incomes';
const OUTCOMES_TABLE = 'Outcomes';
const CATEGORIES_TABLE = 'Categories';
const PROFILES_TABLE = 'Profiles';
const USERS_TABLE = 'Users';

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
  added_by?: string;
  created_at?: Date;
}

export interface OutcomeData {
  id? : string;
  profile: string;
  category: string; 
  amount: number;
  description: string;
  added_by?: string;
  to_pay?: string[];
  has_paid?: boolean[];
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
      added_by: undefined 
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

export async function addOutcome(profile: string, category: string, amount: number, description: string, created_at?: Date): Promise<OutcomeData[] | null> {
  try {
    if (category === "" || !(await checkCategoryLimit(category, amount))) {
      console.log("Couldn't add due to category limit or missing category");
      return null;
    }

    const newOutcome: OutcomeData = { 
      profile: profile, 
      amount: amount, 
      category: category, 
      description: description, 
      created_at: created_at, 
      added_by: undefined, 
      has_paid: undefined, 
      to_pay: undefined 
    };
    const [{ data: insertData, error: insertError }] = await Promise.all([
      supabase.from(OUTCOMES_TABLE).insert(newOutcome).select(),
      updateBalance(profile, -amount),
      updateCategorySpent(category, amount)
    ]);

    if (insertError) {
      console.error("Error adding outcome:", insertError);
      return null;
    }

    return insertData;
  } 

  catch (error) {
    console.error("Unexpected error adding outcome:", error);
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
  updateData(PROFILES_TABLE, 'is_shared', true, 'id', profileId);
  for (const email of emails) {
    const { error: userError } = await supabase.rpc('append_to_my_profiles', { user_email: email, new_profile_id: profileId });
    if (userError) console.error(`Failed to share profile with ${email}:`, userError);
    const { error: profileError } = await supabase.rpc('append_user_to_profile', { profile_id: profileId, new_user: email });
    if (profileError) console.error(`Failed to add ${email} to profile ${profileId}:`, profileError);
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
export async function addGroupOutcome(profile: string, category: string, amount: number, description: string, created_at?: Date, added_by?: string, to_pay?: string[], has_paid?: boolean[]): Promise<OutcomeData[] | null> {
  try {
    if (category === "" || !(await checkCategoryLimit(category, amount))) {
      console.log("Couldn't add due to category limit or missing category");
      return null;
    }

    const newOutcome: OutcomeData = { profile: profile, amount: amount, category: category, description: description, created_at: created_at, to_pay: to_pay, has_paid: has_paid, added_by: added_by };

    const [{ data: insertData, error: insertError }] = await Promise.all([
      supabase.from(OUTCOMES_TABLE).insert(newOutcome).select(),
      updateBalance(profile, -amount),
      updateCategorySpent(category, amount)
    ]);

    if (insertError) {
      console.error("Error adding outcome:", insertError);
      return null;
    }

    return insertData;
  } catch (error) {
    console.error("Unexpected error adding outcome:", error);
    return null;
  }

}

export async function addGroupIncome(profile: string, category: string, amount: number, description: string, created_at?: Date, added_by?: string): Promise<IncomeData[] | null> {
  try {
    const newIncome: IncomeData = { profile: profile, amount: amount, description: description, created_at: created_at, added_by: added_by };

    const [{ data: insertData, error: insertError }] = await Promise.all([
      supabase.from(INCOMES_TABLE).insert(newIncome).select(),
      updateBalance(profile, amount)
    ]);

    if (insertError) {
      console.error("Error adding income:", insertError);
      return null;
    }

    return insertData;
  } catch (error) {
    console.error("Unexpected error adding income:", error);
    return null;
  }

}