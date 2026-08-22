import React from 'react';
import { useApp } from '../../context/AppContext';
import { SIGN_LANGUAGES } from '../../services/translationService';
import { SignLanguageCode } from '../../types';
import { Hand, Info } from 'lucide-react';

interface Props {
  selected?: SignLanguageCode;
  onSelect?: (code: SignLanguageCode) => void;
  label?: string;
  compact?: boolean;
  showHelp?: boolean;
  idPrefix?: string;
}

export const SignLanguageSelector: React.FC<Props> = ({
  selected,
  onSelect,
  label,
  compact = false,
  showHelp = false,
  idPrefix = 'sign-lang',
}) => {
  const { signLang, setSignLang } = useApp();
  const current = selected || signLang;

  const handleChange = (code: SignLanguageCode) => {
    if (onSelect) {
      onSelect(code);
    } else {
      setSignLang(code);
    }
  };

  const selectedObj = SIGN_LANGUAGES.find(s => s.code === current);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={`${idPrefix}-select`}
          className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Hand className="w-3.5 h-3.5 text-teal-600" />
          {label}
        </label>
      )}
      <div className="relative inline-block">
        <select
          id={`${idPrefix}-select`}
          value={current}
          onChange={e => handleChange(e.target.value as SignLanguageCode)}
          className={`w-full bg-white border border-slate-200 text-slate-900 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer ${
            compact ? 'py-1.5 pl-3 pr-8 text-xs' : 'py-2.5 pl-4 pr-10 text-sm shadow-xs'
          }`}
          aria-label={label || 'Select sign language'}
        >
          {SIGN_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              🤟 {lang.name} ({lang.code}) — {lang.region}
            </option>
          ))}
        </select>
      </div>
      {showHelp && selectedObj && (
        <div className="flex items-start gap-1.5 mt-1 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
          <span>{selectedObj.description}</span>
        </div>
      )}
    </div>
  );
};
