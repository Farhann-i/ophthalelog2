import React from 'react';
import { CaseGrid } from '../cases/CaseGrid';
import { useCaseStore } from '../../hooks/useCases';
import { useDebounce } from '../../hooks/useDebounce';

interface Props {
  query: string;
}

export function SearchResults({ query }: Props) {
  const debouncedQuery = useDebounce(query, 300);
  const searchCases = useCaseStore((state) => state.searchCases);
  const results = React.useMemo(
    () => (debouncedQuery ? searchCases(debouncedQuery) : []),
    [debouncedQuery, searchCases]
  );

  if (!debouncedQuery) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Search Results ({results.length})
      </h2>
      {results.length > 0 ? (
        <CaseGrid cases={results} />
      ) : (
        <p className="text-gray-500 text-center py-8">No cases found matching "{debouncedQuery}"</p>
      )}
    </div>
  );
}