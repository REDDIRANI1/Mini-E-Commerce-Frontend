import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { FilterProvider } from './contexts/FilterContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <FilterProvider>
              <App />
              <Toaster position="top-right" richColors />
            </FilterProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);