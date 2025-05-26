import { useState, useEffect } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { Product } from '@/types';
import { getUniqueValues } from '@/lib/utils';
import { Sliders, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductFiltersProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductFilters({ products, isLoading }: ProductFiltersProps) {
  const { filters, updateFilter, clearFilters } = useFilter();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 2000,
  });
  
  useEffect(() => {
    if (products.length > 0) {
      // Extract unique brands
      const uniqueBrands = getUniqueValues(products, 'brand');
      setBrands(uniqueBrands as string[]);
      
      // Calculate price range
      const prices = products.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      
      setPriceRange({ min: minPrice, max: maxPrice });
    }
  }, [products]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 w-24 bg-muted rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-36 bg-muted rounded"></div>
          <div className="h-56 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  
  return (
    <>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleMobileFilters}
          className="flex items-center gap-2"
        >
          <Sliders className="h-4 w-4" />
          Filters
        </Button>
        
        {Object.keys(filters).length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Filter sidebar for mobile */}
      <div className={`
        fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transform transition-transform duration-300 md:hidden
        ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full w-3/4 max-w-xs bg-background border-r p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={toggleMobileFilters}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {renderFilterContent()}
          </div>
        </div>
      </div>
      
      {/* Desktop filters */}
      <div className="hidden md:block space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          
          {Object.keys(filters).length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {renderFilterContent()}
      </div>
    </>
  );
  
  function renderFilterContent() {
    return (
      <>
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">${filters.minPrice || priceRange.min}</span>
              <span className="text-sm">${filters.maxPrice || priceRange.max}</span>
            </div>
            
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.maxPrice || priceRange.max}
              onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Brand Filter */}
        {brands.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Brand</h4>
            <div className="space-y-2 max-h-48 overflow-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand}
                    onChange={() => updateFilter('brand', filters.brand === brand ? undefined : brand)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* In Stock */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={() => updateFilter('inStock', filters.inStock ? undefined : true)}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">In Stock Only</span>
          </label>
        </div>
        
        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-3">Rating</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => updateFilter('rating', filters.rating === rating ? undefined : rating)}
                  className="rounded-full border-input"
                />
                <span className="text-sm flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rating ? 'text-warning' : 'text-muted'}>★</span>
                  ))}
                  <span className="ml-1">& Up</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </>
    );
  }
}