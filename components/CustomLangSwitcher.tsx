'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Language {
  code: string;
  label: string;
  value: string;
}

const languages: Language[] = [
  { code: 'en', label: 'English', value: 'EN' },
  { code: 'de', label: 'Deutsch', value: 'DE' },
];

export default function CustomLangSwitcher() {
  const { selectedLang, setSelectedLang } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setSelectedLang(value);
  };

  return (
    <Select value={selectedLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label} ({lang.value})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}