import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, PromoCode, Product } from '@/types';
import { setLocalStorageItem, getLocalStorageItem } from '@/lib/utils';
import { validatePromoCode } from '@/lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  promoCode: PromoCode | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  discount: number;
  total: number;
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => getLocalStorageItem('cart', []));
  const [promoCode, setPromoCode] = useState<PromoCode | null>(() => getLocalStorageItem('promoCode', null));
  
  useEffect(() => {
    setLocalStorageItem('cart', cart);
  }, [cart]);
  
  useEffect(() => {
    setLocalStorageItem('promoCode', promoCode);
  }, [promoCode]);
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = promoCode ? (subtotal * promoCode.discount) / 100 : 0;
  const total = subtotal - discount;
  
  const addToCart = (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      
      if (existingItemIndex >= 0) {
        return prevCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity, selectedColor, selectedSize }];
    });
  };
  
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
  };
  
  const applyPromoCode = (code: string) => {
    const validPromo = validatePromoCode(code);
    if (validPromo) {
      setPromoCode(validPromo);
      return true;
    }
    return false;
  };
  
  const removePromoCode = () => {
    setPromoCode(null);
  };
  
  const isInCart = (id: number) => {
    return cart.some(item => item.id === id);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      promoCode,
      applyPromoCode,
      removePromoCode,
      discount,
      total,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}