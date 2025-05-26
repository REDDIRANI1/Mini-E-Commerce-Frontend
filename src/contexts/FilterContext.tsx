import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { FilterOptions, SortOption } from '@/types';
import { debounce } from '@/lib/utils';

interface FilterContextType {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  updateFilter: (key: keyof FilterOptions, value: any) => void;
  clearFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
}

const DEFAULT_SORT: SortOption = {
  id: 'default',
  name: 'Relevance',
  value: '',
};

const sortOptions: SortOption[] = [
  DEFAULT_SORT,
  { id: 'price-asc', name: 'Price: Low to High', value: 'price-asc' },
  { id: 'price-desc', name: 'Price: High to Low', value: 'price-desc' },
  { id: 'rating-desc', name: 'Rating: High to Low', value: 'rating-desc' },
];

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );
  
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };
  
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({});
    setSortOption(DEFAULT_SORT);
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };
  
  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        sortOption,
        setSortOption,
        searchQuery,
        setSearchQuery: updateSearchQuery,
        debouncedSearchQuery
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

export { sortOptions };