import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import type { Case } from '../types';

interface Props {
  onSearch: (results: Case[]) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // In a real app, this would be an API call
      const results = mockSearch(debouncedQuery);
      onSearch(results);
    } else {
      onSearch([]);
    }
  }, [debouncedQuery, onSearch]);

  // Mock search function (replace with actual API call)
  const mockSearch = (searchQuery: string) => {
    const lowercaseQuery = searchQuery.toLowerCase();
    return mockCases.filter(
      (case_) =>
        case_.summary.toLowerCase().includes(lowercaseQuery) ||
        case_.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search cases by diagnosis, symptoms, or tags..."
      />
    </div>
  );
}