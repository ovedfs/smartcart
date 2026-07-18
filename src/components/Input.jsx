import { forwardRef } from 'react';

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50 disabled:cursor-not-allowed w-full ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
