import { forwardRef } from 'react';

const Checkbox = forwardRef(({ className, checked, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
      checked
        ? 'border-emerald-500 bg-emerald-500 text-white'
        : 'border-slate-300 text-transparent'
    } ${className}`}
    {...props}
  >
    ✓
  </div>
));

Checkbox.displayName = 'Checkbox';

export default Checkbox;
