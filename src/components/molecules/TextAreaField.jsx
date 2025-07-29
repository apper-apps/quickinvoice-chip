import React, { forwardRef } from "react";
import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({ 
  error = false,
  disabled = false,
  rows = 3,
  className,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2.5 border rounded-md text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical";
  
  const variants = {
    default: "border-gray-200 focus:border-primary focus:ring-primary/20 bg-white",
    error: "border-error focus:border-error focus:ring-error/20 bg-red-50"
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      className={cn(
        baseStyles,
        error ? variants.error : variants.default,
        className
      )}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

const TextAreaField = ({ 
  label, 
  id, 
  required = false, 
  error,
  helperText,
  className,
  textAreaClassName,
  ...textAreaProps 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <TextArea
        id={id}
        error={!!error}
        className={textAreaClassName}
        {...textAreaProps}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default TextAreaField;