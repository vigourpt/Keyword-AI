import React from 'react';
import { Search, Loader } from 'lucide-react';

interface SearchFormProps {
  keyword: string;
  loading: boolean;
  onKeywordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ keyword, loading, onKeywordChange, onSubmit }: SearchFormProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Keyword Analysis</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;