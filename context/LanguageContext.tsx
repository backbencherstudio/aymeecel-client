'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 