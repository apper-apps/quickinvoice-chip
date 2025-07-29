import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  id, 
  required = false, 
  error,
  helperText,
  className,
  inputClassName,
  ...inputProps 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input
        id={id}
        error={!!error}
        className={inputClassName}
        {...inputProps}
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

export default FormField;