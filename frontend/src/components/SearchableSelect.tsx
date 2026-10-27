'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Loader2 } from 'lucide-react';

export interface SearchableSelectOption {
  value: number | string;
  label: string;
  subLabel?: string;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  value: number | string;
  onChange: (value: any) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onSearchChange?: (query: string) => void;
  emptyText?: string;
  className?: string;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn một mục...',
  searchPlaceholder = 'Tìm kiếm...',
  disabled = false,
  loading = false,
  onSearchChange,
  emptyText = 'Không tìm thấy kết quả phù hợp',
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
      if (onSearchChange) onSearchChange('');
    }
  }, [isOpen]);

  // Handle search change
  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value],
  );

  // Filter options locally for instant responsiveness
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label?.toLowerCase().includes(q);
      const matchSub = opt.subLabel?.toLowerCase().includes(q);
      const matchBadge = opt.badge?.toLowerCase().includes(q);
      const matchVal = String(opt.value).toLowerCase().includes(q);
      return matchLabel || matchSub || matchBadge || matchVal;
    });
  }, [options, searchTerm]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40'
            : 'hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center space-x-2 truncate mr-2">
          {selectedOption ? (
            <>
              {selectedOption.badge && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0 ${
                    selectedOption.badgeColor ||
                    'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
              <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
                {selectedOption.label}
              </span>
              {selectedOption.subLabel && (
                <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate hidden sm:inline">
                  {selectedOption.subLabel}
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 text-slate-400">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          {/* Search Box inside Dropdown */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/60 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        onChange(opt.value);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full p-2.5 text-left text-xs transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold'
                        : opt.disabled
                          ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate mr-2">
                      {opt.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0 ${
                            opt.badgeColor ||
                            'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      <div className="truncate">
                        <span className="font-semibold block truncate">{opt.label}</span>
                        {opt.subLabel && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block truncate">
                            {opt.subLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
