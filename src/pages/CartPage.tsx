import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { cart, clearCart, totalItems } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };
  
  if (totalItems === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Cart ({totalItems})</h1>
          
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-muted-foreground"
                    disabled={isClearing}
                  >
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItem item={item} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
            
            {/* Sticky checkout for mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-md lg:hidden z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">{formatPrice(100)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}