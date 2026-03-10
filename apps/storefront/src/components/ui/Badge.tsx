import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'new' | 'hot' | 'default' | 'success' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    discount: 'bg-[#ff3f6c] text-white',
    new: 'bg-green-500 text-white',
    hot: 'bg-orange-500 text-white',
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center text-xs font-bold px-1.5 py-0.5 rounded',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
