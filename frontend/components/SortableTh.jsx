import React from 'react';

// Clickable table header that toggles asc/desc sort.
export default function SortableTh({ label, field, sortBy, sortOrder, onSort }) {
  const active = sortBy === field;
  return (
    <th className={`sortable ${active ? 'active' : ''}`} onClick={() => onSort(field)}>
      {label} {active ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
    </th>
  );
}
