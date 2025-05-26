import { useFilter, sortOptions } from '@/contexts/FilterContext';

export default function ProductSort() {
  const { sortOption, setSortOption } = useFilter();
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = sortOptions.find(option => option.id === selectedId);
    if (selected) {
      setSortOption(selected);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-sm font-medium whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortOption.id}
        onChange={handleSortChange}
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}