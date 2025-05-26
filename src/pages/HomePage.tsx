import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { getFeaturedCategories } from '@/lib/api';
import { Category, Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get categories
        const categories = getFeaturedCategories();
        setFeaturedCategories(categories);
        
        // Get trending products
        const { products } = await fetchProducts({ limit: 8 });
        setTrendingProducts(products);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16 md:py-24 lg:py-32"
        >
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              Discover the Latest in Tech & Fashion
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              Shop our curated collection of premium products at unbeatable prices. From cutting-edge electronics to stylish accessories.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild>
                <Link to="/products">
                  Shop Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products?category=smartphones">
                  Explore Tech
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute right-0 bottom-0 w-1/2 h-1/2 pointer-events-none opacity-70 md:opacity-100"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1337753/pexels-photo-1337753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom right',
            }}
          />
        </motion.div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link to="/products" className="text-sm font-medium flex items-center hover:underline">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="aspect-[4/3] bg-secondary animate-pulse rounded-lg" />
                ))
              : featuredCategories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
          </div>
        </div>
      </section>
      
      {/* Trending Products Section */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Products</h2>
            <Link to="/products" className="text-sm font-medium flex items-center hover:underline">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <ProductGrid products={trendingProducts} isLoading={isLoading} />
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
              />
              <Button className="whitespace-nowrap" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}