'use client';

import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  size?: string;
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  size,
  color,
  disabled = false,
  fullWidth = false,
  label = 'ADD TO BAG',
}: AddToCartButtonProps) {
  const { addToCart, isAddingToCart } = useCart();

  const handleClick = () => {
    addToCart({ productId, quantity, size, color });
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={isAddingToCart}
      disabled={disabled || isAddingToCart}
      fullWidth={fullWidth}
      variant="primary"
      size="lg"
      className="gap-2"
    >
      <ShoppingBag className="h-5 w-5" />
      {label}
    </Button>
  );
}
