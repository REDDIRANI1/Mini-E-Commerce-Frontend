import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/lib/api';
import { Product, FilterOptions } from '@/types';
import { useFilter } from '@/contexts/FilterContext';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filters,
    setFilters,
    sortOption,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
  } = useFilter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const PRODUCTS_PER_PAGE = 20;

  // Initialize filters from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters({ ...filters, category: categoryParam });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);

        // let sortBy = '';  

        // if (sortOption.id === 'price-asc') {
        //   sortBy = 'price';
        // } else if (sortOption.id === 'price-desc') {
        //   sortBy = 'price';
        // } else if (sortOption.id === 'rating-desc') {
        //   sortBy = 'rating';
        // }

        const fetchParams: any = {
          limit: PRODUCTS_PER_PAGE,
        };

        if (debouncedSearchQuery) {
          fetchParams.q = debouncedSearchQuery;
        }

        if (filters.category) {
          fetchParams.category = filters.category;
        }

        const { products } = await fetchProducts(fetchParams);

        setProducts(products);
        setHasMore(products.length === PRODUCTS_PER_PAGE);
        setPage(1);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [filters.category, debouncedSearchQuery, sortOption.id]);

  // Apply client-side filters
  useEffect(() => {
    let result = [...products];

    if (filters.minPrice) {
      result = result.filter((product) => product.price >= (filters.minPrice || 0));
    }

    if (filters.maxPrice) {
      result = result.filter((product) => product.price <= (filters.maxPrice || Infinity));
    }

    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    if (typeof filters.rating === 'number') {
  const ratingThreshold: number = filters.rating;
  result = result.filter((product) => product.rating >= ratingThreshold);
}


    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0);
    }

    setFilteredProducts(result);
  }, [products, filters]);

  // Update URL when category changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (filters.category) {
      newSearchParams.set('category', filters.category);
    } else {
      newSearchParams.delete('category');
    }

    setSearchParams(newSearchParams);
  }, [filters.category, searchParams, setSearchParams]);

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      // let sortBy = '';  

      // if (sortOption.id === 'price-asc') {
      //   sortBy = 'price';
      // } else if (sortOption.id === 'price-desc') {
      //   sortBy = 'price';
      // } else if (sortOption.id === 'rating-desc') {
      //   sortBy = 'rating';
      // }

      const fetchParams: any = {
        limit: PRODUCTS_PER_PAGE,
        skip: (nextPage - 1) * PRODUCTS_PER_PAGE,
      };

      if (debouncedSearchQuery) {
        fetchParams.q = debouncedSearchQuery;
      }

      if (filters.category) {
        fetchParams.category = filters.category;
      }

      const { products: newProducts } = await fetchProducts(fetchParams);

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length === PRODUCTS_PER_PAGE);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categoryId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {filters.category ? getCategoryName(filters.category) : 'All Products'}
            </h1>

            <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
              <span>{filteredProducts.length} products</span>

              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'category') return null;

                return (
                  <span
                    key={key}
                    className="inline-flex items-center bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs"
                  >
                    {key === 'minPrice'
                      ? 'Min Price'
                      : key === 'maxPrice'
                      ? 'Max Price'
                      : key === 'inStock'
                      ? 'In Stock'
                      : key === 'rating'
                      ? `${value}+ Stars`
                      : value}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof FilterOptions];
                        setFilters(newFilters);
                      }}
                      className="ml-1 hover:text-muted-foreground/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <ProductFilters products={products} isLoading={isLoading} />
          </div>

          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 w-full sm:w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              <ProductSort />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <ProductGrid products={filteredProducts} isLoading={isLoading} />

              {!isLoading && filteredProducts.length > 0 && hasMore && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMoreProducts} isLoading={loadingMore} variant="outline" size="lg">
                    Load More
                  </Button>
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search term to find what you're looking for.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
