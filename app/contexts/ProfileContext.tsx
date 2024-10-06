import React, { createContext, useState, useContext, useCallback } from 'react';

type ProfileContextType = {
  currentProfileId: string | null;
  setCurrentProfileId: (id: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const memoizedSetCurrentProfileId = useCallback((id: string | null) => {
    setCurrentProfileId(id);
  }, []);

  return (
    <ProfileContext.Provider value={{ currentProfileId, setCurrentProfileId: memoizedSetCurrentProfileId }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};