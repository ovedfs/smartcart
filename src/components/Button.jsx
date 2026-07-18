import { forwardRef } from 'react';

const Button = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
));

Button.displayName = 'Button';

export const buttonVariants = {
  default: 'bg-sky-600 text-white hover:bg-sky-700 shadow-md px-4 py-2 text-sm',
  outline: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 text-sm',
  ghost: 'text-slate-600 hover:bg-slate-100 px-2 py-1 text-xs',
  destructive: 'bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 text-xs',
};

export default Button;
