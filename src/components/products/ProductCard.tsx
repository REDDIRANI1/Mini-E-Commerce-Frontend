import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { id, title, thumbnail, price, discountPercentage, rating } = product;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };
  
  const alreadyInCart = isInCart(id);
  const inWishlist = isInWishlist(id);
  const discountedPrice = calculateDiscountedPrice(price, discountPercentage);
  
  const animationDelay = index * 0.1;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className="group relative"
    >
      <Link to={`/products/${id}`} className="block">
        <div className="overflow-hidden rounded-lg bg-secondary aspect-square relative">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          <img
            src={thumbnail}
            alt={title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded">
              -{Math.round(discountPercentage)}%
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <div className="flex items-center mb-1">
            <span className="text-sm flex items-center text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-current mr-1 text-warning" />
              {rating.toFixed(1)}
            </span>
          </div>
          
          <h3 className="font-medium text-base mb-1 line-clamp-1">{title}</h3>
          
          <div className="flex items-center">
            <span className="font-semibold">
              {formatPrice(discountedPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant={inWishlist ? 'secondary' : 'default'}
            onClick={handleWishlistToggle}
            className={inWishlist ? 'text-destructive' : ''}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            size="icon"
            variant={alreadyInCart ? 'secondary' : 'default'}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}