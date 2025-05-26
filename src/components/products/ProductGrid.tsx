import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const [loadingCards, setLoadingCards] = useState<Product[]>([]);
  
  useEffect(() => {
    if (isLoading) {
      // Create placeholder loading products
      setLoadingCards(
        Array.from({ length: 8 }, (_, i) => ({
          id: i,
          title: 'Loading...',
          description: '',
          price: 0,
          discountPercentage: 0,
          rating: 0,
          stock: 0,
          brand: '',
          category: '',
          thumbnail: '',
          images: [],
        }))
      );
    } else {
      setLoadingCards([]);
    }
  }, [isLoading]);
  
  const displayProducts = isLoading ? loadingCards : products;
  
  if (displayProducts.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground text-center">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {displayProducts.map((product, index) => (
        <div key={product.id} className={isLoading ? 'animate-pulse' : ''}>
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
}