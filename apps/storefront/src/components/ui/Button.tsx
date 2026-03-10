import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary:
        'bg-[#ff3f6c] hover:bg-[#e6385f] text-white focus:ring-[#ff3f6c]',
      outline:
        'border-2 border-[#ff3f6c] text-[#ff3f6c] hover:bg-[#ff3f6c] hover:text-white focus:ring-[#ff3f6c]',
      ghost:
        'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
      danger:
        'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
      secondary:
        'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300',
    };

    const sizeClasses = {
      sm: 'text-xs py-1.5 px-3 gap-1',
      md: 'text-sm py-2.5 px-5 gap-2',
      lg: 'text-base py-3 px-7 gap-2',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
