'use client';

import React from 'react';

type StatusFilter = 'All' | 'Active' | 'Maintenance' | 'Out of Service';

interface HeaderProps {
  statusFilter?: StatusFilter;
  onlyHighLoad?: boolean;
  onStatusChange?: (value: StatusFilter) => void;
  onHighLoadChange?: (value: boolean) => void;
}

const noop = () => {};

export default function Header({
  statusFilter = 'All',
  onlyHighLoad = false,
  onStatusChange = noop,
  onHighLoadChange = noop,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-b-4 border-indigo-600 shadow-md">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-3">
    {/* Brand */}
<div className="flex items-center gap-3">
  <img 
    src="/amana_bootcamp_logo.jpeg" 
    alt="Amana Bootcamp Logo" 
    className="h-8 w-8 rounded-lg object-cover" 
  />
  <h1 className="text-lg font-semibold">Amana Transportation</h1>
</div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-sm">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="rounded-md border border-indigo-300 bg-white/90 text-gray-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={onlyHighLoad}
              onChange={(e) => onHighLoadChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-white"
            />
            Show high-load (≥ 80%)
          </label>
        </div>
      </div>
    </header>
  );
}
