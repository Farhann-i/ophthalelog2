import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { casesService } from '../../services/cases.service';
import type { Case } from '../../types';

interface Props {
  onSearch: (results: Case[]) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchBar({ onSearch, onLoading }: Props) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchCases = async () => {
      if (debouncedQuery) {
        onLoading(true);
        try {
          const results = await casesService.searchCases(debouncedQuery);
          onSearch(results);
        } catch (err) {
          console.error('Search failed:', err);
          onSearch([]);
        } finally {
          onLoading(false);
        }
      } else {
        onSearch([]);
      }
    };

    searchCases();
  }, [debouncedQuery, onSearch, onLoading]);

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