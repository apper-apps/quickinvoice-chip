import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children,
  padding = "default",
  shadow = "default",
  className,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-100";
  
  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  };
  
  const shadows = {
    none: "",
    sm: "shadow-sm",
    default: "shadow-md",
    lg: "shadow-lg shadow-gray-200/50"
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