'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import MapWrapper from './components/MapWrapper';
import Header from './components/Header';
import type { BusData, BusLine } from './types';

export default function Home() {
  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Maintenance' | 'Out of Service'>('All');
  const [onlyHighLoad, setOnlyHighLoad] = useState(false); // utilization ≥ 80%

  // Data / UI state
  const [busData, setBusData] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<number>(1);

  // Extras
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function fetchBusData() {
    try {
      setError(null);
      const res = await fetch('/api/transportation/route', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BusData = await res.json();
      setBusData(data);

      // keep selection valid
      if (data?.bus_lines?.length && !data.bus_lines.find((b) => b.id === selectedBus)) {
        setSelectedBus(data.bus_lines[0].id);
      }
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBusData();
  }, []);

  // auto-refresh
  useEffect(() => {
    if (!autoRefresh) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(fetchBusData, 45_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh]);

  // ---------- derived lists ----------
  const baseSorted = useMemo<BusLine[]>(
    () => (busData?.bus_lines ?? []).slice().sort((a, b) => a.id - b.id),
    [busData]
  );

  const filteredBuses = useMemo<BusLine[]>(
    () =>
      baseSorted
        .filter((l) => (statusFilter === 'All' ? true : l.status === statusFilter))
        .filter((l) => (onlyHighLoad ? (l.passengers?.utilization_percentage ?? 0) >= 80 : true))
        .slice(0, 8),
    [baseSorted, statusFilter, onlyHighLoad]
  );

  // keep a valid selected line when filters change
  useEffect(() => {
    if (!filteredBuses.length) return;
    if (!filteredBuses.find((b) => b.id === selectedBus)) {
      setSelectedBus(filteredBuses[0].id);
    }
  }, [filteredBuses, selectedBus]);

  // resolve selected line
  const selectedBusData = useMemo<BusLine | undefined>(() => {
    const list = busData?.bus_lines ?? [];
    return list.find((b) => b.id === selectedBus) ?? filteredBuses[0];
  }, [busData, selectedBus, filteredBuses]);

  // infer “next” stop
  const nextStopId = useMemo<number | null>(() => {
    const stops = selectedBusData?.bus_stops ?? [];
    if (!stops.length) return null;
    return (
      stops
        .slice()
        .sort((a, b) => a.estimated_arrival.localeCompare(b.estimated_arrival))[0]?.id ?? null
    );
  }, [selectedBusData]);

  // ---------- loading / empty ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header
          statusFilter={statusFilter}
          onlyHighLoad={onlyHighLoad}
          onStatusChange={setStatusFilter}
          onHighLoadChange={setOnlyHighLoad}
        />
        <main className="container mx-auto mt-6 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-56 rounded bg-gray-200" />
            <div className="h-80 rounded bg-gray-200" />
            <div className="h-10 w-56 rounded bg-gray-200 mt-8" />
            <div className="h-64 rounded bg-gray-200" />
          </div>
        </main>
      </div>
    );
  }

  if (!busData || busData.bus_lines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header
          statusFilter={statusFilter}
          onlyHighLoad={onlyHighLoad}
          onStatusChange={setStatusFilter}
          onHighLoadChange={setOnlyHighLoad}
        />
        <main className="container mx-auto mt-6 p-6 text-center text-gray-700">
          {error ? `Error: ${error}` : 'No data available'}
        </main>
      </div>
    );
  }

  // ---------- main ----------
  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        statusFilter={statusFilter}
        onlyHighLoad={onlyHighLoad}
        onStatusChange={setStatusFilter}
        onHighLoadChange={setOnlyHighLoad}
      />

      <main className="container mx-auto mt-6 p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className={`rounded-lg px-4 py-2 font-medium shadow-md transition ${
              autoRefresh
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {autoRefresh ? 'Auto-Refresh: On' : 'Auto-Refresh: Off'}
          </button>

          <button
            onClick={fetchBusData}
            className="rounded-lg px-4 py-2 font-medium shadow-md transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Refresh now
          </button>

          <span className="opacity-70">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : '—'}
          </span>

          {error && <span className="text-red-600">• {error}</span>}
        </div>

        {/* Active Bus Map */}
        <section className="p-4 rounded-lg shadow-md mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-t-4 border-indigo-600">
          <h2 className="text-xl font-bold text-center mb-4">Active Bus Map</h2>

          {/* Route buttons */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-4">
            {filteredBuses.map((b, index) => {
              const label = b.route ? b.route : `Bus ${index + 1}`;
              const active = selectedBus === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBus(b.id)}
                  className={`py-2 px-3 rounded text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  title={b.name}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {selectedBusData && <MapWrapper bus={selectedBusData} />}
        </section>

        {/* Bus Schedule */}
        <section className="p-4 rounded-lg shadow-md mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-t-4 border-indigo-600">
          <h2 className="text-xl font-bold text-center mb-4">Bus Schedule</h2>

          {/* Repeat buttons */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-4">
            {filteredBuses.map((b, index) => {
              const label = b.route ? b.route : `Bus ${index + 1}`;
              const active = selectedBus === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBus(b.id)}
                  className={`py-2 px-3 rounded text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  title={b.name}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-orange-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Bus Stop</th>
                  <th className="py-3 px-6 text-left">Next Time of Arrival</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {selectedBusData?.bus_stops?.map((stop) => (
                  <tr
                    key={stop.id}
                    className={`border-b border-gray-200 hover:bg-gray-100 ${
                      nextStopId === stop.id ? 'bg-amber-100' : ''
                    }`}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">{stop.name}</td>
                    <td className="py-3 px-6 text-left">{stop.estimated_arrival}</td>
                  </tr>
                ))}
                {!selectedBusData?.bus_stops?.length && (
                  <tr>
                    <td className="py-4 px-6 text-center text-gray-500" colSpan={2}>
                      No stops for this route.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
