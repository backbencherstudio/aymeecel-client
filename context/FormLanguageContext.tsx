'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type FormLanguageContextType = {
  formLang: string;
  setFormLang: (lang: string) => void;
};

const FormLanguageContext = createContext<FormLanguageContextType | undefined>(undefined);

export function FormLanguageProvider({ children }: { children: ReactNode }) {
  const [formLang, setFormLang] = useState('en');

  return (
    <FormLanguageContext.Provider value={{ formLang, setFormLang }}>
      {children}
    </FormLanguageContext.Provider>
  );
}

export function useFormLanguage() {
  const context = useContext(FormLanguageContext);
  if (context === undefined) {
    throw new Error('useFormLanguage must be used within a FormLanguageProvider');
  }
  return context;
}