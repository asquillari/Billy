import { supabase } from '../lib/supabase';

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
  user: string;
}

/* General data */

async function fetchData(table: string, profile: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('profile', profile);

    if (error) {
      console.error(`Error transactions data from ${table}:`, error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error(`Unexpected error transactions data from ${table}:`, error);
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
      .insert(newData);
    
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
  return await fetchData(INCOMES_TABLE, profile);
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
      created_at: created_at
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
  return await fetchData(OUTCOMES_TABLE, profile);
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
      created_at: created_at
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
  return await fetchData(CATEGORIES_TABLE, profile);
}

export async function getCategory(category: string): Promise<CategoryData | null> {
  return await getData(CATEGORIES_TABLE, category);
};

export async function addCategory(profile: string, name: string, color: string, limit?: number): Promise<CategoryData | null> {
  const newCategory: CategoryData = {
    profile: profile,
    name: name,
    limit: limit,
    color: color
  };

  return await addData(CATEGORIES_TABLE, newCategory);
}

export async function removeCategory(category: string) {
  return await removeData(CATEGORIES_TABLE, category);
}

export async function getCategoryFromOutcome(outcome: number): Promise<CategoryData | null> {
  try {
    const { data, error } = await supabase
      .from(OUTCOMES_TABLE)
      .select('category')
      .eq('id', outcome)
      .single();
    
    if (error) {
      console.error("Error getting category from outcome:", error);
      return null;
    }

    return data.category;
  } 
  
  catch (error) {
    console.error("Unexpected error getting category from outcome:", error);
    return null;
  }
}

async function getCategoryLimit(category: string): Promise<number | null> {
  return await getValueFromData(CATEGORIES_TABLE, 'limit', 'id', category);
}

async function getCategorySpent(category: string): Promise<number | null> {
  return await getValueFromData(CATEGORIES_TABLE, 'spent', 'id', category);
}

async function updateCategorySpent(category: string, added: number): Promise<void> {
  try {
    const currentSpent = await getCategorySpent(category);
    
    if (currentSpent !== null) {
        const newSpent = currentSpent + added;
        await putCategorySpent(category, newSpent);
    }
  }
  
  catch (error) {
    console.error("Error updating category spent:", error);
  }
}

async function putCategorySpent(category: string, newSpent: number) {
  return await updateData(CATEGORIES_TABLE, 'spent', newSpent, 'id', category);
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
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('user', user);
    
    if (error) {
      console.error("Error fetching profiles:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching profiles:", error);
    return null;
  }
};

export async function getProfile(user: string): Promise<ProfileData[] | null> {
  return await getData(PROFILES_TABLE, user);
};

export async function addProfile(name: string, user: string): Promise<ProfileData | null> {
  const newProfile: ProfileData = {
    name: name,
    user: user
  };

  return await addData(PROFILES_TABLE, newProfile);
};

export async function removeProfile(profile: string) {
  return await removeData(PROFILES_TABLE, profile);
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
  const newUser: UserData = {
    email: email,
    password: password,
    name: name,
    surname: surname,
  };

  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .insert(newUser);

    if (error) {
      console.error('Error adding user:', error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error adding user:", error);
    return null;
  }
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

    return { user, profile, session };
  } 
  
  catch (error) {
    console.error("Unexpected error during login:", error);
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