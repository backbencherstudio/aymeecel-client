'use client';

import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormLanguage } from '@/context/FormLanguageContext';

interface Language {
  code: string;
  label: string;
  value: string;
}

const languages: Language[] = [
  { code: 'en', label: 'English', value: 'EN' },
  { code: 'de', label: 'Deutsch', value: 'DE' },
];

export default function FormLangSwitcher() {
  const { formLang, setFormLang } = useFormLanguage();

  const handleLanguageChange = (value: string) => {
    setFormLang(value);
  };

  return (
    <Select value={formLang} onValueChange={handleLanguageChange}>
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