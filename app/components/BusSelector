interface BusSelectorProps {
  busLines: { id: number; name: string }[];
  selectedBus: number;
  onSelect: (id: number) => void;
}

export default function BusSelector({ busLines, selectedBus, onSelect }: BusSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {busLines.map(b => (
        <button
          key={b.id}
          onClick={() => onSelect(b.id)}
          className={`py-2 px-3 rounded text-sm font-semibold transition-colors duration-200 ${
            selectedBus === b.id ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}
