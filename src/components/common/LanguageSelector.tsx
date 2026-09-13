import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPOKEN_LANGUAGES } from '../../services/translationService';
import { SpokenLanguageCode } from '../../types';
import { Languages, ChevronDown } from 'lucide-react';

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

  const currentLanguage =
    SPOKEN_LANGUAGES.find(lang => lang.code === current) ||
    SPOKEN_LANGUAGES[0];

  const handleChange = (code: SpokenLanguageCode) => {
    if (onSelect) {
      onSelect(code);
    } else {
      setSpokenLang(code);
    }
  };

  return (
    <div className={`relative ${compact ? 'w-[96px]' : 'w-full'}`}>
      {label && (
        <label
          htmlFor={`${idPrefix}-spoken-select`}
          className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <Languages className="w-3.5 h-3.5 text-teal-600" />
          {label}
        </label>
      )}

      <div className="relative">
        {/* Visible Language Display */}
        <div
          className={`pointer-events-none flex flex-col justify-center ${
            compact
              ? 'h-12 px-3 py-1.5'
              : 'min-h-[58px] px-4 py-2.5'
          } bg-white border border-slate-200 rounded-xl`}
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 leading-none">
            <span>Language</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800 leading-none truncate">
            <span>{currentLanguage.flag}</span>
            <span className="truncate">
              {currentLanguage.name}
            </span>
          </div>
        </div>

        {/* Actual Dropdown */}
        <select
          id={`${idPrefix}-spoken-select`}
          value={current}
          onChange={e =>
            handleChange(e.target.value as SpokenLanguageCode)
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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