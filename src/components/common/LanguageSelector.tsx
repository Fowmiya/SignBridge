import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPOKEN_LANGUAGES } from '../../services/translationService';
import { SpokenLanguageCode } from '../../types';
import { Globe } from 'lucide-react';

interface Props {
  selected?: SpokenLanguageCode;
  onSelect?: (code: SpokenLanguageCode) => void;
  label?: string;
  compact?: boolean;
  idPrefix?: string;
}

export const LanguageSelector: React.FC<Props> = ({
  selected,
  onSelect,
  label,
  compact = false,
  idPrefix = 'lang',
}) => {
  const { spokenLang, setSpokenLang } = useApp();
  const current = selected || spokenLang;
  const handleChange = (code: SpokenLanguageCode) => {
    if (onSelect) {
      onSelect(code);
    } else {
      setSpokenLang(code);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={`${idPrefix}-spoken-select`}
          className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-teal-600" />
          {label}
        </label>
      )}
      <div className="relative inline-block">
        <select
          id={`${idPrefix}-spoken-select`}
          value={current}
          onChange={e => handleChange(e.target.value as SpokenLanguageCode)}
          className={`w-full bg-white border border-slate-200 text-slate-900 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer ${
            compact ? 'py-1.5 pl-3 pr-8 text-xs' : 'py-2.5 pl-4 pr-10 text-sm shadow-xs'
          }`}
          aria-label={label || 'Select spoken language'}
        >
          {SPOKEN_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
