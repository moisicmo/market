import { useState } from 'react';

export interface PublicCartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export const usePublicCart = () => {
  const [items, setItems] = useState<PublicCartItem[]>([]);

  const addItem = (item: Omit<PublicCartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, total, count, addItem, removeItem, updateQuantity, clearCart };
};
