import { supabase } from '../lib/supabase';

export interface UserData {
  email: string;
  password: string;
  name: string;
  surname: string;
  currentProfile?: string;
}

export interface IncomeData {
  id?: number;
  profile: string;
  amount: number;
  description: string;
  created_at?: Date;
}

export interface OutcomeData {
  id? : number;
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



/* Incomes */

export async function fetchIncomes(profile: string): Promise<IncomeData[] | null> {
  try {
    const { data, error } = await supabase
      .from('Incomes')
      .select()
      .eq('profile', profile);

    if (error) {
      console.error("Error fetching incomes:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching incomes:", error);
    return null;
  }
}

export async function getIncome(id: number): Promise<IncomeData | null> {
  try {
    const { data, error } = await supabase
      .from('Incomes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error getting income:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error getting income:", error);
    return null;
  }
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
      supabase.from('Incomes').insert(newIncome).select(),
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

export async function removeIncome(profile: string, id: number) {
  try {
    const income = await getIncome(id);
    
    if (!income) {
      console.error("Income not found:", id);
      return { error: "Income not found." };
    }

    const [deleteResult] = await Promise.all([
      supabase.from('Incomes').delete().eq('id', id),
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
  try {
    const { data, error } = await supabase
      .from('Outcomes')
      .select('*')
      .eq('profile', profile);

    if (error) {
      console.error("Unexpected error fetching outcomes:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching outcomes:", error);
    return null;
  }
};

export async function fetchOutcomesByCategory(category: string): Promise<IncomeData[] | null> {
  try {
    const { data, error } = await supabase
      .from('Outcomes')
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

export async function getOutcome(id: number | undefined): Promise<OutcomeData | null> {
  try {
    const { data, error } = await supabase
      .from('Outcomes')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error getting outcome:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error getting outcome:", error);
    return null;
  }
};

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
      supabase.from('Outcomes').insert(newOutcome).select(),
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

export async function removeOutcome(profile: string, id: number) {
  try {
    const outcome = await getOutcome(id);
    
    if (!outcome) {
      console.error("Outcome not found:", id);
      return { error: "Outcome not found." };
    }

    const [deleteResult] = await Promise.all([
      supabase.from('Outcomes').delete().eq('id', id),
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



/* Categories */

export async function fetchCategories(profile: string): Promise<CategoryData[] | null> {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .select('*')
      .eq('profile', profile);
    
      if (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return null;
  }
};

export async function getCategory(category: string | undefined): Promise<CategoryData | null> {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .select()
      .eq('id', category)
      .single();
    
    if (error) {
      console.error("Error getting category:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error getting category:", error);
    return null;
  }
};


export async function addCategory(profile: string, name: string, color: string, limit?: number): Promise<CategoryData | null> {
  const newCategory: CategoryData = {
    profile: profile,
    name: name,
    limit: limit,
    color: color
  };

  try {
    const { data, error } = await supabase
      .from('Categories')
      .insert(newCategory);
    
      if (error) {
      console.error("Error adding category:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error adding category:", error);
    return null;
  }
}

export async function removeCategory(category: string | undefined) {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .delete()
      .eq('id', category)
      .single();
    
    if (error) {
      console.error("Error removing category:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error removing category:", error);
    return null;
  }
}

export async function getCategoryFromOutcome(outcome: number): Promise<CategoryData | null> {
  try {
    const { data, error } = await supabase
      .from('Outcomes')
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
  try {
    const { data, error } = await supabase
      .from('Categories')
      .select('limit')
      .eq('id', category)
      .single();
    
    if (error) {
      console.error("Error getting category limit:", error);
      return null;
    }
    
    return data.limit ?? 0;
  } 
  
  catch (error) {
    console.error("Unexpected error getting category limit:", error);
    return 0;
  }
}

async function getCategorySpent(category: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .select('spent')
      .eq('id', category)
      .single();
    
    if (error) {
      console.error("Error getting category spent:", error);
      return null;
    }
    
    return data.spent ?? 0;
  } 
  
  catch (error) {
    console.error("Unexpected error getting category spent:", error);
    return null;
  }
}

async function updateCategorySpent(category: string, added: number): Promise<void> {
  try {
    const currentSpent = await getCategorySpent(category);
    const newSpent = currentSpent??0 + added;
    await putCategorySpent(category, newSpent);
  } 
  
  catch (error) {
    console.error("Error updating category spent:", error);
  }
}

async function putCategorySpent(category: string, newSpent: number) {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .update({ spent: newSpent })
      .eq('id', category)
      .single();
    
    if (error) {
      console.error("Error putting category spent:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error putting category spent:", error);
    return null;
  }
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
      .from('Profiles')
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

export async function getProfile(id: string | undefined): Promise<ProfileData[] | null> {
  try {
    const { data, error } = await supabase
      .from('Profiles')
      .select()
      .eq('id', id);
    
    if (error) {
      console.error("Error getting profile:", error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error getting profile:", error);
    return null;
  }
};

export async function addProfile(name: string, user: string): Promise<ProfileData | null> {
  const newProfile: ProfileData = {
    name: name,
    user: user
  };

  try {
    const { data, error } = await supabase
      .from('Profiles')
      .insert(newProfile);
    
    if (error) {
      console.error('Error adding profile:', error);
      return null;
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error adding profile:", error);
    return null;
  }
};

export async function removeProfile(id: string | undefined) {
  try {
    const { data, error } = await supabase
      .from('Profiles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error removing profile:", error);
      return null;
    }

    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error removing profile:", error);
    return null;
  }
}



/* Balance */

export async function fetchBalance(profile: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('Profiles')
      .select('balance')
      .eq('id', profile)
      .single();
    
    if (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
    
    return data.balance ?? 0;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching balance:", error);
    return null;
  }
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
      .from('Users')
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
      .from('Users')
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
      .from('Users')
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
  try {
    const { error } = await supabase
      .from('Users')
      .update({ current_profile: newProfileID })
      .eq('email', user)
      .single();
    
    if (error) {
      console.error("Error changing current profile:", error);
      return { error: "Failed to change current profile." };
    }
  } 
  
  catch (error) {
    console.error("Unexpected error changing current profile:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function fetchCurrentProfile(user: string) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('current_profile')
      .eq('email', user)
      .single();
    
    if (error) {
      console.error("Error fetching current profile:", error);
      return { error: "Failed to fetch current profile." };
    }
    
    return data;
  } 
  
  catch (error) {
    console.error("Unexpected error fetching current profile:", error);
    return { error: "An unexpected error occurred." };
  }
}



/* Stats */

export async function getOutcomesFromDateRange(profile: string, start: Date, end: Date) {
  const startISO = start.toISOString();
  const endISO = end.toISOString();
  
  try {
    const { data, error } = await supabase
      .from('Outcomes')
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
      .from('Outcomes')
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