import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Minus, Plus, ShoppingCart, Star, Check, ChevronLeft } from 'lucide-react';
import { Product } from '@/types';
import { fetchProduct, fetchRelatedProducts } from '@/lib/api';
import { formatPrice, calculateDiscountedPrice, generateColors, generateSizes } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, isInCart } = useCart();
  
  useEffect(() => {
    if (!id) return;
    
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProduct(parseInt(id));
        setProduct(data);
        
        // Generate colors and sizes based on product category
        const colors = generateColors(data.category);
        const sizes = generateSizes(data.category);
        
        setAvailableColors(colors);
        setAvailableSizes(sizes);
        
        if (colors.length > 0) {
          setSelectedColor(colors[0]);
        }
        
        if (sizes.length > 0) {
          setSelectedSize(sizes[0]);
        }
        
        // Load related products
        const related = await fetchRelatedProducts(data.category, data.id);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Simulate network delay
    setTimeout(() => {
      addToCart(
        product,
        quantity,
        availableColors.length > 0 ? selectedColor : undefined,
        availableSizes.length > 0 ? selectedSize : undefined
      );
      
      toast.success(`${product.title} added to cart!`);
      setIsAddingToCart(false);
    }, 600);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="bg-secondary h-96 rounded-lg"></div>
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-8 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-6 bg-secondary rounded w-1/3"></div>
              <div className="h-24 bg-secondary rounded w-full"></div>
              <div className="h-10 bg-secondary rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-6 text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
      </div>
    );
  }
  
  const { title, brand, description, price, discountPercentage, rating, stock, category, images } = product;
  const discountedPrice = calculateDiscountedPrice(price, discountPercentage);
  const isDiscounted = discountPercentage > 0;
  const isInStock = stock > 0;
  const alreadyInCart = isInCart(product.id);
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Swiper
                modules={[Pagination, Navigation]}
                navigation
                pagination={{ clickable: true }}
                className="rounded-lg overflow-hidden"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-secondary relative">
                      <img
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-2 text-sm text-muted-foreground">
                {brand} / {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
                </div>
                
                <span className="text-sm text-muted-foreground">
                  {isInStock ? `${stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold">
                  {formatPrice(discountedPrice)}
                </span>
                
                {isDiscounted && (
                  <span className="ml-2 text-lg text-muted-foreground line-through">
                    {formatPrice(price)}
                  </span>
                )}
                
                {isDiscounted && (
                  <span className="ml-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="prose prose-sm mb-6 text-muted-foreground">
                <p>{description}</p>
              </div>
              
              {/* Color selection */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedColor === color
                            ? 'ring-2 ring-primary ring-offset-2'
                            : 'ring-1 ring-border'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      >
                        {selectedColor === color && color !== '#FFFFFF' && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                        {selectedColor === color && color === '#FFFFFF' && (
                          <Check className="h-4 w-4 text-black" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size selection */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] h-10 px-3 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border rounded-l-md text-lg disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-14 h-10 flex items-center justify-center border-t border-b">
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stock}
                    className="w-10 h-10 flex items-center justify-center border rounded-r-md text-lg disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Add to cart button */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart}
                  isLoading={isAddingToCart}
                >
                  {!isAddingToCart && (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {alreadyInCart ? 'Add Again' : 'Add to Cart'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}