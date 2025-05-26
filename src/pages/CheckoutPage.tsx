import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { cart, total, subtotal, discount } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to proceed with checkout.
          </p>
          <Link to="/products">
  <Button>Continue Shopping</Button>
</Link>

        </div>
      </div>
    );
  }

  const handleCheckoutSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Checkout</h1>
              
              <div className="flex items-center justify-between mb-8 border-b pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Checkout</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected
                    </p>
                  </div>
                </div>
              </div>

              <CheckoutForm onSuccess={handleCheckoutSuccess} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-lg shadow-lg p-8 text-center max-w-md mx-4"
          >
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-success-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been confirmed and will be
              shipped shortly.
            </p>
            <div className="animate-pulse">Redirecting to homepage...</div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}