import React, { useState } from 'react';
import { Search, Loader, Globe, Languages } from 'lucide-react';

interface SearchFormProps {
  keyword: string;
  loading: boolean;
  onKeywordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ keyword, loading, onKeywordChange, onSubmit }: SearchFormProps) => {
  const [location, setLocation] = useState('2840'); // US by default
  const [language, setLanguage] = useState('en'); // English by default

  const locations = [
    { code: '2840', name: 'United States' },
    { code: '2826', name: 'United Kingdom' },
    { code: '2124', name: 'Canada' },
    { code: '2036', name: 'Australia' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Keyword Analysis</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Keyword Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="keyword" className="text-sm font-medium text-gray-700">
            Enter a keyword to analyze
          </label>
          <div className="flex gap-4">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="e.g., digital marketing, web development..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            >
              {locations.map(loc => (
                <option key={loc.code} value={loc.code}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="language" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Languages className="h-4 w-4 text-gray-500" />
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Analyze Keyword</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;