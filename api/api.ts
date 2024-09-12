import { supabase } from '../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface UserData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface IncomeData {
  id?: number;
  profile: string;
  amount: number;
  description: string;
  created_at?: Timestamp;
}

export interface OutcomeData {
  id? : number;
  profile: string;
  category: string; 
  amount: number;
  description: string;
  created_at?: Timestamp;
}

export interface CategoryData {
  id?: string
  name: string;
  profile: string;
  spent? : number;
  limit?: number;
  color: string;
  created_at?: Timestamp;
}

export interface ProfileData {
  name: string;
  balance?: number;
  created_at?: Timestamp;
}

/* Incomes */

export async function fetchIncomes(profile: string) {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select()
    .match({profile});
  return data;
};
 
export async function getIncome(profile: string, id: number | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select('*')
    .match({id, profile})
    .single();
  return data;
};

export async function addIncome(profile: string, amount: number, description: string) : Promise<IncomeData[] | null> {
  const newIncome: IncomeData = {
    profile: profile,
    amount: amount,
    description: description
  };
  // Inserto información  
  const { data } = await supabase
    .from('Incomes')
    .insert(newIncome)
  updateBalance(profile, amount);
  return data;
};

export async function removeIncome(profile: string, id: number | undefined) {
  const income = await getIncome(profile, id);
  const amount = income?.amount;
  // Borro información
  await supabase
    .from('Incomes')
    .delete()
    .match({id, profile});
  await updateBalance(profile, -amount)
}



/* Outcomes */

export async function fetchOutcomes(profile: string) {
  // Recupero información
  const { data } = await supabase
    .from('Outcomes')
    .select('*')
    .match({profile});
  return data;
};

export async function fetchOutcomesByCategory(profile: string, category: string) {
  // Recupero información
  const { data } = await supabase
    .from('Outcomes')
    .select('*')
    .eq('profile', profile)
    .eq('category', category);
  return data;
};

export async function getOutcome(profile: string, id: number | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Outcomes')
    .select()
    .match({id, profile})
    .single();  
  return data;
};

export async function addOutcome(profile: string, category: string, amount: number, description: string) {
  const newOutcome: OutcomeData = {
    profile: profile,
    amount: amount,
    category: category,
    description: description
  };
  if (await checkCategoryLimit(category, amount) == false) {
    console.log("couldnt add due to category limit");
    return;
  }
  // Inserto información
  const { data } = await supabase
    .from('Outcomes')
    .insert(newOutcome);
  updateBalance(profile, -amount);
  updateCategorySpent(category, amount);
  return data;
};

export async function removeOutcome(profile: string, id: number | undefined) {
  const outcome = await getOutcome(profile, id);
  const amount = outcome?.amount;
  const category = outcome?.category;
  // Borro información
  await supabase
    .from('Outcomes')
    .delete()
    .match({id, profile});
  await updateBalance(profile, amount);
  await updateCategorySpent(category, -amount);
}



/* Categories */

export async function fetchCategories(profile: string) {
  // Recupero información
  const { data } = await supabase
    .from('Categories')
    .select('*')
    .eq('profile', profile);
  return data;
};

export async function getCategory(profile: string, category: string | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Categories')
    .select()
    .eq('id', category)
    .eq('profile', profile);
  return data;
};

export async function addCategory(profile: string, name: string, color: string, limit?: number) {
    const newCategory: CategoryData = {
      profile: profile,
      name: name,
      limit: limit,
      color: color
    };
    const { data } = await supabase
      .from('Categories')
      .insert(newCategory);
    return data;
}

export async function removeCategory(profile: string, category: string | undefined) {
    // Borro información
    await supabase
      .from('Categories')
      .delete()
      .eq('id', category)
      .eq('profile', profile);
}

export async function getCategoryFromOutcome(outcome: number) {
  const { data } = await supabase
      .from('Expenses')
      .select('category')
      .eq('id', outcome)
      .single();
  return data?.category ?? "null";
}

async function getCategoryLimit(category: string): Promise<number> {
  const { data } = await supabase
    .from('Categories')
    .select('limit')
    .eq('id', category)
    .single();
  return data?.limit ?? 0;
}

async function getCategorySpent(category: string): Promise<number> {
  const { data } = await supabase
    .from('Categories')
    .select('spent')
    .eq('id', category)
    .single();
  return data?.spent ?? 0;
}

async function updateCategorySpent(category: string, added: number) {
  var currentSpent = await getCategorySpent(category);
  const newSpent = currentSpent + added;
  await putCategorySpent(category, newSpent);
}

async function putCategorySpent(category: string, newSpent: number) {
  const { data } = await supabase
    .from('Categories')
    .update({spent: newSpent})
    .match({id: category}); 
  return data;
}

async function checkCategoryLimit(category: string, amount: number) {
  const limit = await getCategoryLimit(category);
  if (limit <= 0) return true;
  const spent = await getCategorySpent(category);
  return (spent + amount <= limit);
}



/* Profiles */

export async function fetchProfiles() {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select('*');
  return data;
};

export async function getProfile(name: string | undefined): Promise<string[] | null> {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select()
    .eq('name', name)
  return data;
};

export async function addProfile(name: string) {
  const newProfile: ProfileData = {
    name: name,
  };
  // Inserto información
  const { data } = await supabase
    .from('Profiles')
    .insert(newProfile);
  return data;
};

export async function removeProfile(name: string | undefined) {
    // Borro información
    await supabase
      .from('Profiles')
      .delete()
      .match({name});
}

export async function getProfileID(profileName: string) {
  const { data } = await supabase
    .from('Profiles')
    .select()
    .match({profileName});
return data;
}


/* Balance */

export async function getBalance(profile: string): Promise<number> {
  const { data } = await supabase
    .from('Profiles')
    .select('balance')
    .eq('id', profile)
    .single();
  return data?.balance ?? 0;
}

// Update the balance based on an added or subtracted value
async function updateBalance(profile: string, added: number) {
  // Calls atomic function to avoid the infamous race condition
  const { data } = await supabase.rpc('update_balance', { 
    profile_id: profile, 
    amount: added 
  });
  return data;
}



/* User */

// Agregar usuario
export async function addUser(email: string, password: string, name: string, surname: string) {
  const newUser: UserData = {
    email: email,
    password: password,
    name: name,
    surname: surname,
  };
  const { data, error } = await supabase
    .from('Users')
    .insert(newUser);

  if (error) {
    console.error('Error adding user:', error);
    return null;
  }
  return data;
}

//Sign Up
export async function signUp(email: string, password: string, name: string, surname: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });
  if (error) {
    console.log(error);
    return error;
  } else {
    const { user, session } = data;
    await addUser(email, password, name, surname);
    return user;
  }
}

//Login 
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.log(error);
    return error;
  } else {
    const { user, session } = data;
    return user;
  }
}