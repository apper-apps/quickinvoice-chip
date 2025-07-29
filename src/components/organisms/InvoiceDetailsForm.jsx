import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import DateField from "@/components/molecules/DateField";
import ApperIcon from "@/components/ApperIcon";

const InvoiceDetailsForm = ({ formData, updateField }) => {
  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ApperIcon name="Calendar" className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Invoice Number"
          id="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={(e) => updateField("invoiceNumber", e.target.value)}
          placeholder="INV-001"
          required
        />
        
        <DateField
          label="Invoice Date"
          id="date"
          value={formData.date || today}
          onChange={(e) => updateField("date", e.target.value)}
          required
        />
        
        <DateField
          label="Due Date"
          id="dueDate"
          value={formData.dueDate || nextMonth}
          onChange={(e) => updateField("dueDate", e.target.value)}
          required
        />
      </div>
    </Card>
  );
};

export default InvoiceDetailsForm;