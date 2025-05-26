import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export default function CartItem({ item, index }: CartItemProps) {
  const { id, title, thumbnail, price, quantity, selectedColor, selectedSize } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(id);
    }, 300);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0 : 1, y: isRemoving ? 20 : 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: isRemoving ? 0 : index * 0.1 }}
      className="flex py-4 border-b last:border-0"
    >
      <Link to={`/products/${id}`} className="flex-shrink-0 mr-4">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-20 h-20 object-cover rounded-md"
        />
      </Link>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <Link to={`/products/${id}`} className="font-medium hover:underline line-clamp-1">
            {title}
          </Link>
          <span className="font-semibold">{formatPrice(price * quantity)}</span>
        </div>
        
        <div className="text-sm text-muted-foreground mt-1">
          {selectedSize && <span className="mr-3">Size: {selectedSize}</span>}
          {selectedColor && (
            <span className="flex items-center">
              Color: 
              <span 
                className="inline-block w-3 h-3 rounded-full ml-1 border" 
                style={{ backgroundColor: selectedColor }}
              />
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 text-lg"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}