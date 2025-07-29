import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const DateField = ({ 
  label, 
  id, 
  required = false, 
  error,
  className,
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
        type="date"
        error={!!error}
        {...inputProps}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateField;