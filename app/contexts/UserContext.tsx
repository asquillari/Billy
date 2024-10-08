import React, { createContext, useState, useContext, useCallback } from 'react';

type UserContextType = {
  userEmail: string;
  setUserEmail: (email: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  const memoizedSetUserEmail = useCallback((email: string) => {
    setUserEmail(email);
  }, []);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail: memoizedSetUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};
