import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children,
  padding = "default",
  shadow = "default",
  className,
  ...props 
}, ref) => {
const baseStyles = "bg-white rounded-xl border border-gray-100 transition-all duration-200";
  
  const paddings = {
    none: "",
    sm: "p-4 sm:p-5",
    default: "p-6 sm:p-8",
    lg: "p-8 sm:p-10"
  };
  
  const shadows = {
    none: "",
    sm: "shadow-sm hover:shadow-md",
    default: "shadow-md hover:shadow-lg",
    lg: "shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60"
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        paddings[padding],
        shadows[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;