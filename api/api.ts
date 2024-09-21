import { supabase } from '../lib/supabase';
import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import bcrypt from 'react-native-bcrypt';

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
  id?: string;
  name: string;
  balance?: number;
  created_at?: Timestamp;
  user: string;
}



/* Incomes */

export async function fetchIncomes(profile: string) {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select()
    .eq('profile', profile)
  return data;
};

export async function getIncome(profile: string, id: number | undefined) {
  // Recupero información
  const { data } = await supabase
    .from('Incomes')
    .select('*')
    .eq('id', id)
    .eq('profile', profile)
    .single();
  return data;
};

export async function addIncome(profile: string, amount: number, description: string) : Promise<IncomeData[] | null> {
  const newIncome: IncomeData = {
    profile: profile,
    amount: amount,
    description: description
  };
  const [insertResult] = await Promise.all([
    supabase.from('Incomes').insert(newIncome).select(),
    updateBalance(profile, amount)
  ]);
  return insertResult.data;
};

export async function removeIncome(profile: string, id: number | undefined) {
  const income = await getIncome(profile, id);
  // Borro información
  const [deleteResult] = await Promise.all([
    supabase.from('Incomes').delete().eq('profile', profile).eq('id', id),
    updateBalance(profile, -income.amount)
  ]);
  return deleteResult;
}



/* Outcomes */

export async function fetchOutcomes(profile: string) {
  // Recupero información
  const { data } = await supabase
    .from('Outcomes')
    .select('*')
    .eq('profile', profile)
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
    .eq('id', id)
    .eq('profile', profile)
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
    console.log("Couldn't add due to category limit");
    return;
  }
  if (category == "") {
    console.log("Category missing");
    return;
  }
  const [insertResult] = await Promise.all([
    checkCategoryLimit(category, amount),
    supabase.from('Outcomes').insert(newOutcome).select(),
    updateBalance(profile, -amount),
    updateCategorySpent(category, amount)
  ]);
  return insertResult;
};

export async function removeOutcome(profile: string, id: number | undefined) {
  const outcome = await getOutcome(profile, id);
  // Borro información
  const [deleteResult] = await Promise.all([
    supabase.from('Outcomes').delete().eq('profile', profile).eq('id', id),
    updateBalance(profile, outcome.amount),
    updateCategorySpent(outcome.category, -outcome.amount)
  ]);
  return deleteResult;
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
    .eq('profile', profile)
    .single();
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
      .eq('profile', profile)
      .single();
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
    .eq('id', category)
    .single();
  return data;
}

async function checkCategoryLimit(category: string, amount: number) {
  const limit = await getCategoryLimit(category);
  if (limit <= 0) return true;
  const spent = await getCategorySpent(category);
  return (spent + amount <= limit);
}



/* Profiles */

export async function fetchProfiles(user: string) {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select('*')
    .eq('user', user);
  return data;
};

export async function getProfile(id: string | undefined): Promise<string[] | null> {
  // Recupero información
  const { data } = await supabase
    .from('Profiles')
    .select()
    .eq('id', id)
  return data;
};

export async function addProfile(name: string, user: string) {
  const newProfile: ProfileData = {
    name: name,
    user: user
  };

  // Inserto información
  const { data, error } = await supabase
    .from('Profiles')
    .insert(newProfile);

  if (error) {
    console.error('Error al agregar el perfil:', error);
    return error;
  } else {
    console.log('Perfil agregado exitosamente:', data);
    return data;
  }
};

export async function removeProfile(id: string | undefined) {
    // Borro información
    await supabase
      .from('Profiles')
      .delete()
      .eq('id', id);
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

//Hasheo de contraseña
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      hash ? resolve(hash) : reject('Error hashing password');
    });
  });
}

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
  const hashedPassword = await hashPassword(password);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: hashedPassword
  });
  if (error) {
    console.log(error);
    return error;
  } else {
    const { user, session } = data;
    await addUser(email, hashedPassword, name, surname);
    return user;
  }
}

//Login 
export async function logIn(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: hashedPassword
  });

  if (error) {
    console.log(error);
    return error;
  } else {
    const { user, session } = data;
    return user;
  }
}

export async function changeCurrentProfile(user: string, newProfileID: string) {
  await supabase
    .from('Users')
    .update({current_profile: newProfileID})
    .eq('email', user)
    .single();
}

export async function fetchCurrentProfile(user: string) {
  const { data } = await supabase
    .from('Users')
    .select('current_profile')
    .eq('email', user)
    .single();
  return data;
}

/* Stats */

// Get outcomes from date range
export async function getOutcomesFromDateRange(profile: string, start: Date, end: Date) {
  const startISO = start.toISOString();  // Formato YYYY-MM-DDTHH:mm:ss.sssZ
  const endISO = end.toISOString();

  const { data } = await supabase
    .from('Outcomes')
    .select()
    .eq('profile', profile)
    .gte('created_at', startISO)
    .lte('created_at', endISO);
  return data;
}

// Get outcomes from date range and category
export async function getOutcomesFromDateRangeAndCategory(profile: string, start: Date, end: Date, category: string) {
  const dateData = await getOutcomesFromDateRange(profile, start, end);
  const categoryData = await fetchOutcomesByCategory(profile, category);
  return categoryData;
}