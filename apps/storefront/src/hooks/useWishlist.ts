'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useEffect } from 'react';
import type { Product } from '@/types';

export function useWishlist() {
  const queryClient = useQueryClient();
  const { setWishlist, addItem, removeItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (wishlist) setWishlist(wishlist);
  }, [wishlist, setWishlist]);

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onSuccess: (data) => {
      addItem(data);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onMutate: (productId) => removeItem(productId),
    onError: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        removeMutation.mutate(product.id);
      } else {
        addMutation.mutate(product.id);
      }
    },
    [isInWishlist, addMutation, removeMutation]
  );

  return {
    isInWishlist,
    toggleWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
