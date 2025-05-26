import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface CartSummaryProps {
  onCheckout: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { subtotal, discount, total, promoCode, applyPromoCode, removePromoCode } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  
  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setError('Please enter a promo code');
      return;
    }
    
    setIsApplying(true);
    setError('');
    
    setTimeout(() => {
      const success = applyPromoCode(promoInput.trim());
      
      if (success) {
        toast.success(`Promo code ${promoInput} applied successfully!`);
        setPromoInput('');
      } else {
        setError('Invalid promo code');
        toast.error('Invalid promo code');
      }
      
      setIsApplying(false);
    }, 800);
  };
  
  const handleRemovePromo = () => {
    removePromoCode();
    toast.info('Promo code removed');
  };
  
  return (
    <div className="bg-card shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between text-success"
          >
            <span>Discount {promoCode && `(${promoCode.code})`}</span>
            <span>-{formatPrice(discount)}</span>
          </motion.div>
        )}
        
        <div className="flex justify-between border-t pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      {!promoCode ? (
        <div className="mb-6">
          <label htmlFor="promo-code" className="block text-sm font-medium mb-2">
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code"
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter code"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button 
              onClick={handleApplyPromo} 
              isLoading={isApplying}
              className="whitespace-nowrap"
            >
              Apply
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            Try: WELCOME10, SUMMER25, or FREESHIP
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-secondary p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">{promoCode.code}</span>
              <p className="text-xs text-muted-foreground">{promoCode.description}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemovePromo}
              className="text-muted-foreground"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full" 
        size="lg"
        onClick={onCheckout}
      >
        Proceed to Checkout
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}