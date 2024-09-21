import { useState, useEffect, useCallback } from 'react';
import { fetchIncomes, fetchOutcomes, fetchBalance, fetchCategories, IncomeData, OutcomeData, CategoryData } from '../api/api';

export function useProfileData(profileId: string) {
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  
  const getIncomeData = useCallback(async () => {
    if (profileId) {
      const data = await fetchIncomes(profileId);
        setIncomeData(data);
      }
    }, [profileId]);
  
  const getOutcomeData = useCallback(async () => {
    if (profileId) {
      const data = await fetchOutcomes(profileId);
      setOutcomeData(data);
    }
  }, [profileId]);
  
  const getCategoryData = useCallback(async () => {
    if (profileId) {
      const data = await fetchCategories(profileId);
      setCategoryData(data);
      }
    }, [profileId]);
  
  const getBalanceData = useCallback(async () => {
    if (profileId) {
      const data = await fetchBalance(profileId);
      setBalance(data);
      }
    }, [profileId]);
  
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