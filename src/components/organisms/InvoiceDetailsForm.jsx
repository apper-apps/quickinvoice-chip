import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import DateField from "@/components/molecules/DateField";
import ApperIcon from "@/components/ApperIcon";

const InvoiceDetailsForm = ({ formData, updateField }) => {
  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </Card>
  );
};

export default InvoiceDetailsForm;