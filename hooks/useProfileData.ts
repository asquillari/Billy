import { useState, useEffect, useCallback } from 'react';
import { fetchIncomes, fetchOutcomes, fetchBalance, fetchCategories, IncomeData, OutcomeData, CategoryData } from '../api/api';

export function useProfileData(profileId: string) {
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  
  const fetchData = useCallback(async (fetchFunction: (id: string) => Promise<any>, setStateFunction: React.Dispatch<React.SetStateAction<any>>) => {
    if (profileId) {
      const data = await fetchFunction(profileId);
      setStateFunction(data);
    }
  }, [profileId]);

  const getIncomeData = useCallback(() => fetchData(fetchIncomes, setIncomeData), [fetchData]);
  const getOutcomeData = useCallback(() => fetchData(fetchOutcomes, setOutcomeData), [fetchData]);
  const getCategoryData = useCallback(() => fetchData(fetchCategories, setCategoryData), [fetchData]);
  const getBalanceData = useCallback(() => fetchData(fetchBalance, setBalance), [fetchData]);
  
  const refreshAllData = useCallback(() => {
    getIncomeData();
    getOutcomeData();
    getCategoryData();
    getBalanceData();
  }, [getIncomeData, getOutcomeData, getCategoryData, getBalanceData]);
  
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);
  
  return {
    incomeData,
    outcomeData,
    categoryData,
    balance,
    getIncomeData,
    getOutcomeData,
    getCategoryData,
    getBalanceData,
    refreshAllData
  };
};

export default useProfileData;