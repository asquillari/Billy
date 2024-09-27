import React, { createContext, useState, useContext } from 'react';

type ProfileContextType = {
  currentProfileId: string | null;
  setCurrentProfileId: (id: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ currentProfileId, setCurrentProfileId }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};