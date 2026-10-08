import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductColor, SizeOption } from '../types/product';
import { STORE_CONFIG } from '../data/products';

interface CartContextType {
  items: CartItem[];
  favorites: string[];
  isDrawerOpen: boolean;
  lastAddedTimestamp: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (
    product: Product,
    size?: SizeOption,
    color?: ProductColor,
    quantity?: number,
    openCartDrawer?: boolean
  ) => void;
  removeFromCart: (productId: string, size: SizeOption, colorName: string) => void;
  updateQuantity: (productId: string, size: SizeOption, colorName: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  freeShippingRemaining: number;
}

const CART_STORAGE_KEY = 'pequenitos_cart_v1';
const FAVORITES_STORAGE_KEY = 'pequenitos_favorites_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedTimestamp, setLastAddedTimestamp] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage quota errors
    }
  }, [favorites]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (
    product: Product,
    size?: SizeOption,
    color?: ProductColor,
    quantity: number = 1,
    openCartDrawer: boolean = true
  ) => {
    const selectedSize = size || product.sizes[0] || '0-3M';
    const selectedColor = color || product.colors[0] || { name: 'Clásico', hex: '#F5EFE6' };

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });

    setLastAddedTimestamp(Date.now());
    if (openCartDrawer) {
      setIsDrawerOpen(true);
    }
  };

  const removeFromCart = (productId: string, size: SizeOption, colorName: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: SizeOption,
    colorName: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor.name === colorName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const shippingCost =
    subtotal === 0
      ? 0
      : subtotal >= STORE_CONFIG.freeShippingThreshold
      ? 0
      : STORE_CONFIG.standardShippingCost;

  const total = subtotal + shippingCost;
  const freeShippingRemaining = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        favorites,
        isDrawerOpen,
        lastAddedTimestamp,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        totalItems,
        subtotal,
        shippingCost,
        total,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
