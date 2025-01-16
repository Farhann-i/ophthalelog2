import React from 'react';
import { CaseCard } from './CaseCard';
import type { Case } from '../../types';

interface Props {
  cases: Case[];
}

export function CaseGrid({ cases }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((case_) => (
        <CaseCard key={case_.id} case_={case_} />
      ))}
    </div>
  );
}