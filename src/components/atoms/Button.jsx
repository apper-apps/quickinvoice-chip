import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  className,
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary-hover hover:to-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-primary/50",
    secondary: "bg-white text-secondary border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-gray-500/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary/50"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[40px]",
    md: "px-5 py-3 text-sm min-h-[48px]",
    lg: "px-6 py-3 text-base min-h-[52px]",
    xl: "px-8 py-4 text-lg min-h-[56px]"
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {loading && (
        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;