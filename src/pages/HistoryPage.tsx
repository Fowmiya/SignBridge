import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TranslationRecord, InputMode } from '../types';
import { speechSynthesisService } from '../services/speechSynthesisService';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Copy,
  Volume2,
  Eye,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  FileDown,
} from 'lucide-react';
import { SignAvatarViewer } from '../components/common/SignAvatarViewer';

export const HistoryPage: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, showToast, signLang } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesQuery =
      item.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'all') return matchesQuery;
    if (filterType === 'sign') return matchesQuery && item.inputType === 'sign-camera';
    if (filterType === 'video') return matchesQuery && item.inputType === 'sign-video';
    if (filterType === 'speech') return matchesQuery && item.inputType === 'speech';
    if (filterType === 'text') return matchesQuery && item.inputType === 'text';

    return matchesQuery;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const handleSpeak = (text: string) => {
    speechSynthesisService.speak(text);
    showToast('Playing audio translation', 'info');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `signbridge-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported history as JSON', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="history-page-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <HistoryIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Translation History
          </h1>
          <p className="text-sm text-slate-600">
            Browse, search, replay, and manage your local translation records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <FileDown className="w-4 h-4 text-teal-600" />
            <span>Export Data</span>
          </button>

          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search translation text, phrases, or dates..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Modalities' },
            { id: 'sign', label: '📷 Camera' },
            { id: 'video', label: '🎥 Video' },
            { id: 'speech', label: '🎤 Speech' },
            { id: 'text', label: '⌨️ Text' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List or Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'No translations match your search criteria.' : 'Your translation history is currently empty.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top Row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-teal-800 border border-slate-200">
                    {item.inputType.replace('-', ' ')}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">
                    Translated Text
                  </span>
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {item.translatedText}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">
                    Source
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.sourceText}
                  </p>
                </div>

                {item.notes && (
                  <div className="text-[11px] text-teal-700 bg-teal-50/60 p-2 rounded-xl border border-teal-100">
                    {item.notes}
                  </div>
                )}
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(item.translatedText)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                    title="Speak translation"
                    aria-label="Speak translation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.translatedText)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                    title="Copy translation"
                    aria-label="Copy translation"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedRecord(item)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                    title="View details"
                    aria-label="View translation details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete record"
                  aria-label="Delete history item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Translation Detail</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Original Input</span>
                <p className="font-semibold text-slate-900">{selectedRecord.sourceText}</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                <span className="font-bold text-teal-700 uppercase text-[10px]">Translated Output</span>
                <p className="font-bold text-teal-950 text-base">{selectedRecord.translatedText}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Confidence</span>
                  <span className="font-bold text-slate-800">{Math.round(selectedRecord.confidence * 100)}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Input Channel</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedRecord.inputType}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
