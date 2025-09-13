'use client';

import { useState, useEffect } from 'react';
import MapWrapper from './components/MapWrapper';
import { BusData, BusLine } from './types';

export default function Home() {
  const [busData, setBusData] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<number>(1);

  useEffect(() => {
    fetchBusData();
    const interval = setInterval(fetchBusData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBusData = async () => {
    try {
      const res = await fetch('/api/transportation');
      const data: BusData = await res.json();
      setBusData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!busData) return <div className="p-10 text-center">No data available</div>;

  // ترتيب الباصات حسب الـ id لضمان الترتيب من اليسار لليمين
  const sortedBuses = busData.bus_lines.slice(0, 8).sort((a, b) => a.id - b.id);
  const selectedBusData: BusLine | undefined = busData.bus_lines.find(b => b.id === selectedBus);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <main className="container mx-auto mt-6">

        {/* Bus Map Section */}
        <section className="bg-yellow-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-center mb-4">Active Bus Map</h2>
          <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-4">
            {sortedBuses.map((b, index) => (
              <button
                key={b.id}
                onClick={() => setSelectedBus(b.id)}
                className={`py-2 px-3 rounded text-sm font-semibold transition-colors duration-200 ${
                  selectedBus === b.id ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {`Bus ${index + 1}`}
              </button>
            ))}
          </div>
          {selectedBusData && <MapWrapper bus={selectedBusData} />}
        </section>

        {/* Bus Schedule Section */}
        <section className="bg-yellow-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-center mb-4">Bus Schedule</h2>
          <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-4">
            {sortedBuses.map((b, index) => (
              <button
                key={b.id}
                onClick={() => setSelectedBus(b.id)}
                className={`py-2 px-3 rounded text-sm font-semibold transition-colors duration-200 ${
                  selectedBus === b.id ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {`Bus ${index + 1}`}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-orange-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Bus Stop</th>
                  <th className="py-3 px-6 text-left">Next Time of Arrival</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {selectedBusData?.bus_stops.map(stop => (
                  <tr key={stop.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{stop.name}</td>
                    <td className="py-3 px-6 text-left">{stop.estimated_arrival}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
