import { forwardRef } from 'react';

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border border-slate-200 bg-white shadow-md ${className}`}
    {...props}
  />
));

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`border-b border-slate-200 p-4 ${className}`} {...props} />
));

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-4 ${className}`} {...props} />
));

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardContent };
