'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useEffect } from 'react';

export function useCart() {
  const queryClient = useQueryClient();
  const { setCart, removeItem, updateItem, clearCart: clearCartStore } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cart) setCart(cart);
  }, [cart, setCart]);

  const addMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
      size,
      color,
    }: {
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
    }) => cartService.addToCart(productId, quantity, size, color),
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(['cart'], data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onMutate: (itemId) => removeItem(itemId),
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(['cart'], data);
    },
    onError: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onMutate: ({ itemId, quantity }) => updateItem(itemId, quantity),
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(['cart'], data);
    },
    onError: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      clearCartStore();
      queryClient.setQueryData(['cart'], null);
    },
  });

  const addToCart = useCallback(
    (params: { productId: string; quantity: number; size?: string; color?: string }) => {
      addMutation.mutate(params);
    },
    [addMutation]
  );

  const removeFromCart = useCallback(
    (itemId: string) => removeMutation.mutate(itemId),
    [removeMutation]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => updateMutation.mutate({ itemId, quantity }),
    [updateMutation]
  );

  const clearCart = useCallback(() => clearMutation.mutate(), [clearMutation]);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isAddingToCart: addMutation.isPending,
    isRemovingFromCart: removeMutation.isPending,
    isUpdatingCart: updateMutation.isPending,
  };
}
