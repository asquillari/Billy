import React, { createContext, useState, useContext, useCallback } from 'react';
import { fetchIncomes, fetchOutcomes, IncomeData, OutcomeData } from '@/api/api';
import { useProfile } from './ProfileContext';

type TransactionContextType = {
  incomeData: IncomeData[] | null;
  outcomeData: OutcomeData[] | null;
  refreshTransactions: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentProfileId } = useProfile();
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[] | null>(null);

  const refreshTransactions = useCallback(async () => {
    const incomes = await fetchIncomes(currentProfileId || "");
    const outcomes = await fetchOutcomes(currentProfileId || "");
    setIncomeData(incomes);
    setOutcomeData(outcomes);
  }, []);

  return (
    <TransactionContext.Provider value={{ incomeData, outcomeData, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};